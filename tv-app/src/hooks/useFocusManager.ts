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

  // Grid-aware clamp index - handles incomplete last row
  const clampIndex = useCallback((index: number, currentIndex: number, direction?: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (enableWrapping) {
      if (index < 0) return totalItems - 1;
      if (index >= totalItems) return 0;
      return index;
    }
    
    // Grid-aware clamping for incomplete rows
    if (cols > 1 && direction) {
      const currentRow = Math.floor(currentIndex / cols);
      const currentCol = currentIndex % cols;
      const targetRow = Math.floor(index / cols);
      const lastRowStartIndex = Math.floor((totalItems - 1) / cols) * cols;
      const itemsInLastRow = totalItems - lastRowStartIndex;
      
      if (direction === 'DOWN') {
        // Moving down into an incomplete last row
        if (index >= totalItems) {
          // Check if we can move to the last row at same column
          const lastRowIndex = lastRowStartIndex + currentCol;
          if (lastRowIndex < totalItems) {
            return lastRowIndex;
          }
          // Otherwise clamp to last item in grid
          return totalItems - 1;
        }
      }
      
      if (direction === 'UP') {
        // Moving up from first row - stay in place
        if (index < 0) {
          return currentIndex;
        }
      }
      
      if (direction === 'RIGHT') {
        // Don't wrap to next row
        const nextRow = Math.floor(index / cols);
        if (nextRow !== currentRow) {
          return currentIndex;
        }
      }
      
      if (direction === 'LEFT') {
        // Don't wrap to previous row
        if (index < 0) {
          return currentIndex;
        }
        const prevRow = Math.floor(index / cols);
        if (prevRow !== currentRow) {
          return currentIndex;
        }
      }
    }
    
    return Math.max(0, Math.min(totalItems - 1, index));
  }, [totalItems, enableWrapping, cols]);

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

  // Navigation handler - uses functional update to avoid stale closure
  const handleNavigation = useCallback((direction: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    setFocusIndex(prev => {
      console.log('[useFocusManager] ⌨️  Navigation:', {
        direction,
        currentIndex: prev,
        totalItems,
        cols
      });
      
      let newIndex = prev;

      switch (direction) {
        case 'UP':
          if (cols === 1) {
            newIndex = prev - 1;
          } else {
            newIndex = prev - cols;
          }
          break;

        case 'DOWN':
          if (cols === 1) {
            newIndex = prev + 1;
          } else {
            newIndex = prev + cols;
          }
          break;

        case 'LEFT':
          newIndex = prev - 1;
          break;

        case 'RIGHT':
          newIndex = prev + 1;
          break;
      }

      const clampedIndex = clampIndex(newIndex, prev, direction);
      console.log('[useFocusManager] 🎯 Focus move:', {
        from: prev,
        to: clampedIndex,
        attempted: newIndex,
        clamped: newIndex !== clampedIndex
      });
      
      return clampedIndex;
    });
  }, [cols, clampIndex, totalItems]);

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
      window.history.back();
    }
  }, [onBack]);

  // Reset focus when totalItems changes
  useEffect(() => {
    setFocusIndex(prev => {
      const newIndex = clampIndex(prev, prev);
      if (newIndex !== prev) {
        console.log('[useFocusManager] 🔄 Focus reset due to totalItems change:', {
          totalItems,
          oldIndex: prev,
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
    ? 'ring-[8px] ring-[#ff4199] ring-offset-2 ring-offset-black scale-105 transition-all duration-200 shadow-[0_0_30px_rgba(255,65,153,0.8)]'
    : 'transition-all duration-200';
}
