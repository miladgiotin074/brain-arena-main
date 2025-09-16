'use client';

import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { initData, useSignal } from '@telegram-apps/sdk-react';
import { User, UserContextType, TelegramUser } from '@/types/user';
import { userService } from '@/services/userService';

// User state type
interface UserState {
  user: User | null;
  isLoading: boolean;
  error: string | null;
}

// Add retry functionality
type RetryFunction = () => void;

// Action types
type UserAction =
  | { type: 'SET_LOADING'; payload: boolean }
  | { type: 'SET_USER'; payload: User | null }
  | { type: 'SET_ERROR'; payload: string | null }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'LOGOUT' };

// Initial state
const initialState: UserState = {
  user: null,
  isLoading: true,
  error: null,
};

// Reducer function
function userReducer(state: UserState, action: UserAction): UserState {
  switch (action.type) {
    case 'SET_LOADING':
      return { ...state, isLoading: action.payload };
    case 'SET_USER':
      return { ...state, user: action.payload, isLoading: false, error: null };
    case 'SET_ERROR':
      return { ...state, error: action.payload, isLoading: false };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'LOGOUT':
      return { ...state, user: null, isLoading: false, error: null };
    default:
      return state;
  }
}

// Create context
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component
interface UserProviderProps {
  children: ReactNode;
}

export function UserProvider({ children }: UserProviderProps) {
  const [state, dispatch] = useReducer(userReducer, initialState);

  // Login function
  const login = async (telegramUser: TelegramUser): Promise<void> => {
    try {
      dispatch({ type: 'SET_LOADING', payload: true });
      dispatch({ type: 'SET_ERROR', payload: null });

      const result = await userService.findOrCreateUser(telegramUser);
      dispatch({ type: 'SET_USER', payload: result.user });
      
      // Store user in localStorage for persistence
      localStorage.setItem('user', JSON.stringify(result.user));
      
      if (result.isNewUser) {
        console.log('New user created:', result.user.firstName);
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Authentication failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      console.error('Login failed:', error);
    }
  };

  // Logout function
  const logout = (): void => {
    dispatch({ type: 'LOGOUT' });
    localStorage.removeItem('user');
  };

  // Update user function
  const updateUser = async (updates: Partial<User>): Promise<void> => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = await userService.updateUser({
        userId: state.user._id,
        updates,
      });
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Update failed';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Add coins function
  const addCoins = async (amount: number): Promise<void> => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = await userService.addCoins({
        userId: state.user._id,
        amount,
      });
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add coins';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Add XP function
  const addXP = async (amount: number): Promise<void> => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = await userService.addXP({
        userId: state.user._id,
        amount,
      });
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add XP';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Add score function
  const addScore = async (amount: number): Promise<void> => {
    if (!state.user) {
      throw new Error('No user logged in');
    }

    try {
      const updatedUser = await userService.addScore({
        userId: state.user._id,
        amount,
      });
      
      dispatch({ type: 'UPDATE_USER', payload: updatedUser });
      localStorage.setItem('user', JSON.stringify(updatedUser));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to add score';
      dispatch({ type: 'SET_ERROR', payload: errorMessage });
      throw error;
    }
  };

  // Get Telegram init data using the SDK
  const initDataState = useSignal(initData.state);
  
  // Initialize user from Telegram data
  useEffect(() => {
    const initializeUser = async () => {
      try {
        // Check if we have Telegram init data
        if (initDataState && initDataState.user) {
          const telegramUser = initDataState.user;
          console.log('🔐 Authenticating with Telegram data:', telegramUser);
          
          // Convert Telegram user data to TelegramUser format
          const telegramData: TelegramUser = {
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            username: telegramUser.username,
            language_code: telegramUser.language_code,
            is_premium: telegramUser.is_premium,
            photo_url: telegramUser.photo_url
          };
          
          // Find or create user
          const response = await userService.findOrCreateUser(telegramData);
          dispatch({ type: 'SET_USER', payload: response.user });
          
          // Save to localStorage for offline access
          localStorage.setItem('user', JSON.stringify(response.user));
          
          console.log('✅ User authenticated:', response.user);
          if (response.isNewUser) {
            console.log('🎉 Welcome new user!');
          }
        } else {
          console.log('⚠️ No Telegram user data, checking localStorage...');
          
          // Fallback to localStorage for development/testing
          const savedUser = localStorage.getItem('user');
          if (savedUser) {
            const user = JSON.parse(savedUser);
            dispatch({ type: 'SET_USER', payload: user });
            console.log('📱 Loaded user from localStorage:', user);
          } else {
            // Create mock user for development
            console.log('🔧 Creating mock user for development');
            const mockUser: User = {
              _id: 'mock-user-id',
              telegramId: 123456789,
              firstName: 'Test',
              lastName: 'User',
              username: 'testuser',
              languageCode: 'en',
              isPremium: false,
              photoUrl: '',
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
                language: 'en',
                notifications: true,
                sound: true,
                vibration: true
              },
              createdAt: new Date(),
              lastActive: new Date()
            };
            
            dispatch({ type: 'SET_USER', payload: mockUser });
            localStorage.setItem('user', JSON.stringify(mockUser));
            console.log('✅ Mock user created:', mockUser);
          }
        }
      } catch (error) {
        console.error('❌ Failed to initialize user:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };

    initializeUser();
  }, [initDataState]);

  // Retry function to reinitialize user
  const retry = (): void => {
    dispatch({ type: 'SET_LOADING', payload: true });
    dispatch({ type: 'SET_ERROR', payload: null });
    
    const initializeUser = async () => {
      try {
        // Check if we have Telegram init data
        if (initDataState && initDataState.user) {
          const telegramUser = initDataState.user;
          console.log('🔐 Retrying authentication with Telegram data:', telegramUser);
          
          // Convert Telegram user to our TelegramUser type
          const telegramData: TelegramUser = {
            id: telegramUser.id,
            first_name: telegramUser.first_name,
            last_name: telegramUser.last_name,
            username: telegramUser.username,
            language_code: telegramUser.language_code,
            is_premium: telegramUser.is_premium,
            photo_url: telegramUser.photo_url
          };
          
          // Find or create user
          const response = await userService.findOrCreateUser(telegramData);
          dispatch({ type: 'SET_USER', payload: response.user });
          
          // Save to localStorage for offline access
          localStorage.setItem('user', JSON.stringify(response.user));
          
          console.log('✅ User re-authenticated:', response.user);
        } else {
          console.log('⚠️ No Telegram user data available');
          dispatch({ type: 'SET_ERROR', payload: 'No user data available' });
        }
      } catch (error) {
        console.error('❌ Failed to retry user initialization:', error);
        dispatch({ type: 'SET_ERROR', payload: 'Failed to load user data' });
      } finally {
        dispatch({ type: 'SET_LOADING', payload: false });
      }
    };
    
    initializeUser();
  };

  const contextValue: UserContextType = {
    user: state.user,
    isLoading: state.isLoading,
    error: state.error,
    login,
    logout,
    updateUser,
    addCoins,
    addXP,
    addScore,
    retry,
  };

  return (
    <UserContext.Provider value={contextValue}>
      {children}
    </UserContext.Provider>
  );
}

// Custom hook to use the user context
export function useUser(): UserContextType {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
}

export default UserContext;