import { useState } from 'react';

/**
 * Hook for managing menu state
 */
export function useMenu() {
  const [isMenuActive, setIsMenuActive] = useState(false);

  const toggleMenu = () => {
    setIsMenuActive(!isMenuActive);
  };

  const openMenu = () => {
    setIsMenuActive(true);
  };

  const closeMenu = () => {
    setIsMenuActive(false);
  };

  return {
    isMenuActive,
    toggleMenu,
    openMenu,
    closeMenu
  };
} 