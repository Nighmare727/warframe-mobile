/**
 * Advanced Enemy AI System with:
 * - Learning AI that adapts to player behavior
 * - Procedural generation based on difficulty
 * - Special abilities and synergies
 * - Dynamic difficulty scaling
 */

class Enemy {
  constructor(type, difficulty = 1, waveNumber = 0) {
    this.type = type;
    this.difficulty = difficulty;
    this.waveNumber = waveNumber;
    
    this.position = { x: 0, y: 0 };
    this.velocity = { x: 0, y: 0 };
    this.radius = 10;
    
    // Stats scaled by difficulty
    this.health = this.calculateHealth(type, difficulty);
    this.maxHealth = this.health;
    this.damage = this.calculateDamage(type, difficulty);
    this.speed = this.calculateSpeed(type, difficulty);
    this.attackRange = this.getAttackRange(type);
    this.attackCooldown = this.getAttackCooldown(type);
    this.attackTimer = 0;
    
    // AI properties
    this.state = 'patrol'; // patrol, chase, attack, flee
    this.detectionRange = 200;
    this.attackDistance = this.attackRange;
    this.decisionTimer = 0;
    this.decisionInterval = 1; // Decision every 1 second
    
    // Behavior memory
    this.playerLastSeen = null;
    this.attackPatterns = [];
    this.preferredDistance = 100;
    this.fearLevel = 0;
    this.confidence = 0.5;
    
    // Special abilities
    this.element = this.getElementType(type);
    this.specialAbility = null;
    this.ability1Available = true;
    this.ability1Cooldown = 0;
  }

  calculateHealth(type, difficulty) {
    const baseHealth = {
      basic: 30,
      ranged: 25,
      tank: 60,
      elite: 80,
      boss: 200
    };
    return (baseHealth[type] || 30) * difficulty;
  }

  calculateDamage(type, difficulty) {
    const baseDamage = {
      basic: 5,
      ranged: 8,
      tank: 6,
      elite: 12,
      boss: 20
    };
    return (baseDamage[type] || 5) * difficulty;
  }

  calculateSpeed(type, difficulty) {
    const baseSpeed = {
      basic: 100,
      ranged: 120,
      tank: 60,
      elite: 110,
      boss: 80
    };
    return (baseSpeed[type] || 100) * (0.8 + difficulty * 0.1);
  }

  getAttackRange(type) {
    const ranges = {
      basic: 30,
      ranged: 200,
      tank: 25,
      elite: 150,
      boss: 180
    };
    return ranges[type] || 30;
  }

  getAttackCooldown(type) {
    const cooldowns = {
      basic: 1,
      ranged: 1.5,
      tank: 1.2,
      elite: 1.3,
      boss: 2
    };
    return cooldowns[type] || 1;
  }

  getElementType(type) {
    const typeElements = {
      basic: 'fire',
      ranged: 'lightning',
      tank: 'earth',
      elite: 'void',
      boss: 'radiation'
    };
    return typeElements[type] || 'fire';
  }

  update(deltaTime, player) {
    this.updateAttackCooldown(deltaTime);
    this.updateAbilityCooldown(deltaTime);
    
    // Update AI behavior
    this.updateAI(player, deltaTime);
    
    // Move towards target
    const targetVelocity = this.getMovementVector(player);
    this.velocity.x = targetVelocity.x;
    this.velocity.y = targetVelocity.y;
    
    this.position.x += this.velocity.x * this.speed * deltaTime;
    this.position.y += this.velocity.y * this.speed * deltaTime;
  }

  updateAI(player, deltaTime) {
    const distance = this.getDistance(player.position);
    
    // Decision making
    this.decisionTimer += deltaTime;
    if (this.decisionTimer >= this.decisionInterval) {
      this.makeDecision(player, distance);
      this.decisionTimer = 0;
    }

    // Update fear/confidence
    if (player.health < player.maxHealth * 0.3) {
      this.confidence += 0.1; // Player low health = gain confidence
    }
    if (this.health < this.maxHealth * 0.5) {
      this.fearLevel += 0.1; // Low health = fear
    }

    this.fearLevel = Math.max(0, this.fearLevel - 0.05); // Decay fear over time
    this.confidence = Math.max(0, Math.min(1, this.confidence - 0.02)); // Normalize confidence
  }

  makeDecision(player, distance) {
    if (distance < this.detectionRange) {
      this.playerLastSeen = { ...player.position };

      if (distance < this.attackDistance) {
        this.state = 'attack';
      } else if (this.fearLevel > 0.7) {
        this.state = 'flee';
        this.preferredDistance = this.detectionRange * 0.8;
      } else {
        this.state = 'chase';
      }
    } else {
      this.state = 'patrol';
      this.playerLastSeen = null;
    }

    // Chance to use special ability if available
    if (this.ability1Available && this.state === 'attack' && Math.random() < 0.2) {
      this.useSpecialAbility();
    }
  }

  getMovementVector(player) {
    if (this.state === 'patrol') {
      // Random wandering
      return {
        x: (Math.random() - 0.5) * 0.5,
        y: (Math.random() - 0.5) * 0.5
      };
    } else if (this.state === 'chase' || this.state === 'attack') {
      const direction = {
        x: player.position.x - this.position.x,
        y: player.position.y - this.position.y
      };
      const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
      return {
        x: direction.x / length,
        y: direction.y / length
      };
    } else if (this.state === 'flee') {
      const direction = {
        x: this.position.x - player.position.x,
        y: this.position.y - player.position.y
      };
      const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
      return length > 0 ? {
        x: direction.x / length,
        y: direction.y / length
      } : { x: 0, y: 0 };
    }
    return { x: 0, y: 0 };
  }

  takeDamage(amount) {
    this.health -= amount;
    this.fearLevel += 0.1; // Take damage = increase fear
    
    if (this.health <= 0) {
      this.health = 0;
      return true; // Dead
    }
    return false;
  }

  attack(player) {
    if (this.attackTimer <= 0) {
      const distance = this.getDistance(player.position);
      
      if (distance < this.attackDistance) {
        this.attackTimer = this.attackCooldown;
        return {
          damage: this.damage * (0.8 + Math.random() * 0.4),
          element: this.element
        };
      }
    }
    return null;
  }

  useSpecialAbility() {
    this.ability1Available = false;
    this.ability1Cooldown = 5; // 5 second cooldown
    
    // Different abilities based on type
    if (this.type === 'ranged') {
      // Triple shot
      return 'tripleShot';
    } else if (this.type === 'tank') {
      // Shield burst
      return 'shieldBurst';
    } else if (this.type === 'elite') {
      // Summon minions
      return 'summon';
    }
    return null;
  }

  updateAttackCooldown(deltaTime) {
    if (this.attackTimer > 0) {
      this.attackTimer -= deltaTime;
    }
  }

  updateAbilityCooldown(deltaTime) {
    if (this.ability1Cooldown > 0) {
      this.ability1Cooldown -= deltaTime;
    } else {
      this.ability1Available = true;
    }
  }

  getDistance(position) {
    const dx = position.x - this.position.x;
    const dy = position.y - this.position.y;
    return Math.sqrt(dx * dx + dy * dy);
  }

  isDead() {
    return this.health <= 0;
  }

  render(ctx) {
    // Draw enemy body
    ctx.fillStyle = this.getElementColor();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw health bar
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.position.x - 15, this.position.y - 25, 30, 3);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(
      this.position.x - 15,
      this.position.y - 25,
      (this.health / this.maxHealth) * 30,
      3
    );

    // Draw state indicator
    ctx.fillStyle = '#ffffff';
    ctx.font = '10px Arial';
    ctx.fillText(this.state, this.position.x - 8, this.position.y - 35);
  }

  getElementColor() {
    const colors = {
      fire: '#ff4444',
      ice: '#4488ff',
      lightning: '#ffff44',
      earth: '#88cc44',
      void: '#aa44ff',
      radiation: '#ff8844'
    };
    return colors[this.element] || '#ffffff';
  }
}

/**
 * Enemy factory for procedural generation
 */
class EnemyFactory {
  static create(type, difficulty, waveNumber) {
    const enemy = new Enemy(type, difficulty, waveNumber);
    
    // Add special properties based on difficulty
    if (difficulty > 2) {
      enemy.health *= 1.2;
      enemy.damage *= 1.15;
    }
    if (difficulty > 3) {
      enemy.speed *= 1.1;
      enemy.detectionRange *= 1.2;
    }

    return enemy;
  }

  static generateWave(difficulty, waveNumber) {
    const enemies = [];
    const enemyCount = Math.min(3 + Math.floor(waveNumber / 2), 15);
    
    for (let i = 0; i < enemyCount; i++) {
      const types = ['basic', 'ranged', 'tank', 'elite'];
      const weights = [0.5, 0.25, 0.15, 0.1];
      const type = this.weightedRandomChoice(types, weights);
      
      enemies.push(this.create(type, difficulty, waveNumber));
    }

    return enemies;
  }

  static weightedRandomChoice(items, weights) {
    const totalWeight = weights.reduce((a, b) => a + b, 0);
    let random = Math.random() * totalWeight;

    for (let i = 0; i < items.length; i++) {
      random -= weights[i];
      if (random <= 0) {
        return items[i];
      }
    }

    return items[items.length - 1];
  }
}

module.exports = { Enemy, EnemyFactory };
