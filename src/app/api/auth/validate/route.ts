import { NextRequest, NextResponse } from 'next/server';
import { validateInitData } from '@/lib/initDataValidator';

export async function POST(request: NextRequest) {
  try {
    // Get bot token from environment
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        {
          error: 'Server configuration error',
          message: 'Bot token not configured',
          type: 'UNKNOWN'
        },
        { status: 500 }
      );
    }

    // Get init data from different sources
    let initData: string | null = null;
    
    // 1. Check X-Telegram-Init-Data header
    initData = request.headers.get('x-telegram-init-data');
    
    // 2. Check request body
    if (!initData) {
      try {
        const body = await request.json();
        initData = body.initData;
      } catch {
        // Body parsing failed, continue
      }
    }

    if (!initData) {
      return NextResponse.json(
        {
          error: 'Missing init data',
          message: 'Telegram init data is required',
          type: 'SIGNATURE_MISSING'
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
          message: validationResult.error?.message || 'Validation failed',
          type: validationResult.error?.type || 'SIGNATURE_INVALID'
        },
        { status: 401 }
      );
    }

    // Return success with user data
    return NextResponse.json({
      success: true,
      user: validationResult.data?.user || null
    });

  } catch (error: any) {
    console.error('Auth validation API error:', error);
    return NextResponse.json(
      {
        error: 'Validation error',
        message: 'Failed to validate authentication',
        type: 'UNKNOWN'
      },
      { status: 500 }
    );
  }
}