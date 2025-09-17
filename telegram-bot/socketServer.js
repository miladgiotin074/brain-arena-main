const express = require('express');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { connectDB } = require('./database');
const { findOrCreateUser, updateUser, getUserById } = require('./services/userService');
const crypto = require('crypto');
const { validate, isValid } = require('@telegram-apps/init-data-node');
require('dotenv').config();

// Create Express app and HTTP server
const app = express();
const server = createServer(app);

// Configure Socket.io with CORS for development
const io = new Server(server, {
  cors: {
    origin: ["https://localhost:3000", "https://127.0.0.1:3000", "https://172.18.0.1:3000"],
    methods: ["GET", "POST"],
    credentials: true
  },
  transports: ['websocket', 'polling']
});

const PORT = process.env.SOCKET_PORT || 3001;

console.log('try connect db.........')
// Connect to MongoDB
connectDB();

// Telegram init data validation function using official package
function validateTelegramInitData(initData, botToken) {
  console.log("hello")
  console.log(initData)
  try {
    if (!initData || !botToken) {
      return {
        isValid: false,
        error: {
          type: 'MISSING_PARAMETERS',
          message: 'Init data or bot token is missing'
        }
      };
    }

    // Use the official Telegram validation
    const validationResult = isValid(initData, botToken, {
      expiresIn: 24 * 60 * 60 // 24 hours in seconds
    });

    if (validationResult) {
      return {
        isValid: true,
        data: {
          validated: true,
          timestamp: Date.now()
        }
      };
    } else {
      return {
        isValid: false,
        error: {
          type: 'SIGNATURE_INVALID',
          message: 'Invalid signature or expired data'
        }
      };
    }

  } catch (error) {
    // Handle specific Telegram validation errors
    let errorType = 'VALIDATION_ERROR';
    let errorMessage = error.message;

    if (error.message.includes('ERR_AUTH_DATE_INVALID')) {
      errorType = 'AUTH_DATE_INVALID';
      errorMessage = 'Auth date is invalid or missing';
    } else if (error.message.includes('ERR_HASH_INVALID')) {
      errorType = 'HASH_INVALID';
      errorMessage = 'Hash is invalid or missing';
    } else if (error.message.includes('ERR_SIGN_INVALID')) {
      errorType = 'SIGNATURE_INVALID';
      errorMessage = 'Invalid signature';
    } else if (error.message.includes('ERR_EXPIRED')) {
      errorType = 'EXPIRED';
      errorMessage = 'Init data has expired';
    }

    return {
      isValid: false,
      error: {
        type: errorType,
        message: errorMessage
      }
    };
  }
}

// Authentication Middleware - اجرا قبل از برقراری connection
io.use(async (socket, next) => {
  try {
    console.log('🔐 Authentication middleware: Checking connection...');
    
    // دریافت initData از handshake auth
    const initData = socket.handshake.auth.initData;
    const botToken = process.env.BOT_TOKEN;
    
    // بررسی وجود Bot Token
    if (!botToken) {
      console.error('❌ Bot token not configured');
      return next(new Error('Authentication failed: Bot token not configured'));
    }
    
    // بررسی وجود Init Data
    if (!initData) {
      console.log('❌ No init data provided in handshake');
      return next(new Error('Authentication failed: No init data provided'));
    }
    
    console.log('🔍 Received initData:', initData.substring(0, 100) + '...');
    
    // Handle development mode or mock data
    if (process.env.NODE_ENV === 'development' || initData.includes('query_id=dev')) {
      console.log('🔧 Development mode: Allowing connection with mock data');
      socket.userId = 'dev_user_999999999';
      socket.userData = { 
        development: true,
        id: 999999999,
        first_name: 'Dev',
        last_name: 'User',
        username: 'dev_user'
      };
      return next();
    }
    
    // Validation واقعی در production mode
    const validationResult = validateTelegramInitData(initData, botToken);
    
    if (!validationResult.isValid) {
      console.log('❌ Authentication failed:', validationResult.error);
      return next(new Error(`Authentication failed: ${validationResult.error.message}`));
    }
    
    console.log('✅ Authentication successful');
    
    // ذخیره اطلاعات کاربر در socket برای استفاده بعدی
    socket.isAuthenticated = true;
    socket.validationData = validationResult.data;
    
    next(); // اجازه برقراری connection
    
  } catch (error) {
    console.error('❌ Authentication middleware error:', error);
    return next(new Error('Authentication failed: Internal error'));
  }
});

// Socket.io connection handling - فقط کاربران authenticated می‌توانند به اینجا برسند
io.on('connection', (socket) => {
  console.log(`🔌 Authenticated socket connected: ${socket.id}`);
  
  // اطلاع‌رسانی موفقیت authentication به client
  socket.emit('auth:success', {
    authenticated: true,
    socketId: socket.id,
    timestamp: Date.now()
  });

  // Authentication is now handled by middleware - no need for manual validation event

  // User authentication
  socket.on('user:authenticate', async (data) => {
    try {
      const { telegramData } = data;
      console.log('🔐 User authentication request:', telegramData?.id);
      
      const result = await findOrCreateUser(telegramData);
      socket.emit('user:authenticateResponse', {
        success: true,
        user: result.user,
        isNewUser: result.isNewUser
      });
    } catch (error) {
      console.error('❌ Authentication error:', error);
      socket.emit('user:authenticateError', {
        success: false,
        error: error.message
      });
    }
  });

  // Find or create user
  socket.on('user:findOrCreate', async (userData) => {
    try {
      console.log('👤 Find or create user:', userData?.telegramId);
      const result = await findOrCreateUser(userData);
      socket.emit('user:findOrCreateResponse', result);
    } catch (error) {
      console.error('❌ Find or create user error:', error);
      socket.emit('user:findOrCreateError', {
        error: error.message
      });
    }
  });

  // Get user by ID
  socket.on('user:getById', async (data) => {
    try {
      const { userId } = data;
      console.log('🔍 Get user by ID:', userId);
      const user = await getUserById(userId);
      socket.emit('user:getByIdResponse', { user });
    } catch (error) {
      console.error('❌ Get user by ID error:', error);
      socket.emit('user:getByIdError', {
        error: error.message
      });
    }
  });

  // Update user
  socket.on('user:update', async (data) => {
    try {
      const { userId, updates } = data;
      console.log('✏️ Update user:', userId, updates);
      const user = await updateUser(userId, updates);
      socket.emit('user:updateResponse', { user });
    } catch (error) {
      console.error('❌ Update user error:', error);
      socket.emit('user:updateError', {
        error: error.message
      });
    }
  });

  // Sample games data (in production, this would come from database)
  const sampleGames = [
    {
      id: 'game_1',
      title: 'General Knowledge Quiz',
      titleFa: 'کوییز دانش عمومی',
      description: 'Test your general knowledge',
      descriptionFa: 'دانش عمومی خود را آزمایش کنید',
      category: 'general',
      categoryFa: 'عمومی',
      difficulty: 'medium',
      difficultyFa: 'متوسط',
      playersCount: 0,
      maxPlayers: 10,
      status: 'waiting',
      createdAt: new Date().toISOString()
    },
    {
      id: 'game_2',
      title: 'Science Quiz',
      titleFa: 'کوییز علوم',
      description: 'Challenge your science knowledge',
      descriptionFa: 'دانش علمی خود را به چالش بکشید',
      category: 'science',
      categoryFa: 'علوم',
      difficulty: 'hard',
      difficultyFa: 'سخت',
      playersCount: 3,
      maxPlayers: 8,
      status: 'active',
      createdAt: new Date().toISOString()
    },
    {
      id: 'game_3',
      title: 'History Quiz',
      titleFa: 'کوییز تاریخ',
      description: 'Explore historical facts',
      descriptionFa: 'حقایق تاریخی را کشف کنید',
      category: 'history',
      categoryFa: 'تاریخ',
      difficulty: 'easy',
      difficultyFa: 'آسان',
      playersCount: 1,
      maxPlayers: 6,
      status: 'waiting',
      createdAt: new Date().toISOString()
    }
  ];

  // Games events
  socket.on('games:list', () => {
    console.log('📋 Games list requested by:', socket.id);
    socket.emit('games:list', {
      success: true,
      games: sampleGames
    });
  });

  socket.on('games:join', (data) => {
    console.log('🎮 User joined game:', data);
    const { gameId } = data;
    const game = sampleGames.find(g => g.id === gameId);
    
    if (game && game.playersCount < game.maxPlayers) {
      game.playersCount += 1;
      socket.join(gameId);
      
      // Notify user of successful join
      socket.emit('games:joinSuccess', {
        success: true,
        game: game
      });
      
      // Notify all clients about updated game
      io.emit('games:updated', {
        gameId: gameId,
        playersCount: game.playersCount
      });
    } else {
      socket.emit('games:joinError', {
        success: false,
        error: 'Game is full or not found'
      });
    }
  });

  // Quiz game events (placeholder for future implementation)
  socket.on('quiz:join', (data) => {
    console.log('🎮 User joined quiz:', data);
    // TODO: Implement quiz game logic
  });

  socket.on('quiz:answer', (data) => {
    console.log('✅ Quiz answer received:', data);
    // TODO: Implement answer processing
  });

  // Chat events (placeholder for future implementation)
  socket.on('chat:join', (data) => {
    console.log('💬 User joined chat:', data);
    // TODO: Implement chat logic
  });

  socket.on('chat:message', (data) => {
    console.log('📝 Chat message received:', data);
    // TODO: Implement message broadcasting
  });

  // Handle disconnection
  socket.on('disconnect', (reason) => {
    console.log(`🔌 Socket disconnected: ${socket.id}, reason: ${reason}`);
  });

  // Handle errors
  socket.on('error', (error) => {
    console.error('❌ Socket error:', error);
  });
});

// Basic health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    timestamp: new Date().toISOString(),
    connections: io.engine.clientsCount
  });
});

// Start the server
server.listen(PORT, () => {
  console.log(`🚀 Socket.io server running on port ${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/health`);
  console.log(`🔗 Accepting connections from frontend on port 3000`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('🛑 SIGTERM received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Socket.io server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  console.log('🛑 SIGINT received, shutting down gracefully');
  server.close(() => {
    console.log('✅ Socket.io server closed');
    process.exit(0);
  });
});

module.exports = { io, server };