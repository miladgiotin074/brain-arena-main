import { useState, useEffect, useCallback } from 'react';
import { gameService, Game } from '@/services/gameService';

export interface UseGamesReturn {
  games: Game[];
  loading: boolean;
  error: string | null;
  refreshGames: () => void;
  joinGame: (gameId: string) => void;
  joining: boolean;
}

export const useGames = (): UseGamesReturn => {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [joining, setJoining] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle games list updates
  const handleGamesUpdated = useCallback((updatedGames: Game[]) => {
    console.log('🔄 Games updated in hook:', updatedGames.length);
    setGames(updatedGames);
    setLoading(false);
    setError(null);
  }, []);

  // Handle game join success
  const handleGameJoined = useCallback((game: Game) => {
    console.log('✅ Game joined successfully:', game.id);
    setJoining(false);
    setError(null);
    // You can add navigation logic here if needed
  }, []);

  // Handle game join error
  const handleGameJoinError = useCallback((errorMessage: string) => {
    console.log('❌ Game join error:', errorMessage);
    setJoining(false);
    setError(errorMessage);
  }, []);

  // Refresh games list
  const refreshGames = useCallback(() => {
    console.log('🔄 Refreshing games list...');
    setLoading(true);
    setError(null);
    gameService.requestGamesList();
  }, []);

  // Join a game
  const joinGame = useCallback((gameId: string) => {
    console.log('🎮 Attempting to join game:', gameId);
    setJoining(true);
    setError(null);
    gameService.joinGame(gameId);
  }, []);

  useEffect(() => {
    // Set up event listeners
    gameService.on('gamesUpdated', handleGamesUpdated);
    gameService.on('gameJoined', handleGameJoined);
    gameService.on('gameJoinError', handleGameJoinError);

    // Initial games request
    refreshGames();

    // Cleanup
    return () => {
      gameService.off('gamesUpdated', handleGamesUpdated);
      gameService.off('gameJoined', handleGameJoined);
      gameService.off('gameJoinError', handleGameJoinError);
    };
  }, [handleGamesUpdated, handleGameJoined, handleGameJoinError, refreshGames]);

  return {
    games,
    loading,
    error,
    refreshGames,
    joinGame,
    joining
  };
};