// Game-wide constants
export const GAME_WIDTH = 1280;
export const GAME_HEIGHT = 720;

// Physics
export const GRAVITY = 1200;
export const GROUND_Y = 580;
export const MOVE_SPEED = 300;
export const JUMP_VELOCITY = -600;
export const DASH_SPEED = 500;
export const DASH_DURATION = 200;

// Combat
export const MAX_HEALTH = 100;
export const ROUND_TIME = 99; // seconds
export const ROUNDS_TO_WIN = 2;
export const HIT_STUN_DURATION = 300; // ms
export const BLOCK_STUN_DURATION = 200;
export const COMBO_BREAK_LOCKOUT = 3000; // ms

// Ki Meter
export const MAX_KI = 300;
export const KI_LEVEL_1 = 100;
export const KI_LEVEL_2 = 200;
export const KI_LEVEL_3 = 300;
export const KI_GAIN_ON_HIT = 10;
export const KI_GAIN_ON_BLOCK = 5;
export const KI_GAIN_ON_BREAK = 25;

// Attack Data
export const ATTACKS = {
  LIGHT: { damage: 8, startup: 4, active: 3, recovery: 8, hitstun: 12, blockstun: 8, kiGain: 8 },
  MEDIUM: { damage: 14, startup: 7, active: 4, recovery: 14, hitstun: 18, blockstun: 12, kiGain: 12 },
  HEAVY: { damage: 22, startup: 12, active: 5, recovery: 20, hitstun: 24, blockstun: 16, kiGain: 18 },
  SPECIAL: { damage: 18, startup: 10, active: 6, recovery: 18, hitstun: 20, blockstun: 14, kiGain: 15 },
} as const;

// Colors
export const COLORS = {
  PRIMARY: 0x1A1A2E,
  ACCENT: 0xE94560,
  ACCENT2: 0x0F3460,
  GOLD: 0xD4A843,
  WHITE: 0xFFFFFF,
  BLACK: 0x000000,
  HEALTH_GREEN: 0x4CAF50,
  HEALTH_RED: 0xE94560,
  KI_BLUE: 0x2196F3,
  HIT_FLASH: 0xFF0000,
} as const;

// Belt Progression (ATA Songahm order)
export const BELTS = [
  { name: 'White Belt', color: 0xFFFFFF, xpRequired: 0 },
  { name: 'Orange Belt', color: 0xFF8C00, xpRequired: 500 },
  { name: 'Yellow Belt', color: 0xFFD700, xpRequired: 1200 },
  { name: 'Camouflage Belt', color: 0x556B2F, xpRequired: 2500 },
  { name: 'Green Belt', color: 0x228B22, xpRequired: 4000 },
  { name: 'Purple Belt', color: 0x800080, xpRequired: 6000 },
  { name: 'Blue Belt', color: 0x0000CD, xpRequired: 8500 },
  { name: 'Brown Belt', color: 0x8B4513, xpRequired: 12000 },
  { name: 'Red Belt', color: 0xCC0000, xpRequired: 16000 },
  { name: 'Black Belt', color: 0x000000, xpRequired: 20000 },
] as const;

// Scene Keys
export const SCENES = {
  BOOT: 'BootScene',
  MENU: 'MenuScene',
  BATTLE: 'BattleScene',
  TRAINING: 'TrainingScene',
  GAME_OVER: 'GameOverScene',
} as const;
