import Phaser from 'phaser';
import {
  SCENES, GAME_WIDTH, GAME_HEIGHT, GROUND_Y, COLORS,
  ATTACKS, KI_GAIN_ON_HIT, ROUND_TIME, ROUNDS_TO_WIN
} from '../config/Constants';
import { Character, AttackStrength } from '../characters/Character';
import { SoundManager } from '../systems/SoundManager';

export class BattleScene extends Phaser.Scene {
  private player!: Character;
  private opponent!: Character;
  private ground!: Phaser.GameObjects.Image;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private attackKeys!: { light: Phaser.Input.Keyboard.Key; medium: Phaser.Input.Keyboard.Key; heavy: Phaser.Input.Keyboard.Key; block: Phaser.Input.Keyboard.Key };

  // HUD elements
  private playerHealthBar!: Phaser.GameObjects.Rectangle;
  private playerHealthBg!: Phaser.GameObjects.Rectangle;
  private opponentHealthBar!: Phaser.GameObjects.Rectangle;
  private opponentHealthBg!: Phaser.GameObjects.Rectangle;
  private playerKiBar!: Phaser.GameObjects.Rectangle;
  private opponentKiBar!: Phaser.GameObjects.Rectangle;
  private timerText!: Phaser.GameObjects.Text;
  private comboText!: Phaser.GameObjects.Text;
  private playerNameText!: Phaser.GameObjects.Text;
  private opponentNameText!: Phaser.GameObjects.Text;
  private roundText!: Phaser.GameObjects.Text;
  private soundToggle!: Phaser.GameObjects.Text;

  // Game state
  private roundTimer: number = ROUND_TIME;
  private timerEvent?: Phaser.Time.TimerEvent;
  private playerWins: number = 0;
  private opponentWins: number = 0;
  private currentRound: number = 1;
  private battleActive: boolean = false;

  // AI
  private aiTimer: number = 0;
  private aiActionInterval: number = 800; // ms between AI decisions

  // Sound
  private soundManager!: SoundManager;

  constructor() {
    super({ key: SCENES.BATTLE });
  }

  create(): void {
    // Sound manager
    this.soundManager = SoundManager.getInstance(this);

    // Background
    this.cameras.main.setBackgroundColor(0x16213E);

    // Dojo background elements
    this.createDojoBackground();

    // Ground
    this.ground = this.add.image(GAME_WIDTH / 2, GROUND_Y + 70, 'ground');

    // Ground physics (invisible platform)
    const groundZone = this.add.zone(GAME_WIDTH / 2, GROUND_Y + 48, GAME_WIDTH, 32);
    this.physics.add.existing(groundZone, true);

    // Create fighters
    this.player = new Character(this, 300, GROUND_Y - 48, 'zoe', 'ZOE');
    this.player.isPlayer = true;
    this.player.facing = 'right';

    this.opponent = new Character(this, GAME_WIDTH - 300, GROUND_Y - 48, 'opponent', 'KAI');
    this.opponent.facing = 'left';

    // Ground collision
    this.physics.add.collider(this.player, groundZone);
    this.physics.add.collider(this.opponent, groundZone);

    // Input
    this.cursors = this.input.keyboard!.createCursorKeys();
    this.attackKeys = {
      light: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.A),
      medium: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.S),
      heavy: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.D),
      block: this.input.keyboard!.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
    };

    // Create HUD
    this.createHUD();

    // Listen for combat events
    this.events.on('character-attack', this.handleAttack, this);
    this.events.on('character-died', this.handleDeath, this);

    // Start round
    this.startRound();

    // Fade in
    this.cameras.main.fadeIn(300);
  }

  update(time: number, delta: number): void {
    if (!this.battleActive) return;

    // Update characters
    this.player.update();
    this.opponent.update();

    // Auto-face each other
    this.player.facing = this.player.x < this.opponent.x ? 'right' : 'left';
    this.opponent.facing = this.opponent.x < this.player.x ? 'right' : 'left';

    // Player input
    this.handlePlayerInput();

    // AI opponent
    this.updateAI(time, delta);

    // Update HUD
    this.updateHUD();
  }

  private handlePlayerInput(): void {
    // Movement
    if (this.cursors.left.isDown) {
      this.player.moveLeft();
    } else if (this.cursors.right.isDown) {
      this.player.moveRight();
    } else {
      this.player.stopMoving();
    }

    // Jump
    if (this.cursors.up.isDown) {
      this.player.jump();
    }

    // Block
    if (this.attackKeys.block.isDown) {
      this.player.block();
    } else {
      this.player.unblock();
    }

    // Attacks
    if (Phaser.Input.Keyboard.JustDown(this.attackKeys.light)) {
      this.player.attack('LIGHT');
    } else if (Phaser.Input.Keyboard.JustDown(this.attackKeys.medium)) {
      this.player.attack('MEDIUM');
    } else if (Phaser.Input.Keyboard.JustDown(this.attackKeys.heavy)) {
      this.player.attack('HEAVY');
    }
  }

  private updateAI(_time: number, delta: number): void {
    this.aiTimer += delta;
    if (this.aiTimer < this.aiActionInterval) return;
    this.aiTimer = 0;

    // Simple AI: random actions weighted by distance
    const distance = Math.abs(this.player.x - this.opponent.x);
    const rand = Math.random();

    if (distance > 200) {
      // Approach player
      if (this.player.x < this.opponent.x) {
        this.opponent.moveLeft();
      } else {
        this.opponent.moveRight();
      }
    } else if (distance < 100) {
      // In range: attack or block
      if (rand < 0.4) {
        const strengths: AttackStrength[] = ['LIGHT', 'MEDIUM', 'HEAVY'];
        this.opponent.attack(strengths[Math.floor(Math.random() * strengths.length)]);
      } else if (rand < 0.6) {
        this.opponent.block();
        this.time.delayedCall(500, () => this.opponent.unblock());
      } else {
        // Dodge back
        if (this.player.x < this.opponent.x) {
          this.opponent.moveRight();
        } else {
          this.opponent.moveLeft();
        }
      }
    } else {
      // Medium range: mix of approach and attack
      if (rand < 0.5) {
        if (this.player.x < this.opponent.x) {
          this.opponent.moveLeft();
        } else {
          this.opponent.moveRight();
        }
      } else if (rand < 0.8) {
        this.opponent.attack('MEDIUM');
      } else {
        this.opponent.stopMoving();
      }
    }
  }

  private handleAttack(event: { attacker: Character; strength: AttackStrength; data: typeof ATTACKS[AttackStrength] }): void {
    const { attacker, strength, data } = event;
    const target = attacker === this.player ? this.opponent : this.player;

    // Check if in range
    const distance = Math.abs(attacker.x - target.x);
    const attackRange = strength === 'HEAVY' ? 120 : strength === 'MEDIUM' ? 100 : 80;

    if (distance <= attackRange) {
      const isBlocked = target.state === 'blocking';
      target.takeDamage(data.damage, isBlocked);
      attacker.addKi(KI_GAIN_ON_HIT);

      // Sound effects
      if (isBlocked) {
        this.soundManager.playBlock();
      } else {
        this.soundManager.playHit(strength);
      }

      // Show combo counter
      if (!isBlocked && target.comboCount > 1) {
        this.showComboText(target.comboCount, target.comboDamage, attacker === this.player);
      }

      // Camera shake on heavy hits
      if (strength === 'HEAVY' && !isBlocked) {
        this.cameras.main.shake(150, 0.01);
      }
    }
  }

  private handleDeath(character: Character): void {
    this.battleActive = false;
    this.timerEvent?.remove();

    if (character === this.opponent) {
      this.playerWins++;
      this.showRoundResult('ZOE WINS!', COLORS.ACCENT);
      this.soundManager.playWin();
    } else {
      this.opponentWins++;
      this.showRoundResult('KAI WINS!', COLORS.ACCENT2);
    }

    // Check match result or start next round
    this.time.delayedCall(2000, () => {
      if (this.playerWins >= ROUNDS_TO_WIN || this.opponentWins >= ROUNDS_TO_WIN) {
        this.scene.start(SCENES.GAME_OVER, {
          winner: this.playerWins >= ROUNDS_TO_WIN ? 'ZOE' : 'KAI',
          playerWins: this.playerWins,
          opponentWins: this.opponentWins,
        });
      } else {
        this.currentRound++;
        this.resetRound();
      }
    });
  }

  private startRound(): void {
    this.roundTimer = ROUND_TIME;
    this.battleActive = false;

    // Round announcement
    this.showRoundResult(`ROUND ${this.currentRound}`, COLORS.GOLD);

    this.time.delayedCall(1500, () => {
      this.showRoundResult('FIGHT!', COLORS.ACCENT);
      this.soundManager.playFight();
    });

    this.time.delayedCall(2500, () => {
      this.battleActive = true;
      this.roundText.setVisible(false);

      // Start timer
      this.timerEvent = this.time.addEvent({
        delay: 1000,
        callback: () => {
          this.roundTimer--;
          if (this.roundTimer <= 0) {
            this.handleTimeUp();
          }
        },
        repeat: ROUND_TIME - 1,
      });
    });
  }

  private resetRound(): void {
    this.player.reset();
    this.opponent.reset();
    this.player.setPosition(300, GROUND_Y - 48);
    this.opponent.setPosition(GAME_WIDTH - 300, GROUND_Y - 48);
    this.startRound();
  }

  private handleTimeUp(): void {
    this.battleActive = false;
    // Player with more health wins
    if (this.player.health >= this.opponent.health) {
      this.playerWins++;
      this.showRoundResult('TIME! ZOE WINS!', COLORS.ACCENT);
    } else {
      this.opponentWins++;
      this.showRoundResult('TIME! KAI WINS!', COLORS.ACCENT2);
    }

    this.time.delayedCall(2000, () => {
      if (this.playerWins >= ROUNDS_TO_WIN || this.opponentWins >= ROUNDS_TO_WIN) {
        this.scene.start(SCENES.GAME_OVER, {
          winner: this.playerWins >= ROUNDS_TO_WIN ? 'ZOE' : 'KAI',
          playerWins: this.playerWins,
          opponentWins: this.opponentWins,
        });
      } else {
        this.currentRound++;
        this.resetRound();
      }
    });
  }

  // ========== HUD ==========

  private createHUD(): void {
    const barWidth = 400;
    const barHeight = 24;
    const kiBarHeight = 8;
    const margin = 40;

    // Player health
    this.playerHealthBg = this.add.rectangle(margin, 30, barWidth, barHeight, 0x333333).setOrigin(0, 0.5);
    this.playerHealthBar = this.add.rectangle(margin, 30, barWidth, barHeight, COLORS.HEALTH_GREEN).setOrigin(0, 0.5);
    this.playerNameText = this.add.text(margin, 10, 'ZOE', { fontSize: '14px', fontFamily: 'Arial Black', color: '#E94560' });

    // Player Ki meter
    this.playerKiBar = this.add.rectangle(margin, 48, 0, kiBarHeight, COLORS.KI_BLUE).setOrigin(0, 0.5);

    // Opponent health (right-aligned)
    this.opponentHealthBg = this.add.rectangle(GAME_WIDTH - margin, 30, barWidth, barHeight, 0x333333).setOrigin(1, 0.5);
    this.opponentHealthBar = this.add.rectangle(GAME_WIDTH - margin, 30, barWidth, barHeight, COLORS.HEALTH_GREEN).setOrigin(1, 0.5);
    this.opponentNameText = this.add.text(GAME_WIDTH - margin, 10, 'KAI', { fontSize: '14px', fontFamily: 'Arial Black', color: '#0F3460' }).setOrigin(1, 0);

    // Opponent Ki meter
    this.opponentKiBar = this.add.rectangle(GAME_WIDTH - margin, 48, 0, kiBarHeight, COLORS.KI_BLUE).setOrigin(1, 0.5);

    // Timer
    this.timerText = this.add.text(GAME_WIDTH / 2, 32, '99', {
      fontSize: '36px',
      fontFamily: 'Arial Black',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 3,
    }).setOrigin(0.5);

    // Round wins indicators
    for (let i = 0; i < ROUNDS_TO_WIN; i++) {
      this.add.circle(GAME_WIDTH / 2 - 25 + (i * 20), 60, 6, 0x333333); // Player wins slots
      this.add.circle(GAME_WIDTH / 2 + 15 + (i * 20), 60, 6, 0x333333); // Opponent wins slots
    }

    // Combo text (hidden by default)
    this.comboText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 100, '', {
      fontSize: '32px',
      fontFamily: 'Arial Black',
      color: '#FFD700',
      stroke: '#000000',
      strokeThickness: 4,
    }).setOrigin(0.5).setVisible(false);

    // Round announcement text
    this.roundText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 50, '', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#FFFFFF',
      stroke: '#000000',
      strokeThickness: 6,
    }).setOrigin(0.5).setVisible(false).setDepth(100);

    // Sound toggle button (top-right corner)
    const isMuted = this.soundManager.isMuted();
    this.soundToggle = this.add.text(GAME_WIDTH - 15, 75, isMuted ? '🔇' : '🔊', {
      fontSize: '24px',
    }).setOrigin(1, 0).setInteractive({ useHandCursor: true }).setDepth(100);

    this.soundToggle.on('pointerdown', () => {
      const nowMuted = this.soundManager.toggle();
      this.soundToggle.setText(nowMuted ? '🔇' : '🔊');
    });
  }

  private updateHUD(): void {
    const barWidth = 400;

    // Health bars
    const playerHealthPct = this.player.health / this.player.maxHealth;
    const oppHealthPct = this.opponent.health / this.opponent.maxHealth;

    this.playerHealthBar.width = barWidth * playerHealthPct;
    this.opponentHealthBar.width = barWidth * oppHealthPct;

    // Color change on low health
    this.playerHealthBar.fillColor = playerHealthPct < 0.3 ? COLORS.HEALTH_RED : COLORS.HEALTH_GREEN;
    this.opponentHealthBar.fillColor = oppHealthPct < 0.3 ? COLORS.HEALTH_RED : COLORS.HEALTH_GREEN;

    // Ki bars
    this.playerKiBar.width = (this.player.ki / this.player.maxKi) * barWidth;
    this.opponentKiBar.width = (this.opponent.ki / this.opponent.maxKi) * barWidth;

    // Timer
    this.timerText.setText(this.roundTimer.toString());
    if (this.roundTimer <= 10) {
      this.timerText.setColor('#E94560');
    }
  }

  private showComboText(hits: number, damage: number, isPlayerCombo: boolean): void {
    const x = isPlayerCombo ? GAME_WIDTH - 200 : 200;
    this.comboText.setPosition(x, GAME_HEIGHT / 2 - 80);
    this.comboText.setText(`${hits} HIT COMBO!\n${damage} DMG`);
    this.comboText.setVisible(true);
    this.comboText.setScale(1.5);
    this.comboText.setAlpha(1);

    this.tweens.add({
      targets: this.comboText,
      scale: 1,
      alpha: 0,
      duration: 1200,
      ease: 'Power2',
      onComplete: () => this.comboText.setVisible(false),
    });
  }

  private showRoundResult(text: string, color: number): void {
    this.roundText.setText(text);
    this.roundText.setColor(`#${color.toString(16).padStart(6, '0')}`);
    this.roundText.setVisible(true);
    this.roundText.setScale(0);
    this.roundText.setAlpha(1);

    this.tweens.add({
      targets: this.roundText,
      scale: 1,
      duration: 400,
      ease: 'Back.easeOut',
    });
  }

  private createDojoBackground(): void {
    // Dojo walls
    const wallGradient = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x16213E);

    // ATA banner (left)
    this.add.rectangle(120, 200, 80, 160, COLORS.ACCENT, 0.3);
    this.add.text(120, 200, 'ATA', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#E94560'
    }).setOrigin(0.5).setAlpha(0.6);

    // ATA banner (right)
    this.add.rectangle(GAME_WIDTH - 120, 200, 80, 160, COLORS.ACCENT2, 0.3);
    this.add.text(GAME_WIDTH - 120, 200, 'ATA', {
      fontSize: '20px', fontFamily: 'Arial Black', color: '#0F3460'
    }).setOrigin(0.5).setAlpha(0.6);

    // Dojo floor line
    this.add.line(0, 0, 0, GROUND_Y, GAME_WIDTH, GROUND_Y, 0x444444, 0.5).setOrigin(0);
  }
}
