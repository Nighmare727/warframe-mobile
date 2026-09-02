/**
 * Loot System
 * - Drop rates based on enemy type
 * - Rarity tiers (common, uncommon, rare, legendary)
 * - Stat bonuses and special effects
 */

class Loot {
  constructor(position, rarity = 'common') {
    this.position = { ...position };
    this.radius = 8;
    this.rarity = rarity;
    this.age = 0;
    this.lifetime = 30; // seconds before despawn
    this.collected = false;
    
    this.type = this.generateType();
    this.value = this.calculateValue();
    this.effect = this.generateEffect();
  }

  generateType() {
    const types = ['credit', 'health', 'energy', 'mod', 'blueprint'];
    const weights = [0.4, 0.25, 0.15, 0.15, 0.05];
    return this.weightedRandomChoice(types, weights);
  }

  calculateValue() {
    const baseValues = {
      credit: 50,
      health: 30,
      energy: 20,
      mod: 100,
      blueprint: 200
    };
    
    let value = baseValues[this.type] || 50;
    
    // Rarity multiplier
    const rarityMultipliers = {
      common: 1,
      uncommon: 1.5,
      rare: 2.5,
      legendary: 5
    };
    
    return Math.floor(value * (rarityMultipliers[this.rarity] || 1));
  }

  generateEffect() {
    const effects = {
      credit: { type: 'currency', amount: this.value },
      health: { type: 'heal', amount: this.value },
      energy: { type: 'energize', amount: this.value },
      mod: { type: 'upgrade', rarity: this.rarity },
      blueprint: { type: 'unlock', reward: 'new_ability' }
    };
    
    return effects[this.type] || { type: 'currency', amount: this.value };
  }

  update(deltaTime) {
    this.age += deltaTime;
    this.bobOffset = Math.sin(this.age * 3) * 5;
  }

  isExpired() {
    return this.age >= this.lifetime;
  }

  collect() {
    this.collected = true;
    return this.effect;
  }

  render(ctx) {
    const y = this.position.y + (this.bobOffset || 0);
    
    ctx.fillStyle = this.getRarityColor();
    ctx.beginPath();
    ctx.arc(this.position.x, y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Glow effect
    ctx.strokeStyle = this.getRarityColor();
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.arc(this.position.x, y, this.radius + 3, 0, Math.PI * 2);
    ctx.stroke();
  }

  getRarityColor() {
    const colors = {
      common: '#cccccc',
      uncommon: '#00dd00',
      rare: '#0088ff',
      legendary: '#ffaa00'
    };
    return colors[this.rarity] || '#ffffff';
  }

  weightedRandomChoice(items, weights) {
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

class LootManager {
  static generateLootFromEnemy(enemy) {
    const dropChance = 0.3;
    if (Math.random() > dropChance) return null;
    
    const rarityWeights = {
      basic: { common: 0.8, uncommon: 0.15, rare: 0.05 },
      ranged: { common: 0.7, uncommon: 0.2, rare: 0.08, legendary: 0.02 },
      tank: { common: 0.6, uncommon: 0.25, rare: 0.12, legendary: 0.03 },
      elite: { common: 0.4, uncommon: 0.3, rare: 0.25, legendary: 0.05 },
      boss: { uncommon: 0.3, rare: 0.5, legendary: 0.2 }
    };
    
    const weights = rarityWeights[enemy.type] || rarityWeights.basic;
    const rarity = this.weightedRandomChoice(
      Object.keys(weights),
      Object.values(weights)
    );
    
    return new Loot(enemy.position, rarity);
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

module.exports = { Loot, LootManager };