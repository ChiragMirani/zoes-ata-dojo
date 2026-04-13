import Phaser from 'phaser';
import { gameConfig } from './game/config/GameConfig';

// Hide loading screen once Phaser boots
const hideLoading = () => {
  const loading = document.getElementById('loading');
  if (loading) {
    loading.style.opacity = '0';
    loading.style.transition = 'opacity 0.5s ease-out';
    setTimeout(() => loading.remove(), 500);
  }
};

// Initialize the game
const game = new Phaser.Game(gameConfig);

// Listen for the first scene to start, then hide loading
game.events.once('ready', hideLoading);

// Fallback: hide loading after 3 seconds regardless
setTimeout(hideLoading, 3000);

// Handle window resize for mobile
window.addEventListener('resize', () => {
  game.scale.refresh();
});

export default game;
