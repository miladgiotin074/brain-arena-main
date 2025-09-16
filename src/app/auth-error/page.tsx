'use client';

import { useSearchParams } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Page } from '@/components/Page';
import { useRouter } from 'next/navigation';
import { useCallback } from 'react';

export default function AuthErrorPage() {
  const t = useTranslations('auth.error');
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const errorType = searchParams.get('type') || 'UNKNOWN_ERROR';
  const errorMessage = searchParams.get('message') || 'Unknown error occurred';
  
  const handleRetry = useCallback(() => {
    console.log('Retrying authentication...');
    router.push('/');
  }, [router]);
  
  const getErrorTitle = (type: string) => {
    switch (type) {
      case 'SIGNATURE_INVALID':
        return t('signatureInvalid');
      case 'AUTH_DATE_INVALID':
        return t('authDateInvalid');
      case 'EXPIRED':
        return t('expired');
      case 'SIGNATURE_MISSING':
        return t('signatureMissing');
      default:
        return t('unknown');
    }
  };
  
  const getErrorDescription = (type: string) => {
    switch (type) {
      case 'SIGNATURE_INVALID':
        return t('signatureInvalidDesc');
      case 'AUTH_DATE_INVALID':
        return t('authDateInvalidDesc');
      case 'EXPIRED':
        return t('expiredDesc');
      case 'SIGNATURE_MISSING':
        return t('signatureMissingDesc');
      default:
        return t('unknownDesc');
    }
  };
  
  return (
    <Page back={false}>
      <div className="flex flex-col items-center justify-center min-h-screen p-6 bg-gray-900 text-white">
        <div className="max-w-md w-full bg-gray-800 rounded-lg p-6 shadow-lg">
          {/* Error Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
          </div>
          
          {/* Error Title */}
          <h1 className="text-xl font-bold text-center mb-2">
            {getErrorTitle(errorType)}
          </h1>
          
          {/* Error Description */}
          <p className="text-gray-300 text-center mb-4">
            {getErrorDescription(errorType)}
          </p>
          
          {/* Technical Details */}
          <div className="bg-gray-700 rounded p-3 mb-4">
            <p className="text-sm text-gray-400 mb-1">{t('technicalDetails')}:</p>
            <p className="text-sm font-mono text-red-400">{errorMessage}</p>
          </div>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleRetry}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded transition-colors"
            >
              {t('retry')}
            </button>
            
            <p className="text-xs text-gray-400 text-center">
              {t('contactSupport')}
            </p>
          </div>
        </div>
      </div>
    </Page>
  );
}