'use client';

import { useUser } from '@/contexts/UserContext';
import { User, TelegramUser } from '@/types/user';

/**
 * Custom hook for authentication operations
 * Provides easy access to user authentication state and methods
 */
export function useAuth() {
  const {
    user,
    isLoading,
    error,
    login,
    logout,
    updateUser,
    addCoins,
    addXP,
    addScore,
  } = useUser();

  // Check if user is authenticated
  const isAuthenticated = !!user;

  // Check if user is premium (Telegram Premium)
  const isPremium = user?.isPremium || false;

  // Get user display name
  const getDisplayName = (): string => {
    if (!user) return 'Guest';
    
    if (user.username) {
      return `@${user.username}`;
    }
    
    return user.lastName 
      ? `${user.firstName} ${user.lastName}`
      : user.firstName;
  };

  // Get user initials for avatar
  const getUserInitials = (): string => {
    if (!user) return 'G';
    
    const firstInitial = user.firstName.charAt(0).toUpperCase();
    const lastInitial = user.lastName?.charAt(0).toUpperCase() || '';
    
    return firstInitial + lastInitial;
  };

  // Check if user can afford something
  const canAfford = (cost: number): boolean => {
    return user ? user.coins >= cost : false;
  };

  // Get user level progress (XP to next level)
  const getLevelProgress = (): { current: number; next: number; progress: number } => {
    if (!user) return { current: 0, next: 100, progress: 0 };
    
    const currentLevelXP = (user.level - 1) * 100;
    const nextLevelXP = user.level * 100;
    const progress = ((user.xp - currentLevelXP) / 100) * 100;
    
    return {
      current: user.xp - currentLevelXP,
      next: 100,
      progress: Math.min(progress, 100),
    };
  };

  // Login with error handling
  const loginWithErrorHandling = async (telegramUser: TelegramUser): Promise<boolean> => {
    try {
      await login(telegramUser);
      return true;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  };

  // Update user with error handling
  const updateUserSafely = async (updates: Partial<User>): Promise<boolean> => {
    try {
      await updateUser(updates);
      return true;
    } catch (error) {
      console.error('Update failed:', error);
      return false;
    }
  };

  // Add coins with error handling
  const addCoinsSafely = async (amount: number): Promise<boolean> => {
    try {
      await addCoins(amount);
      return true;
    } catch (error) {
      console.error('Failed to add coins:', error);
      return false;
    }
  };

  // Add XP with error handling
  const addXPSafely = async (amount: number): Promise<boolean> => {
    try {
      await addXP(amount);
      return true;
    } catch (error) {
      console.error('Failed to add XP:', error);
      return false;
    }
  };

  // Add score with error handling
  const addScoreSafely = async (amount: number): Promise<boolean> => {
    try {
      await addScore(amount);
      return true;
    } catch (error) {
      console.error('Failed to add score:', error);
      return false;
    }
  };

  return {
    // State
    user,
    isLoading,
    error,
    isAuthenticated,
    isPremium,
    
    // Methods
    login: loginWithErrorHandling,
    logout,
    updateUser: updateUserSafely,
    addCoins: addCoinsSafely,
    addXP: addXPSafely,
    addScore: addScoreSafely,
    
    // Utility methods
    getDisplayName,
    getUserInitials,
    canAfford,
    getLevelProgress,
  };
}