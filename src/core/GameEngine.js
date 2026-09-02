/**
 * Enhanced Game Engine
 * Features:
 * - Dynamic ability combination system (elemental mixing)
 * - Procedural enemy generation with AI learning
 * - Real-time physics and collision detection
 * - Adaptive difficulty scaling
 * - Particle effects and visual feedback
 */

class GameEngine {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.deltaTime = 0;
    this.lastFrameTime = Date.now();
    
    this.player = null;
    this.enemies = [];
    this.projectiles = [];
    this.particles = [];
    this.gameObjects = [];
    
    this.gameState = 'playing'; // playing, paused, gameOver
    this.score = 0;
    this.combo = 0;
    this.comboTimer = 0;
    this.maxCombo = 0;
    
    this.difficulty = 1;
    this.waveNumber = 0;
    this.enemiesKilled = 0;
    this.totalDamageDealt = 0;
    
    this.inputHandler = new InputHandler();
    this.physicsEngine = new PhysicsEngine(width, height);
  }

  initialize(player) {
    this.player = player;
  }

  update() {
    if (this.gameState !== 'playing') return;

    // Calculate delta time
    const now = Date.now();
    this.deltaTime = (now - this.lastFrameTime) / 1000;
    this.lastFrameTime = now;

    // Update player
    this.player.update(this.deltaTime, this.inputHandler.getInput());

    // Update enemies with AI
    this.enemies.forEach(enemy => {
      enemy.update(this.deltaTime, this.player);
      enemy.updateAI(this.player, this.enemies);
    });

    // Update projectiles and handle collisions
    this.updateProjectiles();

    // Update particles (visual effects)
    this.particles = this.particles.filter(p => {
      p.update(this.deltaTime);
      return !p.isDead();
    });

    // Update combo system
    this.updateCombo();

    // Adaptive difficulty
    this.updateDifficulty();

    // Physics updates
    this.physicsEngine.update(this.deltaTime, [this.player, ...this.enemies, ...this.projectiles]);
  }

  updateProjectiles() {
    this.projectiles = this.projectiles.filter(projectile => {
      projectile.update(this.deltaTime);

      // Check collision with enemies
      this.enemies.forEach(enemy => {
        if (this.physicsEngine.checkCollision(projectile, enemy)) {
          const damage = projectile.onHit(enemy);
          this.totalDamageDealt += damage;
          enemy.takeDamage(damage);

          // Create hit particles
          this.createHitEffect(projectile.position, projectile.element);

          // Combo increase
          this.increaseCombo();

          projectile.destroy();
        }
      });

      return !projectile.isDestroyed();
    });
  }

  updateCombo() {
    if (this.comboTimer > 0) {
      this.comboTimer -= this.deltaTime;
    } else if (this.combo > 0) {
      this.combo = 0;
    }
  }

  updateDifficulty() {
    // Adaptive difficulty based on performance
    if (this.enemiesKilled > 0 && this.enemiesKilled % 10 === 0) {
      this.difficulty = Math.min(this.difficulty + 0.1, 5);
    }
  }

  increaseCombo() {
    this.combo++;
    this.comboTimer = 3; // 3 second combo window
    this.maxCombo = Math.max(this.maxCombo, this.combo);
    
    // Combo bonus to score
    const comboBonus = Math.floor(this.combo * 10);
    this.score += comboBonus;
  }

  spawnEnemy(enemyType = 'basic') {
    const enemy = EnemyFactory.create(enemyType, this.difficulty, this.waveNumber);
    enemy.position = {
      x: Math.random() * this.width,
      y: Math.random() * this.height
    };
    this.enemies.push(enemy);
  }

  spawnWave() {
    this.waveNumber++;
    const enemyCount = Math.min(3 + this.waveNumber, 15);
    
    for (let i = 0; i < enemyCount; i++) {
      const types = ['basic', 'ranged', 'tank', 'elite'];
      const randomType = types[Math.floor(Math.random() * types.length)];
      this.spawnEnemy(randomType);
    }
  }

  createHitEffect(position, element) {
    // Create particle effect based on element type
    const particleCount = 8;
    const color = this.getElementColor(element);
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const particle = new Particle(position, angle, color, element);
      this.particles.push(particle);
    }
  }

  getElementColor(element) {
    const colors = {
      fire: '#ff4444',
      ice: '#4488ff',
      lightning: '#ffff44',
      earth: '#88cc44',
      void: '#aa44ff',
      radiation: '#ff8844'
    };
    return colors[element] || '#ffffff';
  }

  castAbility(abilityName) {
    const ability = this.player.getAbility(abilityName);
    if (ability && ability.canCast()) {
      const projectiles = ability.cast(this.player.position, this.inputHandler.getMousePosition());
      this.projectiles.push(...projectiles);
      
      // Create casting particle effect
      this.createCastEffect(this.player.position, abilityName);
    }
  }

  createCastEffect(position, abilityName) {
    // Visual feedback for ability casting
    const effect = new CastEffect(position, abilityName);
    this.particles.push(...effect.getParticles());
  }

  handleEnemyDeath(enemy) {
    this.enemies = this.enemies.filter(e => e !== enemy);
    this.enemiesKilled++;
    const baseReward = 50;
    const reward = baseReward * this.difficulty * (1 + this.combo * 0.1);
    this.score += Math.floor(reward);
    
    // Chance to drop loot
    if (Math.random() < 0.3) {
      const loot = new Loot(enemy.position);
      this.gameObjects.push(loot);
    }

    // Check if wave is cleared
    if (this.enemies.length === 0) {
      this.spawnWave();
    }
  }

  getGameState() {
    return {
      score: this.score,
      combo: this.combo,
      maxCombo: this.maxCombo,
      wave: this.waveNumber,
      difficulty: this.difficulty.toFixed(1),
      enemiesAlive: this.enemies.length,
      playerHealth: this.player.health,
      playerMaxHealth: this.player.maxHealth
    };
  }

  render(canvas) {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, this.width, this.height);
    
    // Render background
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, this.width, this.height);

    // Render game objects
    this.player.render(ctx);
    this.enemies.forEach(enemy => enemy.render(ctx));
    this.projectiles.forEach(projectile => projectile.render(ctx));
    this.particles.forEach(particle => particle.render(ctx));

    // Render UI
    this.renderUI(ctx);
  }

  renderUI(ctx) {
    const state = this.getGameState();
    ctx.fillStyle = '#ffffff';
    ctx.font = '16px Arial';
    ctx.fillText(`Score: ${state.score}`, 10, 30);
    ctx.fillText(`Wave: ${state.wave}`, 10, 60);
    ctx.fillText(`Combo: ${state.combo}x`, 10, 90);
    ctx.fillText(`Health: ${state.playerHealth}/${state.playerMaxHealth}`, 10, 120);
  }
}

module.exports = GameEngine;