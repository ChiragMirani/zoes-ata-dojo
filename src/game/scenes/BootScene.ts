import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/Constants';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  preload(): void {
    // Update loading bar progress
    const progressBar = document.getElementById('load-progress');

    this.load.on('progress', (value: number) => {
      if (progressBar) {
        progressBar.style.width = `${Math.round(value * 100)}%`;
      }
    });

    // Generate placeholder sprites programmatically
    this.createPlaceholderAssets();
  }

  create(): void {
    // Transition to menu
    this.time.delayedCall(500, () => {
      this.scene.start(SCENES.MENU);
    });
  }

  private createPlaceholderAssets(): void {
    // Create Zoe placeholder sprite (coral red fighter)
    const zoeGraphics = this.make.graphics({ x: 0, y: 0 });
    zoeGraphics.fillStyle(COLORS.ACCENT, 1);
    zoeGraphics.fillRoundedRect(0, 0, 64, 96, 8);
    // Head
    zoeGraphics.fillStyle(0x8B6914, 1);
    zoeGraphics.fillCircle(32, 16, 16);
    // Belt
    zoeGraphics.fillStyle(COLORS.BLACK, 1);
    zoeGraphics.fillRect(8, 48, 48, 6);
    // Eyes
    zoeGraphics.fillStyle(COLORS.WHITE, 1);
    zoeGraphics.fillCircle(26, 14, 4);
    zoeGraphics.fillCircle(38, 14, 4);
    zoeGraphics.fillStyle(COLORS.BLACK, 1);
    zoeGraphics.fillCircle(27, 14, 2);
    zoeGraphics.fillCircle(39, 14, 2);
    zoeGraphics.generateTexture('zoe', 64, 96);
    zoeGraphics.destroy();

    // Create opponent placeholder (blue fighter)
    const oppGraphics = this.make.graphics({ x: 0, y: 0 });
    oppGraphics.fillStyle(COLORS.ACCENT2, 1);
    oppGraphics.fillRoundedRect(0, 0, 64, 96, 8);
    oppGraphics.fillStyle(0xD2B48C, 1);
    oppGraphics.fillCircle(32, 16, 16);
    oppGraphics.fillStyle(0xFFD700, 1);
    oppGraphics.fillRect(8, 48, 48, 6);
    oppGraphics.fillStyle(COLORS.WHITE, 1);
    oppGraphics.fillCircle(26, 14, 4);
    oppGraphics.fillCircle(38, 14, 4);
    oppGraphics.fillStyle(COLORS.BLACK, 1);
    oppGraphics.fillCircle(27, 14, 2);
    oppGraphics.fillCircle(39, 14, 2);
    oppGraphics.generateTexture('opponent', 64, 96);
    oppGraphics.destroy();

    // Create ground texture
    const groundGraphics = this.make.graphics({ x: 0, y: 0 });
    groundGraphics.fillStyle(0x2D2D2D, 1);
    groundGraphics.fillRect(0, 0, GAME_WIDTH, 140);
    groundGraphics.lineStyle(2, 0x444444, 1);
    groundGraphics.strokeRect(0, 0, GAME_WIDTH, 140);
    // Dojo floor lines
    for (let i = 0; i < GAME_WIDTH; i += 80) {
      groundGraphics.lineStyle(1, 0x3A3A3A, 0.5);
      groundGraphics.lineBetween(i, 0, i, 140);
    }
    groundGraphics.generateTexture('ground', GAME_WIDTH, 140);
    groundGraphics.destroy();

    // Create hit effect (starburst)
    const hitGraphics = this.make.graphics({ x: 0, y: 0 });
    hitGraphics.fillStyle(COLORS.WHITE, 1);
    // Draw a starburst manually
    const cx = 16, cy = 16, spikes = 6, outerR = 16, innerR = 8;
    hitGraphics.beginPath();
    for (let i = 0; i < spikes * 2; i++) {
      const r = i % 2 === 0 ? outerR : innerR;
      const angle = (Math.PI * i) / spikes - Math.PI / 2;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      if (i === 0) hitGraphics.moveTo(px, py);
      else hitGraphics.lineTo(px, py);
    }
    hitGraphics.closePath();
    hitGraphics.fillPath();
    hitGraphics.generateTexture('hit-effect', 32, 32);
    hitGraphics.destroy();
  }
}
