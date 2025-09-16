'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import socketService from '@/services/socketService';

type ConnectionState = 'connecting' | 'connected' | 'disconnected' | 'reconnecting';

interface SocketContextType {
  connectionState: ConnectionState;
  isConnected: boolean;
  emit: (event: string, data?: any) => void;
  on: (event: string, callback: (...args: any[]) => void) => void;
  off: (event: string, callback?: (...args: any[]) => void) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const [connectionState, setConnectionState] = useState<ConnectionState>('connecting');
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Monitor connection state
    const checkConnectionState = () => {
      const state = socketService.getConnectionState();
      const connected = socketService.isConnected();
      
      setConnectionState(state);
      setIsConnected(connected);
    };

    // Check initial state
    checkConnectionState();

    // Set up socket event listeners for connection state changes
    socketService.on('connect', () => {
      console.log('Socket context: Connected');
      setConnectionState('connected');
      setIsConnected(true);
    });

    socketService.on('disconnect', () => {
      console.log('Socket context: Disconnected');
      setConnectionState('disconnected');
      setIsConnected(false);
    });

    socketService.on('connect_error', () => {
      console.log('Socket context: Connection error');
      setConnectionState('reconnecting');
      setIsConnected(false);
    });

    socketService.on('reconnect', () => {
      console.log('Socket context: Reconnected');
      setConnectionState('connected');
      setIsConnected(true);
    });

    // Periodic state check as fallback
    const interval = setInterval(checkConnectionState, 5000);

    return () => {
      clearInterval(interval);
      // Clean up socket listeners
      socketService.off('connect');
      socketService.off('disconnect');
      socketService.off('connect_error');
      socketService.off('reconnect');
    };
  }, []);

  const emit = (event: string, data?: any) => {
    socketService.emit(event, data);
  };

  const on = (event: string, callback: (...args: any[]) => void) => {
    socketService.on(event, callback);
  };

  const off = (event: string, callback?: (...args: any[]) => void) => {
    socketService.off(event, callback);
  };

  const contextValue: SocketContextType = {
    connectionState,
    isConnected,
    emit,
    on,
    off,
  };

  return (
    <SocketContext.Provider value={contextValue}>
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = (): SocketContextType => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error('useSocket must be used within a SocketProvider');
  }
  return context;
};