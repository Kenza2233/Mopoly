// src/utils/animation.ts

/**
 * Helper to create a delay for animations
 * @param ms Milliseconds to delay
 */
export const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Calculate sequential steps for token movement
 * @param startPos Current position
 * @param steps Number of steps to move
 * @returns Array of positions to visit
 */
export const getMovementPath = (startPos: number, steps: number): number[] => {
  const path: number[] = [];
  for (let i = 1; i <= steps; i++) {
    path.push((startPos + i) % 40);
  }
  return path;
};

/**
 * Animation durations (ms)
 */
export const ANIMATION_CONFIG = {
  TOKEN_STEP: 250,
  DICE_ROLL: 800,
  CARD_FLIP: 600,
  MODAL_TRANSITION: 300,
};
