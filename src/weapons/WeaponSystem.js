/**
 * Weapon System
 * - Multiple weapon types with unique properties
 * - Weapon upgrades and modifications
 * - Firing patterns and special attacks
 */

class Weapon {
  constructor(name, type, damage, fireRate, accuracy) {
    this.name = name;
    this.type = type; // rifle, shotgun, melee, bow, launcher
    this.damage = damage;
    this.fireRate = fireRate; // shots per second
    this.accuracy = accuracy; // 0-1
    this.ammo = Infinity;
    this.maxAmmo = Infinity;
    this.cooldown = 0;
    this.level = 1;
    this.modifications = [];
  }

  canFire() {
    return this.cooldown <= 0 && this.ammo > 0;
  }

  fire() {
    if (!this.canFire()) return false;
    
    this.cooldown = 1 / this.fireRate;
    if (this.ammo !== Infinity) {
      this.ammo--;
    }
    return true;
  }

  reload() {
    this.ammo = this.maxAmmo;
  }

  upgrade() {
    this.level++;
    this.damage *= 1.1;
    this.fireRate *= 1.05;
    this.accuracy = Math.min(1, this.accuracy + 0.05);
  }

  addModification(mod) {
    this.modifications.push(mod);
    this.applyModifications();
  }

  applyModifications() {
    let damageMultiplier = 1;
    let fireRateMultiplier = 1;
    
    this.modifications.forEach(mod => {
      if (mod.type === 'damage') damageMultiplier *= (1 + mod.value);
      if (mod.type === 'fireRate') fireRateMultiplier *= (1 + mod.value);
    });
    
    this.damage *= damageMultiplier;
    this.fireRate *= fireRateMultiplier;
  }

  update(deltaTime) {
    if (this.cooldown > 0) {
      this.cooldown -= deltaTime;
    }
  }

  getStats() {
    return {
      name: this.name,
      type: this.type,
      damage: this.damage.toFixed(1),
      fireRate: this.fireRate.toFixed(1),
      accuracy: (this.accuracy * 100).toFixed(0) + '%',
      ammo: this.ammo === Infinity ? '∞' : this.ammo,
      level: this.level,
      mods: this.modifications.length
    };
  }
}

class WeaponFactory {
  static createWeapon(weaponType) {
    const weapons = {
      rifle: new Weapon('Plasma Rifle', 'rifle', 25, 5, 0.85),
      shotgun: new Weapon('Scatter Gun', 'shotgun', 40, 1.5, 0.6),
      melee: new Weapon('Energy Blade', 'melee', 35, 2, 1),
      bow: new Weapon('Inferno Bow', 'bow', 30, 2.5, 0.9),
      launcher: new Weapon('Rocket Launcher', 'launcher', 60, 0.5, 0.95)
    };
    
    return weapons[weaponType] || weapons.rifle;
  }

  static getAvailableWeapons() {
    return ['rifle', 'shotgun', 'melee', 'bow', 'launcher'];
  }
}

module.exports = { Weapon, WeaponFactory };