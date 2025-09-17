import { io, Socket } from 'socket.io-client';
import { getTelegramInitData } from '@/lib/telegramAuth';

class SocketService {
  private socket: Socket | null = null;
  private reconnectAttempts = 0;
  private maxReconnectAttempts = 5;
  private reconnectDelay = 1000;
  private messageQueue: Array<{ event: string; data: any }> = [];

  constructor() {
    // Only connect if socket URL is provided
    if (process.env.NEXT_PUBLIC_SOCKET_URL) {
      console.log('🔌 Initializing Socket connection to:', process.env.NEXT_PUBLIC_SOCKET_URL);
      this.connect();
    } else {
      console.warn('⚠️ Socket.io disabled: NEXT_PUBLIC_SOCKET_URL not configured');
    }
  }

  private connect() {
    try {
      // Get Telegram init data for authentication (only on client side)
      let initData = null;
      if (typeof window !== 'undefined') {
        try {
          initData = getTelegramInitData();
        } catch (error) {
          console.warn('⚠️ Running outside Telegram environment, using development mode');
          // For development outside Telegram, use mock data with query_id=dev
          initData = 'query_id=dev&user=%7B%22id%22%3A999999999%2C%22first_name%22%3A%22Dev%22%2C%22last_name%22%3A%22User%22%2C%22username%22%3A%22dev_user%22%2C%22language_code%22%3A%22en%22%7D&auth_date=' + Math.floor(Date.now() / 1000) + '&hash=dev_hash';
        }
      }
      const botToken = process.env.NEXT_PUBLIC_BOT_TOKEN;
      
      console.log('🔐 Connecting with auth data:', { botToken: botToken ? 'present' : 'missing', initData: initData ? initData.substring(0, 50) + '...' : 'null' });
      
      // Connect to backend socket server with auth data in handshake
      this.socket = io(process.env.NEXT_PUBLIC_SOCKET_URL || 'http://localhost:3001', {
        transports: ['websocket', 'polling'],
        timeout: 20000,
        forceNew: true,
        autoConnect: false, // Don't auto-connect to prevent errors
        auth: {
          botToken,
          initData
        }
      });

      this.setupEventListeners();
      this.socket.connect(); // Manually connect
    } catch (error) {
      console.error('Socket connection error:', error);
      this.handleReconnect();
    }
  }

  private setupEventListeners() {
    if (!this.socket) return;

    this.socket.on('connect', () => {
      console.log('Socket connected:', this.socket?.id);
      this.reconnectAttempts = 0;
      this.processMessageQueue();
    });

    this.socket.on('disconnect', (reason) => {
      console.log('Socket disconnected:', reason);
      if (reason === 'io server disconnect') {
        // Server disconnected, try to reconnect
        this.handleReconnect();
      }
    });

    this.socket.on('connect_error', (error) => {
      console.error('Socket connection error:', error);
      
      // Check if it's an authentication error
      const errorString = error.toString() || error.message || '';
      if (errorString.includes('Authentication failed')) {
        console.log('🚫 Authentication failed, redirecting to auth-error page');
        // Redirect to authentication error page
        if (typeof window !== 'undefined') {
          window.location.href = '/auth-error?type=SIGNATURE_INVALID&message=' + encodeURIComponent(errorString);
        }
        return;
      }
      
      this.handleReconnect();
    });

    this.socket.on('reconnect', (attemptNumber) => {
      console.log('Socket reconnected after', attemptNumber, 'attempts');
    });
  }

  private handleReconnect() {
    if (this.reconnectAttempts < this.maxReconnectAttempts) {
      this.reconnectAttempts++;
      const delay = this.reconnectDelay * Math.pow(2, this.reconnectAttempts - 1);
      
      console.log(`Attempting to reconnect (${this.reconnectAttempts}/${this.maxReconnectAttempts}) in ${delay}ms`);
      
      setTimeout(() => {
        this.connect();
      }, delay);
    } else {
      console.error('Max reconnection attempts reached');
    }
  }

  private processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      if (message) {
        this.emit(message.event, message.data);
      }
    }
  }

  public emit(event: string, data?: any) {
    if (this.socket?.connected) {
      this.socket.emit(event, data);
    } else if (this.socket) {
      // Queue message if not connected but socket exists
      this.messageQueue.push({ event, data });
      console.warn('Socket not connected, message queued:', event);
    } else {
      // No socket configured, log warning
      console.warn('Socket.io not configured, ignoring event:', event);
    }
  }

  public on(event: string, callback: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.on(event, callback);
    }
  }

  public off(event: string, callback?: (...args: any[]) => void) {
    if (this.socket) {
      this.socket.off(event, callback);
    }
  }

  public isConnected(): boolean {
    return this.socket?.connected || false;
  }

  public getConnectionState(): 'connecting' | 'connected' | 'disconnected' | 'reconnecting' {
    if (!this.socket) return 'disconnected';
    if (this.socket.connected) return 'connected';
    if (this.reconnectAttempts > 0) return 'reconnecting';
    return 'connecting';
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  // User-related socket events
  public findOrCreateUser(telegramUser: any, callback: (response: any) => void) {
    this.emit('user:findOrCreate', telegramUser);
    this.on('user:findOrCreateResponse', callback);
  }

  public updateUser(userId: string, updates: any, callback: (response: any) => void) {
    this.emit('user:update', { userId, updates });
    this.on('user:updateResponse', callback);
  }

  public getUserById(userId: string, callback: (response: any) => void) {
    this.emit('user:getById', { userId });
    this.on('user:getByIdResponse', callback);
  }

  // Authentication is now handled in the connection handshake via middleware
}

// Singleton instance
const socketService = new SocketService();
export default socketService;