import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import User from '@/models/User';

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
    
    const body = await request.json();
    const { telegramId, firstName, lastName, username, languageCode, isPremium, photoUrl } = body;
    
    if (!telegramId) {
      return NextResponse.json(
        { error: 'telegramId is required' },
        { status: 400 }
      );
    }
    
    // Check if user exists
    let user = await User.findByTelegramId(telegramId);
    
    if (user) {
      // Update existing user with latest Telegram data
      user.firstName = firstName || user.firstName;
      user.lastName = lastName || user.lastName;
      user.username = username || user.username;
      user.languageCode = languageCode || user.languageCode;
      user.isPremium = isPremium !== undefined ? isPremium : user.isPremium;
      user.photoUrl = photoUrl || user.photoUrl;
      user.lastActive = new Date();
      
      await user.save();
    } else {
      // Create new user with default values
      user = new User({
        telegramId,
        firstName: firstName || 'User',
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