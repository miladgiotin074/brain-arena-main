export interface User {
  _id: string;
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

export interface UserContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (telegramUser: TelegramUser) => Promise<void>;
  logout: () => void;
  updateUser: (updates: Partial<User>) => Promise<void>;
  addCoins: (amount: number) => Promise<void>;
  addXP: (amount: number) => Promise<void>;
  addScore: (amount: number) => Promise<void>;
  retry: () => void;
}

export interface TelegramUser {
  id: number;
  first_name: string;
  last_name?: string;
  username?: string;
  language_code?: string;
  is_premium?: boolean;
  photo_url?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  message?: string;
}

export interface UpdateUserRequest {
  userId: string;
  updates: Partial<User>;
}

export interface AddCoinsRequest {
  userId: string;
  amount: number;
}

export interface AddXPRequest {
  userId: string;
  amount: number;
}

export interface AddScoreRequest {
  userId: string;
  amount: number;
}

// For backward compatibility
export interface IUser extends User {}
export interface ITelegramUser extends TelegramUser {}