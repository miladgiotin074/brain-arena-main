const mongoose = require('mongoose');

// User schema definition
const userSchema = new mongoose.Schema({
  userId: {
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
  coins: {
    type: Number,
    default: 100,
    min: 0
  },
  score: {
    type: Number,
    default: 40,
    min: 0
  },
  xp: {
    type: Number,
    default: 30,
    min: 0
  },
  level: {
    type: Number,
    default: 1,
    min: 1
  },
  isActive: {
    type: Boolean,
    default: true
  },
  lastActivity: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true, // Automatically adds createdAt and updatedAt
  collection: 'users'
});

// Index for better query performance
userSchema.index({ userId: 1 });
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
  // Level up logic (every 100 XP = 1 level)
  const newLevel = Math.floor(this.xp / 100) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
  }
  return this.save();
};

userSchema.methods.addScore = function(amount) {
  this.score += amount;
  return this.save();
};

// Static methods
userSchema.statics.findByUserId = function(userId) {
  return this.findOne({ userId });
};

userSchema.statics.createUser = function(userData) {
  return this.create({
    userId: userData.userId,
    firstName: userData.firstName || 'User',
    lastName: userData.lastName || '',
    username: userData.username || '',
    coins: 100,
    score: 40,
    xp: 30,
    level: 1
  });
};

const User = mongoose.model('User', userSchema);

module.exports = User;