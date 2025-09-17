'use client';

import { useTranslation } from 'react-i18next';
import { Game } from '@/services/gameService';

interface GameCardProps {
  game: Game;
  onJoin: (gameId: string) => void;
  joining: boolean;
}

export const GameCard: React.FC<GameCardProps> = ({ game, onJoin, joining }) => {
  const { t, i18n } = useTranslation();
  const isRTL = i18n.language === 'fa';

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'text-green-400';
      case 'medium':
        return 'text-yellow-400';
      case 'hard':
        return 'text-red-400';
      default:
        return 'text-gray-400';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'waiting':
        return 'bg-blue-500/20 text-blue-400';
      case 'active':
        return 'bg-green-500/20 text-green-400';
      case 'finished':
        return 'bg-gray-500/20 text-gray-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };

  const handleJoin = () => {
    if (!joining && game.status !== 'finished' && game.playersCount < game.maxPlayers) {
      onJoin(game.id);
    }
  };

  const isJoinable = game.status !== 'finished' && game.playersCount < game.maxPlayers;

  return (
    <div className="bg-gray-800/50 backdrop-blur-sm rounded-xl p-4 border border-gray-700/50 hover:border-gray-600/50 transition-all duration-200">
      {/* Header */}
      <div className={`flex items-start justify-between mb-3 ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex-1 ${isRTL ? 'text-right' : 'text-left'}`}>
          <h3 className="text-lg font-semibold text-white mb-1">
            {isRTL ? game.titleFa : game.title}
          </h3>
          <p className="text-sm text-gray-400">
            {isRTL ? game.descriptionFa : game.description}
          </p>
        </div>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(game.status)}`}>
            {t(`game.status.${game.status}`)}
          </span>
        </div>
      </div>

      {/* Game Info */}
      <div className={`flex items-center gap-4 mb-4 text-sm ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-400">{t('game.category')}:</span>
          <span className="text-white">{isRTL ? game.categoryFa : game.category}</span>
        </div>
        <div className={`flex items-center gap-1 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <span className="text-gray-400">{t('game.difficulty')}:</span>
          <span className={getDifficultyColor(game.difficulty)}>
            {isRTL ? game.difficultyFa : game.difficulty}
          </span>
        </div>
      </div>

      {/* Players and Join Button */}
      <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
            <span className="text-sm text-gray-300">
              {game.playersCount}/{game.maxPlayers} {t('game.players')}
            </span>
          </div>
        </div>

        <button
          onClick={handleJoin}
          disabled={!isJoinable || joining}
          className={`px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            isJoinable && !joining
              ? 'bg-blue-600 hover:bg-blue-700 text-white'
              : 'bg-gray-600 text-gray-400 cursor-not-allowed'
          }`}
        >
          {joining ? (
            <div className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
              {t('game.joining')}
            </div>
          ) : (
            t('game.join')
          )}
        </button>
      </div>
    </div>
  );
};