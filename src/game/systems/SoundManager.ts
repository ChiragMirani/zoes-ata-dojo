import Phaser from 'phaser';
import { AttackStrength } from '../characters/Character';

/**
 * SoundManager — handles all game audio with a quick mute toggle.
 *
 * Uses Web Audio API oscillators for placeholder sounds.
 * Replace with real audio files (mp3/ogg) for production.
 *
 * Quick toggle: Click the 🔊/🔇 icon in the top-right during battle,
 * or call SoundManager.getInstance(scene).toggle().
 */
export class SoundManager {
  private static instance: SoundManager | null = null;
  private scene: Phaser.Scene;
  private audioContext: AudioContext | null = null;
  private muted: boolean = false;
  private volume: number = 0.3;

  private constructor(scene: Phaser.Scene) {
    this.scene = scene;
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    } catch {
      console.warn('Web Audio API not available — sounds disabled');
    }

    // Restore mute state from memory
    try {
      const saved = sessionStorage.getItem('zoe-dojo-muted');
      if (saved === 'true') this.muted = true;
    } catch {
      // sessionStorage not available, that's fine
    }
  }

  static getInstance(scene: Phaser.Scene): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager(scene);
    }
    SoundManager.instance.scene = scene;
    return SoundManager.instance;
  }

  /** Toggle sound on/off. Returns the new muted state. */
  toggle(): boolean {
    this.muted = !this.muted;
    try {
      sessionStorage.setItem('zoe-dojo-muted', String(this.muted));
    } catch { /* ignore */ }
    return this.muted;
  }

  /** Set mute state directly */
  setMuted(muted: boolean): void {
    this.muted = muted;
    try {
      sessionStorage.setItem('zoe-dojo-muted', String(this.muted));
    } catch { /* ignore */ }
  }

  isMuted(): boolean {
    return this.muted;
  }

  setVolume(vol: number): void {
    this.volume = Math.max(0, Math.min(1, vol));
  }

  // ========== Sound Effects (Placeholder oscillator-based) ==========

  playHit(strength: AttackStrength): void {
    if (this.muted || !this.audioContext) return;

    const freq = strength === 'LIGHT' ? 800 : strength === 'MEDIUM' ? 500 : 300;
    const duration = strength === 'LIGHT' ? 0.05 : strength === 'MEDIUM' ? 0.08 : 0.12;
    this.playTone(freq, duration, 'square', this.volume);

    // Impact noise
    this.playNoise(duration * 0.7, this.volume * 0.4);
  }

  playBlock(): void {
    if (this.muted || !this.audioContext) return;
    this.playTone(200, 0.06, 'triangle', this.volume * 0.5);
  }

  playFight(): void {
    if (this.muted || !this.audioContext) return;
    // Rising tone
    this.playTone(400, 0.15, 'sawtooth', this.volume * 0.6);
    setTimeout(() => this.playTone(600, 0.15, 'sawtooth', this.volume * 0.6), 150);
    setTimeout(() => this.playTone(800, 0.25, 'sawtooth', this.volume * 0.8), 300);
  }

  playWin(): void {
    if (this.muted || !this.audioContext) return;
    // Victory jingle
    const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
    notes.forEach((freq, i) => {
      setTimeout(() => this.playTone(freq, 0.2, 'sine', this.volume * 0.5), i * 150);
    });
  }

  playMenuSelect(): void {
    if (this.muted || !this.audioContext) return;
    this.playTone(600, 0.05, 'sine', this.volume * 0.3);
  }

  // ========== Low-level audio ==========

  private playTone(frequency: number, duration: number, type: OscillatorType, volume: number): void {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = type;
    osc.frequency.setValueAtTime(frequency, ctx.currentTime);

    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + duration + 0.01);
  }

  private playNoise(duration: number, volume: number): void {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const bufferSize = Math.floor(ctx.sampleRate * duration);
    const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
    const data = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
      data[i] = Math.random() * 2 - 1;
    }

    const source = ctx.createBufferSource();
    source.buffer = buffer;

    const gain = ctx.createGain();
    gain.gain.setValueAtTime(volume, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);

    // High-pass filter for impact feel
    const filter = ctx.createBiquadFilter();
    filter.type = 'highpass';
    filter.frequency.value = 2000;

    source.connect(filter);
    filter.connect(gain);
    gain.connect(ctx.destination);

    source.start(ctx.currentTime);
    source.stop(ctx.currentTime + duration + 0.01);
  }
}
