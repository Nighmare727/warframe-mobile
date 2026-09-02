/**
 * Player Class with Unique Mechanics:
 * - Dual element system (combine elements for new effects)
 * - Ability loadout customization
 * - Resource management (energy, ammo, stance)
 * - Movement mechanics (dash, slide, wall-run)
 */

class Player {
  constructor(x, y) {
    this.position = { x, y };
    this.velocity = { x: 0, y: 0 };
    this.acceleration = { x: 0, y: 0 };
    
    // Stats
    this.health = 100;
    this.maxHealth = 100;
    this.energy = 100;
    this.maxEnergy = 100;
    this.energyRegenRate = 20; // per second
    
    this.speed = 200; // pixels per second
    this.dashSpeed = 500;
    this.radius = 15;
    
    // Abilities and elements
    this.primaryElement = 'fire';
    this.secondaryElement = 'void';
    this.activeAbilities = [];
    this.abilities = this.initializeAbilities();
    
    // State
    this.isDashing = false;
    this.dashDirection = { x: 0, y: 0 };
    this.dashDuration = 0.3;
    this.dashCooldown = 0;
    this.isSliding = false;
    this.slideCooldown = 0;
    
    this.weaponType = 'rifle'; // rifle, shotgun, melee, bow
    this.currentStance = 'offensive'; // offensive, defensive, mobility
    
    // Animation
    this.rotation = 0;
    this.animationFrame = 0;
  }

  initializeAbilities() {
    return {
      primary: new Ability('Fireball', 'fire', 20, 1.5, 'projectile'),
      secondary: new Ability('VoidShield', 'void', 30, 3, 'shield'),
      mobility: new Ability('Dash', 'radiation', 15, 2, 'dash'),
      ultimate: new Ability('ElementalBurst', 'radiation', 50, 8, 'aoe')
    };
  }

  update(deltaTime, input) {
    // Handle input
    this.handleInput(input);

    // Update position
    this.velocity.x = input.moveX * this.speed;
    this.velocity.y = input.moveY * this.speed;

    if (this.isDashing) {
      this.velocity.x = this.dashDirection.x * this.dashSpeed;
      this.velocity.y = this.dashDirection.y * this.dashSpeed;
      this.dashCooldown -= deltaTime;
      if (this.dashCooldown <= 0) {
        this.isDashing = false;
      }
    }

    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;

    // Energy regeneration
    if (this.energy < this.maxEnergy) {
      this.energy = Math.min(
        this.maxEnergy,
        this.energy + this.energyRegenRate * deltaTime
      );
    }

    // Update cooldowns
    this.updateAbilityCooldowns(deltaTime);
    if (this.dashCooldown > 0) this.dashCooldown -= deltaTime;
    if (this.slideCooldown > 0) this.slideCooldown -= deltaTime;

    // Update animation
    this.updateAnimation(deltaTime);
  }

  handleInput(input) {
    if (input.dash && this.dashCooldown <= 0 && (input.moveX !== 0 || input.moveY !== 0)) {
      this.dash(input.moveX, input.moveY);
    }

    if (input.ability1) {
      this.castAbility('primary');
    }
    if (input.ability2) {
      this.castAbility('secondary');
    }
    if (input.ability3) {
      this.castAbility('mobility');
    }
    if (input.ultimate) {
      this.castAbility('ultimate');
    }
  }

  dash(dirX, dirY) {
    const length = Math.sqrt(dirX * dirX + dirY * dirY);
    this.dashDirection = {
      x: dirX / length,
      y: dirY / length
    };
    this.isDashing = true;
    this.dashCooldown = this.dashDuration;
  }

  castAbility(abilitySlot) {
    const ability = this.abilities[abilitySlot];
    
    if (ability && ability.canCast() && this.energy >= ability.energyCost) {
      this.energy -= ability.energyCost;
      return ability.cast(this.position, this.getMousePosition());
    }
    return null;
  }

  updateAbilityCooldowns(deltaTime) {
    Object.values(this.abilities).forEach(ability => {
      if (ability.cooldownRemaining > 0) {
        ability.cooldownRemaining -= deltaTime;
      }
    });
  }

  updateAnimation(deltaTime) {
    this.animationFrame += deltaTime;
    if (this.animationFrame > 0.1) {
      this.animationFrame = 0;
    }
  }

  takeDamage(amount) {
    // Apply damage reduction based on stance
    let reducedDamage = amount;
    if (this.currentStance === 'defensive') {
      reducedDamage = amount * 0.7;
    }

    this.health -= reducedDamage;
    
    if (this.health <= 0) {
      this.health = 0;
      this.onDeath();
    }

    return reducedDamage;
  }

  heal(amount) {
    this.health = Math.min(this.maxHealth, this.health + amount);
  }

  switchStance(stance) {
    this.currentStance = stance;
    
    if (stance === 'offensive') {
      this.speed = 220;
    } else if (stance === 'defensive') {
      this.speed = 160;
    } else if (stance === 'mobility') {
      this.speed = 280;
    }
  }

  switchElements(primary, secondary) {
    this.primaryElement = primary;
    this.secondaryElement = secondary;
    
    // Update ability elements based on new combination
    this.updateAbilityElements();
  }

  updateAbilityElements() {
    // Mix elements for unique effects
    this.abilities.primary.element = this.primaryElement;
    this.abilities.secondary.element = this.secondaryElement;
    
    // Special combined element effects
    if (this.primaryElement === 'fire' && this.secondaryElement === 'ice') {
      this.abilities.primary.effect = 'melt'; // Extra damage
    }
  }

  getAbility(name) {
    return this.abilities[name];
  }

  render(ctx) {
    // Draw player body
    ctx.fillStyle = '#00ff00';
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();

    // Draw rotation indicator
    ctx.strokeStyle = '#00ff00';
    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(
      this.position.x + Math.cos(this.rotation) * this.radius,
      this.position.y + Math.sin(this.rotation) * this.radius
    );
    ctx.stroke();

    // Draw health bar
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(this.position.x - 20, this.position.y - 40, 40, 5);
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(
      this.position.x - 20,
      this.position.y - 40,
      (this.health / this.maxHealth) * 40,
      5
    );

    // Draw energy bar
    ctx.fillStyle = '#0088ff';
    ctx.fillRect(this.position.x - 20, this.position.y - 30, 40, 3);
    ctx.fillStyle = '#00ffff';
    ctx.fillRect(
      this.position.x - 20,
      this.position.y - 30,
      (this.energy / this.maxEnergy) * 40,
      3
    );
  }

  onDeath() {
    // Trigger game over logic
  }

  getMousePosition() {
    // Placeholder - should be implemented with actual input handler
    return { x: 0, y: 0 };
  }
}

module.exports = Player;