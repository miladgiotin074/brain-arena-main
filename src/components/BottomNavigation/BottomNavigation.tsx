'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback } from 'react';
import { useTranslations } from 'next-intl';
import { hapticFeedback } from '@telegram-apps/sdk-react';

interface NavItem {
  key: string;
  path: string;
  icon: string;
  labelKey: string;
}

const navItems: NavItem[] = [
  { key: 'home', path: '/', icon: '🏠', labelKey: 'home' },
  { key: 'chats', path: '/chats', icon: '💬', labelKey: 'chats' },
  { key: 'settings', path: '/settings', icon: '⚙️', labelKey: 'settings' },
];

export function BottomNavigation() {
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('navigation');

  const handleNavigate = useCallback((path: string, label: string) => {
    console.log(`Navigating to ${label}...`);
    
    // Add haptic feedback for page navigation
    if (hapticFeedback.impactOccurred.isAvailable()) {
      hapticFeedback.impactOccurred('light');
    }
    
    router.push(path);
  }, [router]);

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-gray-900/95 backdrop-blur-lg border-t border-gray-700/50 z-50 shadow-strong">
      <div className="flex items-center justify-around h-16 px-2">
        {navItems.map((item) => {
          const isActive = pathname === item.path;
          
          return (
            <button
              key={item.key}
              onClick={() => handleNavigate(item.path, t(item.labelKey))}
              className={`flex flex-col items-center justify-center flex-1 h-full transition-smooth relative ${
                isActive
                  ? 'text-blue-400'
                  : 'text-gray-400 hover:text-gray-200'
              }`}
            >
              {/* Active indicator */}
              {isActive && (
                <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-blue-400 rounded-full animate-scale-in" />
              )}
              
              {/* Icon with enhanced styling */}
              <div className={`text-xl mb-1 transition-bounce ${
                isActive ? 'scale-110' : 'hover:scale-105'
              }`}>
                {item.icon}
              </div>
              
              {/* Label with better typography */}
              <span className={`text-caption font-medium truncate max-w-full transition-smooth ${
                isActive ? 'text-blue-400' : 'text-gray-400'
              }`}>
                {t(item.labelKey)}
              </span>
              
              {/* Ripple effect on active */}
              {isActive && (
                <div className="absolute inset-0 bg-blue-400/10 rounded-lg animate-fade-in" />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}