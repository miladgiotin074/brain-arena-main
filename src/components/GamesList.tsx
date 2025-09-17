'use client';

import { useTranslation } from 'react-i18next';
import { Game } from '@/services/gameService';
import { GameCard } from './GameCard';

interface GamesListProps {
  games: Game[];
  loading: boolean;
  error: string | null;
  onRefresh: () => void;
  onJoinGame: (gameId: string) => void;
  joining: boolean;
}

export const GamesList: React.FC<GamesListProps> = ({
  games,
  loading,
  error,
  onRefresh,
  onJoinGame,
  joining
}) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  if (loading) {
    return (
      <div className="space-y-4">
        {/* Skeleton Loading */}
        {[...Array(3)].map((_, index) => (
          <div key={index} className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 animate-pulse">
            <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
                <div className="h-6 bg-gray-700 rounded mb-2 w-3/4"></div>
                <div className="h-4 bg-gray-700 rounded w-full"></div>
              </div>
              <div className="w-16 h-6 bg-gray-700 rounded-full"></div>
            </div>
            <div className={`flex items-center gap-4 mb-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="h-4 bg-gray-700 rounded w-20"></div>
              <div className="h-4 bg-gray-700 rounded w-16"></div>
            </div>
            <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
              <div className="h-4 bg-gray-700 rounded w-24"></div>
              <div className="h-8 bg-gray-700 rounded w-16"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center py-8">
        <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-6">
          <div className="text-red-400 text-lg mb-2">⚠️</div>
          <h3 className="text-red-400 font-medium mb-2">{t('game.error.title')}</h3>
          <p className="text-red-300 text-sm mb-4">{error}</p>
          <button
            onClick={onRefresh}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-medium transition-colors duration-200"
          >
            {t('game.retry')}
          </button>
        </div>
      </div>
    );
  }

  if (games.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">🎮</div>
        <h3 className="text-xl font-semibold text-white mb-2">{t('game.noGames.title')}</h3>
        <p className="text-gray-400 mb-6">{t('game.noGames.description')}</p>
        <button
          onClick={onRefresh}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors duration-200"
        >
          {t('game.refresh')}
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className={`flex items-center justify-between mb-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <h2 className="text-xl font-semibold text-white">
          {t('game.availableGames')} ({games.length})
        </h2>
        <button
          onClick={onRefresh}
          className="p-2 text-gray-400 hover:text-white transition-colors duration-200"
          title={t('game.refresh')}
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </button>
      </div>

      {/* Games List */}
      <div className="space-y-3">
        {games.map((game) => (
          <GameCard
            key={game.id}
            game={game}
            onJoin={onJoinGame}
            joining={joining}
          />
        ))}
      </div>
    </div>
  );
};