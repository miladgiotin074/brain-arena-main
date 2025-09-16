import { User, TelegramUser, UpdateUserRequest, AddCoinsRequest, AddXPRequest, AddScoreRequest, AuthResponse } from '@/types/user';
import { authenticatedRequest } from '@/lib/telegramAuth';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

class UserService {
  private baseURL: string;

  constructor() {
    this.baseURL = process.env.NEXT_PUBLIC_API_URL || 'https://localhost:3000/api';
  }

  async authenticateUser(telegramData: TelegramUser): Promise<AuthResponse> {
    const response = await authenticatedRequest(`${this.baseURL}/users`, {
      method: 'POST',
      body: JSON.stringify({ telegramData }),
    });

    return response.json();
  }

  async getUserById(userId: string): Promise<User> {
    const response = await authenticatedRequest(`${this.baseURL}/users?userId=${userId}`);
    const data = await response.json();
    return data.user;
  }

  async getUserByTelegramId(telegramId: number): Promise<User> {
    const response = await authenticatedRequest(`${this.baseURL}/users?telegramId=${telegramId}`);
    const data = await response.json();
    return data.user;
  }

  async updateUser(request: UpdateUserRequest): Promise<User> {
    const response = await authenticatedRequest(`${this.baseURL}/users`, {
      method: 'PUT',
      body: JSON.stringify({
        userId: request.userId,
        ...request.updates
      }),
    });

    const data = await response.json();
    return data.user;
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
    const response = await authenticatedRequest(`${this.baseURL}/users`, {
      method: 'POST',
      body: JSON.stringify({
        telegramId: telegramUser.id,
        firstName: telegramUser.first_name,
        lastName: telegramUser.last_name,
        username: telegramUser.username,
        languageCode: telegramUser.language_code,
        isPremium: telegramUser.is_premium,
        photoUrl: telegramUser.photo_url
      }),
    });

    return response.json();
  }
}

export const userService = new UserService();
export default userService;