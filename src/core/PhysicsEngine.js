/**
 * Physics Engine for Collision Detection and Movement
 */

class PhysicsEngine {
  constructor(width, height) {
    this.width = width;
    this.height = height;
    this.gravity = 0;
    this.collisions = [];
  }

  update(deltaTime, objects) {
    this.collisions = [];
    
    // Boundary checking
    objects.forEach(obj => {
      if (obj.position) {
        if (obj.position.x - obj.radius < 0) {
          obj.position.x = obj.radius;
          if (obj.velocity) obj.velocity.x = Math.abs(obj.velocity.x);
        }
        if (obj.position.x + obj.radius > this.width) {
          obj.position.x = this.width - obj.radius;
          if (obj.velocity) obj.velocity.x = -Math.abs(obj.velocity.x);
        }
        if (obj.position.y - obj.radius < 0) {
          obj.position.y = obj.radius;
          if (obj.velocity) obj.velocity.y = Math.abs(obj.velocity.y);
        }
        if (obj.position.y + obj.radius > this.height) {
          obj.position.y = this.height - obj.radius;
          if (obj.velocity) obj.velocity.y = -Math.abs(obj.velocity.y);
        }
      }
    });
  }

  checkCollision(obj1, obj2) {
    if (!obj1 || !obj2 || !obj1.position || !obj2.position) return false;
    
    const dx = obj2.position.x - obj1.position.x;
    const dy = obj2.position.y - obj1.position.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const minDistance = (obj1.radius || 0) + (obj2.radius || 0);
    
    return distance < minDistance;
  }

  getDistance(pos1, pos2) {
    const dx = pos2.x - pos1.x;
    const dy = pos2.y - pos1.y;
    return Math.sqrt(dx * dx + dy * dy);
  }
}

module.exports = PhysicsEngine;