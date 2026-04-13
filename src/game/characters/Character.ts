import Phaser from 'phaser';
import {
  MAX_HEALTH, MOVE_SPEED, JUMP_VELOCITY, GROUND_Y,
  HIT_STUN_DURATION, ATTACKS, COLORS, MAX_KI,
  KI_GAIN_ON_HIT, KI_GAIN_ON_BLOCK
} from '../config/Constants';

export type CharacterState = 'idle' | 'moving' | 'jumping' | 'attacking' | 'hit' | 'blocking' | 'dead';
export type AttackStrength = 'LIGHT' | 'MEDIUM' | 'HEAVY' | 'SPECIAL';
export type Facing = 'left' | 'right';

export class Character extends Phaser.Physics.Arcade.Sprite {
  public maxHealth: number = MAX_HEALTH;
  public health: number = MAX_HEALTH;
  public ki: number = 0;
  public maxKi: number = MAX_KI;
  public state: CharacterState = 'idle';
  public facing: Facing = 'right';
  public isPlayer: boolean = false;
  public comboCount: number = 0;
  public comboDamage: number = 0;
  public characterName: string = 'Fighter';

  private hitStunTimer?: Phaser.Time.TimerEvent;
  private attackTimer?: Phaser.Time.TimerEvent;
  private isOnGround: boolean = true;

  constructor(scene: Phaser.Scene, x: number, y: number, texture: string, name: string = 'Fighter') {
    super(scene, x, y, texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);

    this.characterName = name;
    this.setCollideWorldBounds(true);
    this.setBounce(0);
    this.setDragX(800);

    // Set body size for collision
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setSize(48, 88);
    body.setOffset(8, 8);
  }

  update(): void {
    // Track ground state
    const body = this.body as Phaser.Physics.Arcade.Body;
    this.isOnGround = body.blocked.down || body.touching.down;

    // Auto-face opponent (handled by BattleScene)

    // Apply flip based on facing
    this.setFlipX(this.facing === 'left');
  }

  // Movement
  moveLeft(): void {
    if (this.state === 'attacking' || this.state === 'hit' || this.state === 'dead') return;
    this.setVelocityX(-MOVE_SPEED);
    if (this.state !== 'jumping') this.state = 'moving';
  }

  moveRight(): void {
    if (this.state === 'attacking' || this.state === 'hit' || this.state === 'dead') return;
    this.setVelocityX(MOVE_SPEED);
    if (this.state !== 'jumping') this.state = 'moving';
  }

  stopMoving(): void {
    if (this.state === 'attacking' || this.state === 'hit' || this.state === 'dead') return;
    this.setVelocityX(0);
    if (this.isOnGround) this.state = 'idle';
  }

  jump(): void {
    if (!this.isOnGround || this.state === 'attacking' || this.state === 'hit' || this.state === 'dead') return;
    this.setVelocityY(JUMP_VELOCITY);
    this.state = 'jumping';
  }

  block(): void {
    if (this.state === 'dead' || this.state === 'hit') return;
    this.state = 'blocking';
    this.setVelocityX(0);
    this.setTint(0x4444FF);
  }

  unblock(): void {
    if (this.state === 'blocking') {
      this.state = 'idle';
      this.clearTint();
    }
  }

  // Combat
  attack(strength: AttackStrength): void {
    if (this.state === 'attacking' || this.state === 'hit' || this.state === 'dead' || this.state === 'blocking') return;

    this.state = 'attacking';
    const data = ATTACKS[strength];

    // Visual feedback based on strength
    switch (strength) {
      case 'LIGHT':
        this.setTint(0xFFFF88);
        break;
      case 'MEDIUM':
        this.setTint(0xFFAA44);
        break;
      case 'HEAVY':
        this.setTint(0xFF4444);
        break;
      case 'SPECIAL':
        this.setTint(0x44FFFF);
        break;
    }

    // Recovery time — return to idle after attack animation
    const totalFrames = data.startup + data.active + data.recovery;
    const durationMs = (totalFrames / 60) * 1000;

    this.attackTimer = this.scene.time.delayedCall(durationMs, () => {
      if (this.state === 'attacking') {
        this.state = 'idle';
        this.clearTint();
      }
    });

    // Emit attack event for BattleScene to handle collision
    this.scene.events.emit('character-attack', {
      attacker: this,
      strength,
      data,
    });
  }

  takeDamage(amount: number, isBlocked: boolean = false): void {
    if (this.state === 'dead') return;

    if (isBlocked) {
      // Chip damage when blocking
      this.health -= Math.floor(amount * 0.15);
      this.ki += KI_GAIN_ON_BLOCK;

      // Block stun
      this.scene.time.delayedCall(HIT_STUN_DURATION * 0.6, () => {
        if (this.state === 'blocking') this.clearTint();
      });
    } else {
      this.health -= amount;
      this.state = 'hit';
      this.comboCount++;
      this.comboDamage += amount;

      // Hit flash
      this.setTint(COLORS.HIT_FLASH);

      // Hit stun
      this.hitStunTimer = this.scene.time.delayedCall(HIT_STUN_DURATION, () => {
        if (this.state === 'hit' && this.health > 0) {
          this.state = 'idle';
          this.clearTint();
          this.comboCount = 0;
          this.comboDamage = 0;
        }
      });

      // Knockback
      const knockbackDir = this.facing === 'right' ? -1 : 1;
      this.setVelocityX(knockbackDir * 200);

      // Hit effect
      this.createHitEffect();
    }

    // Clamp health
    this.health = Math.max(0, this.health);
    this.ki = Math.min(this.ki, this.maxKi);

    if (this.health <= 0) {
      this.die();
    }
  }

  addKi(amount: number): void {
    this.ki = Math.min(this.ki + amount, this.maxKi);
  }

  private die(): void {
    this.state = 'dead';
    this.setTint(0x333333);
    this.setVelocityX(0);
    this.scene.events.emit('character-died', this);
  }

  private createHitEffect(): void {
    const effect = this.scene.add.image(this.x, this.y - 20, 'hit-effect');
    effect.setScale(0.5);
    effect.setAlpha(1);

    this.scene.tweens.add({
      targets: effect,
      scale: 2,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => effect.destroy(),
    });
  }

  reset(): void {
    this.health = this.maxHealth;
    this.ki = 0;
    this.state = 'idle';
    this.comboCount = 0;
    this.comboDamage = 0;
    this.clearTint();
    this.setVelocity(0, 0);
  }
}
