import { NextRequest, NextResponse } from 'next/server';
import { validateInitData } from '../initDataValidator';

/**
 * Middleware to validate Telegram init data in API requests
 */
export async function validateTelegramInitData(
  request: NextRequest,
  botToken: string
) {
  try {
    // Get init data from different possible sources
    let initData: string | null = null;
    
    // 1. Check Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('tma ')) {
      initData = authHeader.substring(4); // Remove 'tma ' prefix
    }
    
    // 2. Check X-Telegram-Init-Data header
    if (!initData) {
      initData = request.headers.get('x-telegram-init-data');
    }
    
    // 3. Check request body for initData field
    if (!initData) {
      try {
        const body = await request.json();
        initData = body.initData || body.init_data;
      } catch {
        // Body is not JSON or empty, continue
      }
    }
    
    // 4. Check query parameters
    if (!initData) {
      const url = new URL(request.url);
      initData = url.searchParams.get('initData') || url.searchParams.get('init_data');
    }
    
    if (!initData) {
      return NextResponse.json(
        { 
          error: 'Missing init data',
          message: 'Telegram init data is required for authentication'
        },
        { status: 401 }
      );
    }
    
    // Validate the init data
    const validationResult = await validateInitData(initData, botToken);
    
    if (!validationResult.isValid) {
      return NextResponse.json(
        {
          error: 'Invalid init data',
          message: validationResult.error?.message || 'Init data validation failed',
          type: validationResult.error?.type
        },
        { status: 401 }
      );
    }
    
    // Return validated data for use in the API route
    return {
      isValid: true,
      initData: validationResult.data,
      user: validationResult.data?.user || null
    };
    
  } catch (error: any) {
    console.error('Init data middleware error:', error);
    return NextResponse.json(
      {
        error: 'Validation error',
        message: 'Failed to validate init data'
      },
      { status: 500 }
    );
  }
}

/**
 * Higher-order function to wrap API routes with init data validation
 */
export function withInitDataValidation(
  handler: (request: NextRequest, validatedData: any) => Promise<NextResponse>,
  botToken: string
) {
  return async (request: NextRequest) => {
    const validation = await validateTelegramInitData(request, botToken);
    
    // If validation failed, return the error response
    if (validation instanceof NextResponse) {
      return validation;
    }
    
    // If validation succeeded, call the original handler with validated data
    return handler(request, validation);
  };
}