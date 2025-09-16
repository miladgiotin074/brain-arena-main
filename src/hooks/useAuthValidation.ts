'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { retrieveRawInitData } from '@telegram-apps/sdk-react';

interface ValidationResult {
  isValid: boolean;
  isLoading: boolean;
  error?: {
    type: string;
    message: string;
  };
}

export function useAuthValidation() {
  const [validationResult, setValidationResult] = useState<ValidationResult>({
    isValid: false,
    isLoading: true
  });
  const router = useRouter();

  useEffect(() => {
    const validateAuth = async () => {
      try {
        // Get init data from Telegram SDK
        const rawInitData = retrieveRawInitData();
        
        if (!rawInitData) {
          // Redirect to auth error page
          router.push('/auth-error?type=SIGNATURE_MISSING&message=No init data available');
          return;
        }

        // Validate with backend API
        const response = await fetch('/api/auth/validate', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Telegram-Init-Data': rawInitData
          },
          body: JSON.stringify({ initData: rawInitData })
        });

        if (!response.ok) {
          const errorData = await response.json();
          // Redirect to auth error page with specific error
          const errorType = errorData.type || 'UNKNOWN';
          const errorMessage = errorData.message || 'Validation failed';
          router.push(`/auth-error?type=${errorType}&message=${encodeURIComponent(errorMessage)}`);
          return;
        }

        // Validation successful
        setValidationResult({
          isValid: true,
          isLoading: false
        });

      } catch (error: any) {
        console.error('Auth validation error:', error);
        // Redirect to auth error page
        router.push('/auth-error?type=UNKNOWN&message=Validation failed');
      }
    };

    validateAuth();
  }, [router]);

  return validationResult;
}