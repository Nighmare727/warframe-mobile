/**
 * UI Manager
 * - Handles all UI rendering
 * - Menu system
 * - HUD and overlays
 */

class UIManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.currentScreen = 'game'; // game, menu, settings, inventory, pause
    this.elements = [];
    this.buttons = [];
    this.visible = true;
  }

  renderHUD(gameState) {
    const ctx = this.ctx;
    
    // Score
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(`Score: ${gameState.score}`, 20, 40);
    
    // Wave
    ctx.fillText(`Wave: ${gameState.wave}`, 20, 70);
    
    // Combo
    if (gameState.combo > 0) {
      ctx.fillStyle = '#ffff00';
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`${gameState.combo}x COMBO!`, this.width / 2 - 60, 60);
    }
    
    // Health bar
    this.drawHealthBar(ctx, gameState.playerHealth, gameState.playerMaxHealth, 20, this.height - 40, 200, 20);
    
    // Energy bar
    this.drawEnergyBar(ctx, gameState.playerEnergy || 100, gameState.playerMaxEnergy || 100, 20, this.height - 10, 200, 15);
    
    // Difficulty
    ctx.fillStyle = '#ff6666';
    ctx.font = '14px Arial';
    ctx.fillText(`Difficulty: ${gameState.difficulty}x`, this.width - 200, 40);
    
    // Enemies alive
    ctx.fillText(`Enemies: ${gameState.enemiesAlive}`, this.width - 200, 70);
  }

  drawHealthBar(ctx, current, max, x, y, width, height) {
    // Background
    ctx.fillStyle = '#333333';
    ctx.fillRect(x, y, width, height);
    
    // Health
    const healthPercent = current / max;
    const healthColor = healthPercent > 0.5 ? '#00ff00' : healthPercent > 0.25 ? '#ffff00' : '#ff0000';
    ctx.fillStyle = healthColor;
    ctx.fillRect(x, y, width * healthPercent, height);
    
    // Border
    ctx.strokeStyle = '#ffffff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    // Text
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`${Math.floor(current)}/${max}`, x + 10, y + 16);
  }

  drawEnergyBar(ctx, current, max, x, y, width, height) {
    // Background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(x, y, width, height);
    
    // Energy
    ctx.fillStyle = '#00aaff';
    ctx.fillRect(x, y, width * (current / max), height);
    
    // Border
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 1;
    ctx.strokeRect(x, y, width, height);
  }

  renderMainMenu() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.8)';
    ctx.fillRect(0, 0, this.width, this.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('Warframe Mobile Enhanced', this.width / 2 - 250, 100);
    
    // Buttons
    this.drawButton(ctx, 'Start Game', this.width / 2 - 100, 200, 200, 50);
    this.drawButton(ctx, 'Settings', this.width / 2 - 100, 280, 200, 50);
    this.drawButton(ctx, 'Quit', this.width / 2 - 100, 360, 200, 50);
  }

  renderPauseMenu() {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
    ctx.fillRect(0, 0, this.width, this.height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 36px Arial';
    ctx.fillText('PAUSED', this.width / 2 - 80, 100);
    
    this.drawButton(ctx, 'Resume', this.width / 2 - 100, 200, 200, 50);
    this.drawButton(ctx, 'Settings', this.width / 2 - 100, 280, 200, 50);
    this.drawButton(ctx, 'Main Menu', this.width / 2 - 100, 360, 200, 50);
  }

  drawButton(ctx, text, x, y, width, height) {
    ctx.fillStyle = '#4488ff';
    ctx.fillRect(x, y, width, height);
    
    ctx.strokeStyle = '#00aaff';
    ctx.lineWidth = 2;
    ctx.strokeRect(x, y, width, height);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(text, x + width / 2, y + height / 2 + 5);
    ctx.textAlign = 'left';
  }

  renderGameOver(stats) {
    const ctx = this.ctx;
    ctx.fillStyle = 'rgba(0, 0, 0, 0.9)';
    ctx.fillRect(0, 0, this.width, this.height);
    
    ctx.fillStyle = '#ff0000';
    ctx.font = 'bold 48px Arial';
    ctx.fillText('GAME OVER', this.width / 2 - 150, 100);
    
    ctx.fillStyle = '#ffffff';
    ctx.font = '20px Arial';
    ctx.fillText(`Final Score: ${stats.score}`, this.width / 2 - 100, 200);
    ctx.fillText(`Waves Survived: ${stats.wave}`, this.width / 2 - 100, 250);
    ctx.fillText(`Enemies Killed: ${stats.enemiesKilled}`, this.width / 2 - 100, 300);
    
    this.drawButton(ctx, 'Play Again', this.width / 2 - 100, 400, 200, 50);
    this.drawButton(ctx, 'Main Menu', this.width / 2 - 100, 480, 200, 50);
  }
}

module.exports = UIManager;