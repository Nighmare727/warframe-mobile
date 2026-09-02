/**
 * Particle Effect System
 * Creates visual feedback for abilities, hits, and environmental effects
 */

class Particle {
  constructor(position, angle, color, element) {
    this.position = { ...position };
    this.velocity = {
      x: Math.cos(angle) * 300,
      y: Math.sin(angle) * 300
    };
    
    this.color = color;
    this.element = element;
    this.radius = 3;
    this.lifetime = 0.5;
    this.age = 0;
    this.gravity = 300;
  }

  update(deltaTime) {
    this.age += deltaTime;
    
    this.velocity.y += this.gravity * deltaTime;
    
    this.position.x += this.velocity.x * deltaTime;
    this.position.y += this.velocity.y * deltaTime;
    
    this.velocity.x *= 0.98;
    this.velocity.y *= 0.98;
  }

  isDead() {
    return this.age >= this.lifetime;
  }

  render(ctx) {
    const alpha = 1 - (this.age / this.lifetime);
    ctx.fillStyle = this.color + Math.floor(alpha * 255).toString(16).padStart(2, '0');
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

class CastEffect {
  constructor(position, abilityName) {
    this.position = { ...position };
    this.abilityName = abilityName;
    this.particles = [];
    this.generateParticles();
  }

  generateParticles() {
    const particleCount = 12;
    const color = this.getAbilityColor();
    
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2;
      const particle = new Particle(this.position, angle, color, 'cast');
      this.particles.push(particle);
    }
  }

  getParticles() {
    return this.particles;
  }

  getAbilityColor() {
    const colors = {
      fireball: '#ff4444',
      voidshield: '#aa44ff',
      dash: '#ffff44',
      elementalburst: '#ff8844'
    };
    return colors[this.abilityName.toLowerCase()] || '#ffffff';
  }
}

module.exports = { Particle, CastEffect };