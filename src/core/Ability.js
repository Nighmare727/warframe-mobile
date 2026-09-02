/**
 * Ability System with Unique Mechanics
 * - Element combinations create new effects
 * - Energy-based casting system
 * - Dynamic cooldown scaling
 * - Chaining and synergy bonuses
 */

class Ability {
  constructor(name, element, energyCost, cooldown, abilityType) {
    this.name = name;
    this.element = element;
    this.energyCost = energyCost;
    this.cooldown = cooldown;
    this.cooldownRemaining = 0;
    this.abilityType = abilityType; // projectile, shield, dash, aoe, etc.
    
    this.damage = this.calculateDamage(element);
    this.radius = this.getAOERadius(abilityType);
    this.projectileSpeed = 400;
    
    this.castCount = 0;
    this.totalDamageDone = 0;
    this.synergies = [];
  }

  calculateDamage(element) {
    const baseDamage = {
      fire: 25,
      ice: 20,
      lightning: 30,
      earth: 22,
      void: 28,
      radiation: 35
    };
    return baseDamage[element] || 20;
  }

  getAOERadius(abilityType) {
    const radiuses = {
      projectile: 10,
      aoe: 100,
      shield: 80,
      dash: 20,
      summon: 50
    };
    return radiuses[abilityType] || 30;
  }

  canCast() {
    return this.cooldownRemaining <= 0;
  }

  cast(position, targetPosition) {
    if (!this.canCast()) return [];

    this.cooldownRemaining = this.cooldown;
    this.castCount++;

    let projectiles = [];

    if (this.abilityType === 'projectile') {
      projectiles = this.castProjectile(position, targetPosition);
    } else if (this.abilityType === 'aoe') {
      projectiles = this.castAOE(position);
    } else if (this.abilityType === 'shield') {
      projectiles = this.castShield(position);
    }

    return projectiles;
  }

  castProjectile(position, targetPosition) {
    const direction = {
      x: targetPosition.x - position.x,
      y: targetPosition.y - position.y
    };
    const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
    direction.x /= length;
    direction.y /= length;

    const projectile = new Projectile(
      position,
      direction,
      this.projectileSpeed,
      this.damage,
      this.element,
      this.abilityType
    );

    return [projectile];
  }

  castAOE(position) {
    // Create AOE effect at position
    const aoe = new AOEEffect(position, this.radius, this.damage, this.element);
    return [aoe];
  }

  castShield(position) {
    // Create shield around player
    const shield = new ShieldEffect(position, this.radius, this.element);
    return [shield];
  }

  // Synergy system - combining elements for enhanced effects
  checkSynergy(otherAbility) {
    const synergyCombos = {
      'fire-ice': { name: 'Thermal', multiplier: 1.5 },
      'fire-lightning': { name: 'Inferno', multiplier: 1.8 },
      'ice-lightning': { name: 'Frost', multiplier: 1.6 },
      'earth-void': { name: 'Collapse', multiplier: 2.0 },
      'radiation-void': { name: 'Annihilation', multiplier: 2.2 }
    };

    const key = `${this.element}-${otherAbility.element}`;
    const reverseKey = `${otherAbility.element}-${this.element}`;

    return synergyCombos[key] || synergyCombos[reverseKey] || null;
  }

  applyModifiers(modifiers = {}) {
    if (modifiers.damageMultiplier) {
      this.damage *= modifiers.damageMultiplier;
    }
    if (modifiers.cooldownReduction) {
      this.cooldown *= (1 - modifiers.cooldownReduction);
    }
    if (modifiers.energyCostReduction) {
      this.energyCost *= (1 - modifiers.energyCostReduction);
    }
  }

  getStats() {
    return {
      name: this.name,
      element: this.element,
      damage: this.damage.toFixed(1),
      energyCost: this.energyCost,
      cooldown: this.cooldown.toFixed(1),
      cooldownRemaining: this.cooldownRemaining.toFixed(2),
      castCount: this.castCount,
      totalDamage: this.totalDamageDone,
      type: this.abilityType
    };
  }
}

/**
 * Projectile class for ranged abilities
 */
class Projectile {
  constructor(position, direction, speed, damage, element, type) {
    this.position = { ...position };
    this.direction = direction;
    this.speed = speed;
    this.damage = damage;
    this.element = element;
    this.type = type;
    
    this.radius = 5;
    this.lifetime = 10; // seconds
    this.age = 0;
    this.destroyed = false;
    
    this.trail = [];
    this.trailLength = 5;
  }

  update(deltaTime) {
    this.position.x += this.direction.x * this.speed * deltaTime;
    this.position.y += this.direction.y * this.speed * deltaTime;
    
    this.age += deltaTime;
    if (this.age >= this.lifetime) {
      this.destroyed = true;
    }

    // Update trail
    this.trail.push({ ...this.position });
    if (this.trail.length > this.trailLength) {
      this.trail.shift();
    }
  }

  onHit(target) {
    this.destroyed = true;
    
    // Calculate final damage
    let finalDamage = this.damage;
    
    // Element-specific bonuses
    if (this.element === 'fire') finalDamage *= 1.1; // Fire deals 10% more
    if (this.element === 'lightning') finalDamage *= 1.15; // Lightning faster but same damage
    if (this.element === 'void') finalDamage *= 0.9; // Void penetrates shields
    
    return finalDamage;
  }

  isDestroyed() {
    return this.destroyed;
  }

  render(ctx) {
    // Draw trail
    ctx.strokeStyle = `${this.getElementColor()}80`;
    ctx.lineWidth = 2;
    ctx.beginPath();
    if (this.trail.length > 0) {
      ctx.moveTo(this.trail[0].x, this.trail[0].y);
      this.trail.forEach(point => {
        ctx.lineTo(point.x, point.y);
      });
      ctx.stroke();
    }

    // Draw projectile
    ctx.fillStyle = this.getElementColor();
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
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
 * AOE Effect class
 */
class AOEEffect {
  constructor(position, radius, damage, element) {
    this.position = { ...position };
    this.radius = radius;
    this.damage = damage;
    this.element = element;
    this.duration = 0.5;
    this.age = 0;
  }

  update(deltaTime) {
    this.age += deltaTime;
  }

  isDestroyed() {
    return this.age >= this.duration;
  }

  render(ctx) {
    const alpha = 1 - (this.age / this.duration);
    ctx.fillStyle = `${this.getElementColor()}${Math.floor(alpha * 255).toString(16)}`;
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
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

module.exports = { Ability, Projectile, AOEEffect };
