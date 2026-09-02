/**
 * Boss System
 * - Unique boss enemies with multiple phases
 * - Special abilities and attack patterns
 * - Epic loot rewards
 */

class Boss {
  constructor(name, difficulty = 1) {
    this.name = name;
    this.difficulty = difficulty;
    
    this.position = { x: 400, y: 300 };
    this.velocity = { x: 0, y: 0 };
    this.radius = 25;
    
    this.health = this.calculateHealth();
    this.maxHealth = this.health;
    this.damage = 25 * difficulty;
    this.speed = 80;
    
    this.phase = 1;
    this.maxPhases = 3;
    this.phaseThreshold = this.maxHealth / this.maxPhases;
    
    this.state = 'idle';
    this.attackPattern = [];
    this.currentAttack = 0;
    this.attackCooldown = 0;
    this.specialAbilityCooldown = 0;
    
    this.element = 'radiation';
    this.immunities = [];
    this.buffs = [];
  }

  calculateHealth() {
    return 500 * this.difficulty * (1 + this.phase * 0.5);
  }

  update(deltaTime, player) {
    if (this.health <= 0) return;
    
    // Phase transition
    if (this.health < this.phaseThreshold * (this.maxPhases - this.phase + 1)) {
      this.transitionPhase();
    }
    
    // Movement
    this.updateMovement(player, deltaTime);
    
    // Attacks
    this.updateAttacks(deltaTime);
    
    // Update cooldowns
    this.attackCooldown -= deltaTime;
    this.specialAbilityCooldown -= deltaTime;
  }

  updateMovement(player, deltaTime) {
    const dx = player.position.x - this.position.x;
    const dy = player.position.y - this.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    
    if (distance > 0) {
      this.velocity.x = (dx / distance) * this.speed;
      this.velocity.y = (dy / distance) * this.speed;
    }
    
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
  }

  updateAttacks(deltaTime) {
    if (this.attackCooldown > 0) {
      this.attackCooldown -= deltaTime;
      return;
    }
    
    // Execute attack pattern
    if (this.currentAttack < this.attackPattern.length) {
      const attack = this.attackPattern[this.currentAttack];
      this.executeAttack(attack);
      this.currentAttack++;
      this.attackCooldown = 1.5;
    }
  }

  executeAttack(attack) {
    switch (attack.type) {
      case 'swipe':
        this.state = 'attacking';
        break;
      case 'beam':
        this.state = 'beam';
        break;
      case 'summon':
        this.summonMinions();
        break;
      case 'bomb':
        this.createBombAttack();
        break;
    }
  }

  transitionPhase() {
    this.phase++;
    
    if (this.phase === 2) {
      this.attackPattern = [
        { type: 'swipe', damage: this.damage * 1.2 },
        { type: 'beam', damage: this.damage * 0.8 },
        { type: 'swipe', damage: this.damage * 1.2 }
      ];
    } else if (this.phase === 3) {
      this.attackPattern = [
        { type: 'beam', damage: this.damage * 1.5 },
        { type: 'bomb', damage: this.damage * 1.3 },
        { type: 'summon', count: 3 },
        { type: 'swipe', damage: this.damage * 2 }
      ];
    }
    
    this.currentAttack = 0;
    this.health = this.calculateHealth();
  }

  summonMinions() {
    // Spawn helper enemies
    return { type: 'summon', count: 2 };
  }

  createBombAttack() {
    // Create explosive AOE
    return { type: 'bomb', radius: 150, damage: this.damage * 1.3 };
  }

  takeDamage(amount) {
    this.health -= amount;
    
    if (this.health <= 0) {
      this.health = 0;
      return this.generateRewards();
    }
    return null;
  }

  generateRewards() {
    return {
      credits: 5000 * this.difficulty,
      experience: 1000 * this.difficulty,
      loot: 'legendary',
      achievement: 'boss_defeated'
    };
  }

  render(ctx) {
    // Draw boss body
    ctx.fillStyle = '#ff0000';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Draw health bar
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.position.x - 40, this.position.y - 50, 80, 5);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(
      this.position.x - 40,
      this.position.y - 50,
      (this.health / this.maxHealth) * 80,
      5
    );
    
    // Draw phase indicator
    ctx.fillStyle = '#ffffff';
    ctx.font = '12px Arial';
    ctx.fillText(`Phase ${this.phase}/${this.maxPhases}`, this.position.x - 20, this.position.y - 60);
    ctx.fillText(this.name, this.position.x - 30, this.position.y + 50);
  }
}

class BossFactory {
  static createBoss(bossName, difficulty = 1) {
    const bosses = {
      inferno: new Boss('Inferno Lord', difficulty),
      frostqueen: new Boss('Frost Queen', difficulty),
      tempest: new Boss('Tempest Warden', difficulty),
      void_titan: new Boss('Void Titan', difficulty)
    };
    
    const boss = bosses[bossName] || new Boss('Unknown Boss', difficulty);
    boss.setupPhase1();
    return boss;
  }

  static setupPhase1() {
    this.attackPattern = [
      { type: 'swipe', damage: this.damage },
      { type: 'swipe', damage: this.damage }
    ];
  }
}

module.exports = { Boss, BossFactory };