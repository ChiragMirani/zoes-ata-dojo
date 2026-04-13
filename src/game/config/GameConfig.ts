import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, GRAVITY, COLORS } from './Constants';
import { BootScene } from '../scenes/BootScene';
import { MenuScene } from '../scenes/MenuScene';
import { BattleScene } from '../scenes/BattleScene';
import { GameOverScene } from '../scenes/GameOverScene';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  type: Phaser.AUTO,
  parent: 'game-container',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: `#${COLORS.PRIMARY.toString(16).padStart(6, '0')}`,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 640,
      height: 360,
    },
    max: {
      width: 1920,
      height: 1080,
    },
  },
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { x: 0, y: GRAVITY },
      debug: false,
    },
  },
  scene: [BootScene, MenuScene, BattleScene, GameOverScene],
  render: {
    pixelArt: false,
    antialias: true,
    antialiasGL: true,
  },
  input: {
    activePointers: 3, // Support multi-touch
  },
  fps: {
    target: 60,
    forceSetTimeOut: false,
  },
};
