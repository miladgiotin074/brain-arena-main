'use client';

import { useEffect, useState } from 'react';
import socketService from '@/services/socketService';

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

  useEffect(() => {
    const validateAuth = () => {
      console.log('🔐 Starting authentication via socket connection');
      
      // Listen for auth success from middleware
      socketService.on('auth:success', (data) => {
        console.log('✅ Authentication successful:', data);
        setValidationResult({
          isValid: true,
          isLoading: false
        });
      });
      
      // Listen for auth failure from middleware
      socketService.on('auth:failed', (error) => {
        console.log('❌ Authentication failed:', error);
        setValidationResult({
          isValid: false,
          isLoading: false,
          error: error || { type: 'validation_failed', message: 'Authentication failed' }
        });
        // Redirect to error page on validation failure
        window.location.href = '/auth-error';
      });
      
      // Check if already connected and authenticated
      if (socketService.isConnected()) {
        console.log('✅ Socket already connected and authenticated');
        setValidationResult({
          isValid: true,
          isLoading: false
        });
      }
    };

    validateAuth();
  }, []);

  return validationResult;
}