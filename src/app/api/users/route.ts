import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';
import { validateTelegramInitData } from '@/lib/middleware/initDataMiddleware';

// GET /api/users - Get user by ID or Telegram ID
export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const telegramId = searchParams.get('telegramId');
    
    if (!userId && !telegramId) {
      return NextResponse.json(
        { error: 'userId or telegramId is required' },
        { status: 400 }
      );
    }
    
    let user;
    if (telegramId) {
      user = await User.findByTelegramId(parseInt(telegramId));
    } else {
      user = await User.findById(userId);
    }
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error fetching user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/users - Create or authenticate user
export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();
    
    // Get bot token from environment variables
    const botToken = process.env.TELEGRAM_BOT_TOKEN;
    if (!botToken) {
      return NextResponse.json(
        { error: 'Bot token not configured' },
        { status: 500 }
      );
    }
    
    // Validate Telegram init data
    const validation = await validateTelegramInitData(request, botToken);
    
    // If validation failed, return the error response
    if (validation instanceof NextResponse) {
      return validation;
    }
    
    // Extract user data from validated init data
    const telegramUser = validation.user;
    if (!telegramUser) {
      return NextResponse.json(
        { error: 'No user data in init data' },
        { status: 400 }
      );
    }
    
    console.log('Telegram user data:', JSON.stringify(telegramUser, null, 2));
    
    const { 
      id: telegramId, 
      first_name: firstName, 
      last_name: lastName, 
      username, 
      language_code: languageCode, 
      is_premium: isPremium, 
      photo_url: photoUrl 
    } = telegramUser;
    
    console.log('Extracted firstName:', firstName);
    console.log('Extracted telegramId:', telegramId);

    // Check if user exists
    let user = await User.findByTelegramId(telegramId);
    
    if (user) {
      // Update existing user with latest Telegram data
      user.firstName = (typeof firstName === 'string' ? firstName : undefined) || user.firstName;
      user.lastName = (typeof lastName === 'string' ? lastName : undefined) || user.lastName;
      user.username = (typeof username === 'string' ? username : undefined) || user.username;
      user.languageCode = (typeof languageCode === 'string' ? languageCode : undefined) || user.languageCode;
      user.isPremium = (typeof isPremium === 'boolean' ? isPremium : undefined) ?? user.isPremium;
      user.photoUrl = (typeof photoUrl === 'string' ? photoUrl : undefined) || user.photoUrl;
      user.lastActive = new Date();
      
      await user.save();
    } else {
      // Create new user with default values
      user = new User({
        telegramId,
        firstName: firstName || '',
        lastName: lastName || '',
        username: username || '',
        languageCode: languageCode || 'en',
        isPremium: isPremium || false,
        photoUrl: photoUrl || '',
        coins: 1000, // Starting coins
        xp: 200,
        level: 1,
        totalScore: 100,
        gamesPlayed: 0,
        gamesWon: 0,
        winRate: 0,
        streak: 0,
        maxStreak: 0,
        achievements: [],
        settings: {
          language: languageCode || 'en',
          notifications: true,
          sound: true,
          vibration: true
        },
        createdAt: new Date(),
        lastActive: new Date()
      });
      
      await user.save();
    }
    
    return NextResponse.json({ 
      user,
      isNewUser: user.createdAt.getTime() === user.lastActive.getTime()
    });
  } catch (error) {
    console.error('Error creating/authenticating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users - Update user
export async function PUT(request: NextRequest) {
  try {
    await connectToDatabase();
    
    const body = await request.json();
    const { userId, ...updateData } = body;
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }
    
    const user = await User.findByIdAndUpdate(
      userId,
      { ...updateData, lastActive: new Date() },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json({ user });
  } catch (error) {
    console.error('Error updating user:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}