const mongoose = require('mongoose');

// User schema definition
const userSchema = new mongoose.Schema({
  telegramId: {
    type: Number,
    required: true,
    unique: true,
    index: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    default: '',
    trim: true
  },
  username: {
    type: String,
    default: '',
    trim: true
  },
  languageCode: {
    type: String,
    default: 'en'
  },
  isPremium: {
    type: Boolean,
    default: false
  },
  photoUrl: {
    type: String,
    default: ''
  },
  coins: {
    type: Number,
    default: 1000,
    min: 0
  },
  xp: {
    type: Number,
    default: 200,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  totalScore: {
    type: Number,
    default: 100,
    min: 0
  },
  gamesPlayed: {
    type: Number,
    default: 0,
    min: 0
  },
  gamesWon: {
    type: Number,
    default: 0,
    min: 0
  },
  winRate: {
    type: Number,
    default: 0,
    min: 0,
    max: 100
  },
  streak: {
    type: Number,
    default: 0,
    min: 0
  },
  maxStreak: {
    type: Number,
    default: 0,
    min: 0
  },
  achievements: {
    type: [String],
    default: []
  },
  settings: {
    language: {
      type: String,
      default: 'en'
    },
    notifications: {
      type: Boolean,
      default: true
    },
    sound: {
      type: Boolean,
      default: true
    },
    vibration: {
      type: Boolean,
      default: true
    }
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'users'
});

// Index for better query performance
userSchema.index({ telegramId: 1 });
userSchema.index({ username: 1 });

// Instance methods
userSchema.methods.updateActivity = function() {
  this.lastActivity = new Date();
  return this.save();
};

userSchema.methods.addCoins = function(amount) {
  this.coins += amount;
  return this.save();
};

userSchema.methods.addXP = function(amount) {
  this.xp += amount;
  // Level up logic (every 1000 XP = 1 level)
  const newLevel = Math.floor(this.xp / 1000) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
  }
  return this.save();
};

userSchema.methods.addScore = function(amount) {
  this.totalScore += amount;
  return this.save();
};

userSchema.methods.updateGameStats = function(won) {
  this.gamesPlayed += 1;
  if (won) {
    this.gamesWon += 1;
    this.streak += 1;
    if (this.streak > this.maxStreak) {
      this.maxStreak = this.streak;
    }
  } else {
    this.streak = 0;
  }
  this.winRate = this.gamesPlayed > 0 ? Math.round((this.gamesWon / this.gamesPlayed) * 100) : 0;
  return this.save();
};

userSchema.methods.addAchievement = function(achievement) {
  if (!this.achievements.includes(achievement)) {
    this.achievements.push(achievement);
    return this.save();
  }
  return Promise.resolve(this);
};

userSchema.methods.updateSettings = function(newSettings) {
  this.settings = { ...this.settings, ...newSettings };
  return this.save();
};

userSchema.methods.updateActivity = function() {
  this.lastActive = new Date();
  return this.save();
};

userSchema.methods.canAfford = function(amount) {
  return this.coins >= amount;
};

userSchema.methods.spendCoins = function(amount) {
  if (this.canAfford(amount)) {
    this.coins -= amount;
    return this.save();
  }
  throw new Error('Insufficient coins');
};

// Static methods
userSchema.statics.findByTelegramId = function(telegramId) {
  return this.findOne({ telegramId });
};

userSchema.statics.findByUserId = function(userId) {
  return this.findOne({ telegramId: userId });
};

userSchema.statics.createUser = function(userData) {
  return this.create({
    telegramId: userData.telegramId || userData.userId,
    firstName: userData.firstName || 'User',
    lastName: userData.lastName || '',
    username: userData.username || '',
    languageCode: userData.languageCode || 'en',
    isPremium: userData.isPremium || false,
    photoUrl: userData.photoUrl || '',
    coins: 1000,
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
      language: userData.languageCode || 'en',
      notifications: true,
      sound: true,
      vibration: true
    }
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;