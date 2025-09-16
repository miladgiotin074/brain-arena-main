import { User, TelegramUser, UpdateUserRequest, AddCoinsRequest, AddXPRequest, AddScoreRequest, AuthResponse } from '@/types/user';
import socketService from './socketService';

class UserService {
  constructor() {
    // Socket-based service, no need for baseURL
  }

  async authenticateUser(telegramData: TelegramUser): Promise<AuthResponse> {
    return new Promise((resolve, reject) => {
      socketService.emit('user:authenticate', { telegramData });
      
      const handleResponse = (response: AuthResponse) => {
        socketService.off('user:authenticateResponse', handleResponse);
        socketService.off('user:authenticateError', handleError);
        resolve(response);
      };
      
      const handleError = (error: any) => {
        socketService.off('user:authenticateResponse', handleResponse);
        socketService.off('user:authenticateError', handleError);
        reject(error);
      };
      
      socketService.on('user:authenticateResponse', handleResponse);
      socketService.on('user:authenticateError', handleError);
    });
  }

  async getUserById(userId: string): Promise<User> {
    return new Promise((resolve, reject) => {
      socketService.emit('user:getById', { userId });
      
      const handleResponse = (response: { user: User }) => {
        socketService.off('user:getByIdResponse', handleResponse);
        socketService.off('user:getByIdError', handleError);
        resolve(response.user);
      };
      
      const handleError = (error: any) => {
        socketService.off('user:getByIdResponse', handleResponse);
        socketService.off('user:getByIdError', handleError);
        reject(error);
      };
      
      socketService.on('user:getByIdResponse', handleResponse);
      socketService.on('user:getByIdError', handleError);
    });
  }

  async getUserByTelegramId(telegramId: number): Promise<User> {
    return new Promise((resolve, reject) => {
      socketService.emit('user:getByTelegramId', { telegramId });
      
      const handleResponse = (response: { user: User }) => {
        socketService.off('user:getByTelegramIdResponse', handleResponse);
        socketService.off('user:getByTelegramIdError', handleError);
        resolve(response.user);
      };
      
      const handleError = (error: any) => {
        socketService.off('user:getByTelegramIdResponse', handleResponse);
        socketService.off('user:getByTelegramIdError', handleError);
        reject(error);
      };
      
      socketService.on('user:getByTelegramIdResponse', handleResponse);
      socketService.on('user:getByTelegramIdError', handleError);
    });
  }

  async updateUser(request: UpdateUserRequest): Promise<User> {
    return new Promise((resolve, reject) => {
      socketService.emit('user:update', {
        userId: request.userId,
        updates: request.updates
      });
      
      const handleResponse = (response: { user: User }) => {
        socketService.off('user:updateResponse', handleResponse);
        socketService.off('user:updateError', handleError);
        resolve(response.user);
      };
      
      const handleError = (error: any) => {
        socketService.off('user:updateResponse', handleResponse);
        socketService.off('user:updateError', handleError);
        reject(error);
      };
      
      socketService.on('user:updateResponse', handleResponse);
      socketService.on('user:updateError', handleError);
    });
  }

  async addCoins(request: AddCoinsRequest): Promise<User> {
    const user = await this.getUserById(request.userId);
    return this.updateUser({
      userId: request.userId,
      updates: { coins: (user.coins || 0) + request.amount }
    });
  }

  async addXP(request: AddXPRequest): Promise<User> {
    const user = await this.getUserById(request.userId);
    const newXP = (user.xp || 0) + request.amount;
    const newLevel = Math.floor(newXP / 1000) + 1;
    
    return this.updateUser({
      userId: request.userId,
      updates: { 
        xp: newXP,
        level: newLevel
      }
    });
  }

  async addScore(request: AddScoreRequest): Promise<User> {
    const user = await this.getUserById(request.userId);
    return this.updateUser({
      userId: request.userId,
      updates: { totalScore: (user.totalScore || 0) + request.amount }
    });
  }

  async findOrCreateUser(telegramUser: TelegramUser): Promise<{ user: User; isNewUser: boolean }> {
    // If socket is not connected, return mock user for development
    if (!socketService.isConnected()) {
      console.warn('Socket not connected, returning mock user for development');
      const mockUser: User = {
        _id: `mock-${telegramUser.id}`,
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name || 'Test',
        lastName: telegramUser.last_name || 'User',
        username: telegramUser.username || 'testuser',
        languageCode: telegramUser.language_code || 'en',
        isPremium: telegramUser.is_premium || false,
        photoUrl: telegramUser.photo_url || '',
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
          language: telegramUser.language_code || 'en',
          notifications: true,
          sound: true,
          vibration: true,
        },
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      return Promise.resolve({ user: mockUser, isNewUser: true });
    }

    return new Promise((resolve, reject) => {
      socketService.emit('user:findOrCreate', {
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        languageCode: telegramUser.language_code,
        isPremium: telegramUser.is_premium,
        photoUrl: telegramUser.photo_url
      });
      
      const handleResponse = (response: { user: User; isNewUser: boolean }) => {
        socketService.off('user:findOrCreateResponse', handleResponse);
        socketService.off('user:findOrCreateError', handleError);
        resolve(response);
      };
      
      const handleError = (error: any) => {
        socketService.off('user:findOrCreateResponse', handleResponse);
        socketService.off('user:findOrCreateError', handleError);
        reject(error);
      };
      
      socketService.on('user:findOrCreateResponse', handleResponse);
      socketService.on('user:findOrCreateError', handleError);
    });
  }
}

export const userService = new UserService();
export default userService;