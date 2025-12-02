import { useState, useCallback, useEffect } from 'react';

/**
 * Simple focus manager hook - LGTV style
 * 
 * Matches LGTV reference pattern:
 * - State-based focus tracking (index-based)
 * - No DOM scanning or mutation observers
 * - Pages manage their own focus state
 * - CSS classes for visual focus
 * 
 * Usage:
 * ```
 * const { focusIndex, setFocusIndex, handleNavigation } = useFocusManager({
 *   totalItems: stations.length,
 *   cols: 4,
 *   onSelect: (index) => playStation(stations[index])
 * });
 * ```
 */

interface UseFocusManagerOptions {
  totalItems: number;
  cols?: number;  // For grid layouts
  rows?: number;  // For grid layouts
  initialIndex?: number;
  onSelect?: (index: number) => void;
  onBack?: () => void;
  enableWrapping?: boolean;
}

export function useFocusManager({
  totalItems,
  cols = 1,
  rows,
  initialIndex = 0,
  onSelect,
  onBack,
  enableWrapping = false
}: UseFocusManagerOptions) {
  const [focusIndex, setFocusIndex] = useState(initialIndex);

  // Log initial state
  useEffect(() => {
    console.log('[useFocusManager] 🎯 Initialized with:', {
      totalItems,
      cols,
      rows,
      initialIndex,
      enableWrapping
    });
  }, []);

  // Calculate grid dimensions
  const actualRows = rows || Math.ceil(totalItems / cols);

  // Clamp index to valid range
  const clampIndex = useCallback((index: number) => {
    if (enableWrapping) {
      if (index < 0) return totalItems - 1;
      if (index >= totalItems) return 0;
      return index;
    }
    return Math.max(0, Math.min(totalItems - 1, index));
  }, [totalItems, enableWrapping]);

  // Log focus changes
  useEffect(() => {
    console.log('[useFocusManager] 👁️  Focus changed:', {
      focusIndex,
      totalItems,
      cols,
      row: Math.floor(focusIndex / cols),
      col: focusIndex % cols
    });
  }, [focusIndex, totalItems, cols]);

  // Navigation handler
  const handleNavigation = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    console.log('[useFocusManager] ⌨️  Navigation:', {
      direction,
      currentIndex: focusIndex,
      totalItems,
      cols
    });
    
    setFocusIndex(current => {
      let newIndex = current;

      switch (direction) {
        case 'UP':
          if (cols === 1) {
            // Linear list
            newIndex = current - 1;
          } else {
            // Grid layout
            newIndex = current - cols;
          }
          break;

        case 'DOWN':
          if (cols === 1) {
            // Linear list
            newIndex = current + 1;
          } else {
            // Grid layout
            newIndex = current + cols;
          }
          break;

        case 'LEFT':
          newIndex = current - 1;
          break;

        case 'RIGHT':
          newIndex = current + 1;
          break;
      }

      const clampedIndex = clampIndex(newIndex);
      console.log('[useFocusManager] 🎯 Focus move:', {
        from: current,
        to: clampedIndex,
        attempted: newIndex,
        clamped: newIndex !== clampedIndex
      });
      
      return clampedIndex;
    });
  }, [cols, clampIndex, focusIndex, totalItems]);

  // Select handler
  const handleSelect = useCallback(() => {
    console.log('[useFocusManager] ✅ Select pressed:', {
      focusIndex,
      totalItems,
      hasHandler: !!onSelect
    });
    
    if (onSelect && focusIndex >= 0 && focusIndex < totalItems) {
      onSelect(focusIndex);
    }
  }, [onSelect, focusIndex, totalItems]);

  // Back handler
  const handleBack = useCallback(() => {
    console.log('[useFocusManager] ⬅️  Back pressed:', {
      hasHandler: !!onBack
    });
    
    if (onBack) {
      onBack();
    } else {
      // Default: go back in history
      window.history.back();
    }
  }, [onBack]);

  // Reset focus when totalItems changes
  useEffect(() => {
    const oldIndex = focusIndex;
    setFocusIndex(current => {
      const newIndex = clampIndex(current);
      if (newIndex !== current) {
        console.log('[useFocusManager] 🔄 Focus reset due to totalItems change:', {
          oldTotal: totalItems,
          newTotal: totalItems,
          oldIndex: current,
          newIndex
        });
      }
      return newIndex;
    });
  }, [totalItems, clampIndex]);

  return {
    focusIndex,
    setFocusIndex,
    handleNavigation,
    handleSelect,
    handleBack,
    isFocused: (index: number) => index === focusIndex
  };
}

/**
 * Helper to get CSS classes for focused element
 * 
 * Usage:
 * ```
 * <div className={getFocusClasses(isFocused(index))}>...</div>
 * ```
 */
export function getFocusClasses(isFocused: boolean): string {
  return isFocused
    ? 'ring-[4px] ring-[#ff4199] scale-105 transition-all duration-200 shadow-[0_0_25px_rgba(255,65,153,0.8)]'
    : 'transition-all duration-200';
}
