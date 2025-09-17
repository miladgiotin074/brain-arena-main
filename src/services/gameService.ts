import socketService from './socketService';

export interface Game {
  id: string;
  title: string;
  titleFa: string;
  description: string;
  descriptionFa: string;
  category: string;
  categoryFa: string;
  difficulty: string;
  difficultyFa: string;
  playersCount: number;
  maxPlayers: number;
  status: 'waiting' | 'active' | 'finished';
  createdAt: string;
}

export interface GamesListResponse {
  success: boolean;
  games: Game[];
}

export interface GameJoinResponse {
  success: boolean;
  game?: Game;
  error?: string;
}

export interface GameUpdatedEvent {
  gameId: string;
  playersCount: number;
}

class GameService {
  private games: Game[] = [];
  private listeners: Map<string, Function[]> = new Map();

  constructor() {
    // Wait for socket to be ready before setting up listeners
    this.initializeWhenReady();
  }

  private async initializeWhenReady() {
    // Wait for socketService to be available
    const checkSocket = () => {
      if (socketService && typeof socketService.on === 'function') {
        this.setupSocketListeners();
      } else {
        setTimeout(checkSocket, 100);
      }
    };
    checkSocket();
  }

  private setupSocketListeners() {
    // Listen for games list response
    socketService.on('games:list', (data: GamesListResponse) => {
      console.log('📋 Games list received:', data);
      if (data.success && data.games) {
        this.games = data.games;
        this.emit('gamesUpdated', this.games);
      }
    });

    // Listen for game join success
    socketService.on('games:joinSuccess', (data: GameJoinResponse) => {
      console.log('✅ Game join successful:', data);
      if (data.success && data.game) {
        this.emit('gameJoined', data.game);
      }
    });

    // Listen for game join error
    socketService.on('games:joinError', (data: GameJoinResponse) => {
      console.log('❌ Game join error:', data);
      this.emit('gameJoinError', data.error || 'Unknown error');
    });

    // Listen for game updates
    socketService.on('games:updated', (data: GameUpdatedEvent) => {
      console.log('🔄 Game updated:', data);
      const gameIndex = this.games.findIndex(g => g.id === data.gameId);
      if (gameIndex !== -1) {
        this.games[gameIndex].playersCount = data.playersCount;
        this.emit('gamesUpdated', this.games);
      }
    });
  }

  // Request games list from server
  public requestGamesList(): void {
    console.log('📋 Requesting games list...');
    if (socketService && typeof socketService.emit === 'function') {
      socketService.emit('games:list');
    } else {
      console.warn('⚠️ Socket not ready, retrying in 500ms...');
      setTimeout(() => this.requestGamesList(), 500);
    }
  }

  // Join a specific game
  public joinGame(gameId: string): void {
    console.log('🎮 Joining game:', gameId);
    if (socketService && typeof socketService.emit === 'function') {
      socketService.emit('games:join', { gameId });
    } else {
      console.warn('⚠️ Socket not ready for joining game');
    }
  }

  // Get current games list
  public getGames(): Game[] {
    return this.games;
  }

  // Event listener management
  public on(event: string, callback: Function): void {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)?.push(callback);
  }

  public off(event: string, callback: Function): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      const index = eventListeners.indexOf(callback);
      if (index > -1) {
        eventListeners.splice(index, 1);
      }
    }
  }

  private emit(event: string, data?: any): void {
    const eventListeners = this.listeners.get(event);
    if (eventListeners) {
      eventListeners.forEach(callback => callback(data));
    }
  }

  // Clean up listeners
  public destroy(): void {
    this.listeners.clear();
    socketService.off('games:list');
    socketService.off('games:joinSuccess');
    socketService.off('games:joinError');
    socketService.off('games:updated');
  }
}

// Export singleton instance
export const gameService = new GameService();