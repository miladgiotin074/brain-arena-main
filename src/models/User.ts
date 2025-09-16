import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
  coins: number;
  xp: number;
  level: number;
  totalScore: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  streak: number;
  maxStreak: number;
  achievements: string[];
  settings: {
    language: string;
    notifications: boolean;
    sound: boolean;
    vibration: boolean;
  };
  createdAt: Date;
  lastActive: Date;
  // Instance methods
  addCoins(amount: number): Promise<IUser>;
  addXP(amount: number): Promise<IUser>;
  addScore(score: number): Promise<IUser>;
  updateGameStats(won: boolean): Promise<IUser>;
}

export interface IUserModel extends Model<IUser> {
  findByTelegramId(telegramId: number): Promise<IUser | null>;
  getLeaderboard(limit?: number): Promise<IUser[]>;
}

export interface IUserDocument extends IUser, Document {
  telegramId: number;
  firstName: string;
  lastName?: string;
  username?: string;
  languageCode?: string;
  isPremium?: boolean;
  photoUrl?: string;
  coins: number;
  xp: number;
  level: number;
  totalScore: number;
  gamesPlayed: number;
  gamesWon: number;
  winRate: number;
  streak: number;
  maxStreak: number;
  achievements: string[];
  settings: {
    language: string;
    notifications: boolean;
    sound: boolean;
    vibration: boolean;
  };
  createdAt: Date;
  lastActive: Date;
}

const UserSchema = new Schema<IUserDocument>({
  telegramId: {
    type: Number,
    required: true,
    unique: true
  },
  firstName: {
    type: String,
    required: true,
    trim: true
  },
  lastName: {
    type: String,
    trim: true,
    default: ''
  },
  username: {
    type: String,
    trim: true,
    default: ''
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
  createdAt: {
    type: Date,
    default: Date.now
  },
  lastActive: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: {
    transform: function(doc: any, ret: any) {
      ret.id = ret._id;
      delete ret._id;
      delete ret.__v;
      return ret;
    }
  }
});

// Indexes for better performance
UserSchema.index({ telegramId: 1 });
UserSchema.index({ username: 1 });
UserSchema.index({ level: -1 });
UserSchema.index({ totalScore: -1 });
UserSchema.index({ lastActive: -1 });

// Pre-save middleware to calculate win rate
UserSchema.pre('save', function(next) {
  if (this.gamesPlayed > 0) {
    this.winRate = Math.round((this.gamesWon / this.gamesPlayed) * 100);
  } else {
    this.winRate = 0;
  }
  next();
});

// Static methods
UserSchema.statics.findByTelegramId = function(telegramId: number) {
  return this.findOne({ telegramId });
};

UserSchema.statics.getLeaderboard = function(limit: number = 10) {
  return this.find({})
    .sort({ totalScore: -1, level: -1 })
    .limit(limit)
    .select('firstName lastName username totalScore level coins xp');
};

// Instance methods
UserSchema.methods.addCoins = function(amount: number) {
  this.coins += amount;
  return this.save();
};

UserSchema.methods.addXP = function(amount: number) {
  this.xp += amount;
  // Level up logic (every 1000 XP = 1 level)
  const newLevel = Math.floor(this.xp / 1000) + 1;
  if (newLevel > this.level) {
    this.level = newLevel;
    // Bonus coins for leveling up
    this.coins += newLevel * 50;
  }
  return this.save();
};

UserSchema.methods.addScore = function(score: number) {
  this.totalScore += score;
  return this.save();
};

UserSchema.methods.updateGameStats = function(won: boolean) {
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
  this.lastActive = new Date();
  return this.save();
};

// Export the model
export const User = (mongoose.models.User || mongoose.model<IUserDocument, IUserModel>('User', UserSchema)) as IUserModel;
export default User;