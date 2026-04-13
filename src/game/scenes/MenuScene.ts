import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/Constants';

export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    // Background
    this.cameras.main.setBackgroundColor(COLORS.PRIMARY);

    // Title
    const title = this.add.text(GAME_WIDTH / 2, 160, "ZOE'S ATA DOJO", {
      fontSize: '64px',
      fontFamily: 'Arial Black, Arial, sans-serif',
      color: '#E94560',
      fontStyle: 'bold',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5);

    // Subtitle
    this.add.text(GAME_WIDTH / 2, 230, 'Every kick tells a story.', {
      fontSize: '20px',
      fontFamily: 'Arial, sans-serif',
      color: '#888888',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Animated title glow
    this.tweens.add({
      targets: title,
      alpha: { from: 0.8, to: 1 },
      scale: { from: 1, to: 1.02 },
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Menu buttons
    const buttonY = 360;
    const buttonSpacing = 70;
    const buttons = [
      { text: 'ARCADE MODE', scene: SCENES.BATTLE, color: '#E94560' },
      { text: 'TRAINING', scene: SCENES.BATTLE, color: '#0F3460' },
      { text: 'LOCAL VS', scene: SCENES.BATTLE, color: '#D4A843' },
    ];

    buttons.forEach((btn, index) => {
      const y = buttonY + index * buttonSpacing;
      const bg = this.add.rectangle(GAME_WIDTH / 2, y, 320, 52, Phaser.Display.Color.HexStringToColor(btn.color).color, 0.9)
        .setInteractive({ useHandCursor: true })
        .setOrigin(0.5);

      const text = this.add.text(GAME_WIDTH / 2, y, btn.text, {
        fontSize: '24px',
        fontFamily: 'Arial Black, Arial, sans-serif',
        color: '#FFFFFF',
        fontStyle: 'bold',
      }).setOrigin(0.5);

      // Hover effects
      bg.on('pointerover', () => {
        bg.setScale(1.05);
        text.setScale(1.05);
      });
      bg.on('pointerout', () => {
        bg.setScale(1);
        text.setScale(1);
      });
      bg.on('pointerdown', () => {
        this.cameras.main.fade(300, 0, 0, 0, false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
          if (progress === 1) {
            this.scene.start(btn.scene);
          }
        });
      });
    });

    // Version & credits
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 60, 'Karate Atlanta Brookwood  •  Cumming, Georgia', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#555555',
    }).setOrigin(0.5);

    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 38, 'v0.1.0  •  Made with ❤️ for Zoe', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      color: '#444444',
    }).setOrigin(0.5);

    // Controls hint
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 100, 'Arrow Keys to Move  •  A / S / D to Attack  •  Space to Block', {
      fontSize: '14px',
      fontFamily: 'Arial, sans-serif',
      color: '#666666',
    }).setOrigin(0.5);

    // Fade in
    this.cameras.main.fadeIn(500);
  }
}
