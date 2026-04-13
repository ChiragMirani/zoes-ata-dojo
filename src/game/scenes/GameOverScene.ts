import Phaser from 'phaser';
import { SCENES, GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config/Constants';

interface GameOverData {
  winner: string;
  playerWins: number;
  opponentWins: number;
}

export class GameOverScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.GAME_OVER });
  }

  create(data: GameOverData): void {
    this.cameras.main.setBackgroundColor(COLORS.PRIMARY);

    const isPlayerWin = data.winner === 'ZOE';
    const color = isPlayerWin ? '#E94560' : '#0F3460';
    const message = isPlayerWin ? 'VICTORY!' : 'DEFEAT';
    const subMessage = isPlayerWin
      ? 'The Brookwood spirit is strong!'
      : 'Every loss is a lesson. Train harder!';

    // Result
    this.add.text(GAME_WIDTH / 2, 180, message, {
      fontSize: '72px',
      fontFamily: 'Arial Black',
      color,
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5);

    // Sub message
    this.add.text(GAME_WIDTH / 2, 260, subMessage, {
      fontSize: '20px',
      fontFamily: 'Arial',
      color: '#888888',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    // Score
    this.add.text(GAME_WIDTH / 2, 320, `ZOE ${data.playerWins} — ${data.opponentWins} KAI`, {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      color: '#FFFFFF',
    }).setOrigin(0.5);

    // Buttons
    const buttons = [
      { text: 'REMATCH', scene: SCENES.BATTLE, y: 420 },
      { text: 'MAIN MENU', scene: SCENES.MENU, y: 490 },
    ];

    buttons.forEach((btn) => {
      const bg = this.add.rectangle(GAME_WIDTH / 2, btn.y, 280, 48, 0x333333)
        .setInteractive({ useHandCursor: true });
      const text = this.add.text(GAME_WIDTH / 2, btn.y, btn.text, {
        fontSize: '22px',
        fontFamily: 'Arial Black',
        color: '#FFFFFF',
      }).setOrigin(0.5);

      bg.on('pointerover', () => { bg.fillColor = 0x555555; });
      bg.on('pointerout', () => { bg.fillColor = 0x333333; });
      bg.on('pointerdown', () => {
        this.cameras.main.fade(300, 0, 0, 0, false, (_cam: Phaser.Cameras.Scene2D.Camera, progress: number) => {
          if (progress === 1) this.scene.start(btn.scene);
        });
      });
    });

    // Songahm quote
    this.add.text(GAME_WIDTH / 2, GAME_HEIGHT - 50, '"Pine tree and rock — strength and endurance." — Songahm', {
      fontSize: '13px',
      fontFamily: 'Arial',
      color: '#555555',
      fontStyle: 'italic',
    }).setOrigin(0.5);

    this.cameras.main.fadeIn(500);
  }
}
