/**
 * Input Handler for Mobile and Desktop Controls
 */

class InputHandler {
  constructor() {
    this.input = {
      moveX: 0,
      moveY: 0,
      mouseX: 0,
      mouseY: 0,
      ability1: false,
      ability2: false,
      ability3: false,
      ultimate: false,
      dash: false,
      pause: false
    };

    this.keys = {};
    this.touches = {};
    this.mouseDown = false;

    this.setupListeners();
  }

  setupListeners() {
    // Keyboard controls (Desktop)
    window.addEventListener('keydown', (e) => this.handleKeyDown(e));
    window.addEventListener('keyup', (e) => this.handleKeyUp(e));

    // Mouse controls (Desktop)
    window.addEventListener('mousemove', (e) => this.handleMouseMove(e));
    window.addEventListener('mousedown', (e) => this.handleMouseDown(e));
    window.addEventListener('mouseup', (e) => this.handleMouseUp(e));

    // Touch controls (Mobile)
    window.addEventListener('touchstart', (e) => this.handleTouchStart(e));
    window.addEventListener('touchmove', (e) => this.handleTouchMove(e));
    window.addEventListener('touchend', (e) => this.handleTouchEnd(e));
  }

  handleKeyDown(event) {
    this.keys[event.key.toLowerCase()] = true;
    this.updateMovement();

    if (event.key === '1') this.input.ability1 = true;
    if (event.key === '2') this.input.ability2 = true;
    if (event.key === '3') this.input.ability3 = true;
    if (event.key === '4') this.input.ultimate = true;
    if (event.key === ' ') this.input.dash = true;
    if (event.key === 'Escape') this.input.pause = true;
  }

  handleKeyUp(event) {
    this.keys[event.key.toLowerCase()] = false;
    this.updateMovement();

    if (event.key === '1') this.input.ability1 = false;
    if (event.key === '2') this.input.ability2 = false;
    if (event.key === '3') this.input.ability3 = false;
    if (event.key === '4') this.input.ultimate = false;
    if (event.key === ' ') this.input.dash = false;
    if (event.key === 'Escape') this.input.pause = false;
  }

  updateMovement() {
    this.input.moveX = 0;
    this.input.moveY = 0;

    if (this.keys['w'] || this.keys['arrowup']) this.input.moveY = -1;
    if (this.keys['s'] || this.keys['arrowdown']) this.input.moveY = 1;
    if (this.keys['a'] || this.keys['arrowleft']) this.input.moveX = -1;
    if (this.keys['d'] || this.keys['arrowright']) this.input.moveX = 1;
  }

  handleMouseMove(event) {
    this.input.mouseX = event.clientX;
    this.input.mouseY = event.clientY;
  }

  handleMouseDown(event) {
    this.mouseDown = true;
    this.input.ability1 = true;
  }

  handleMouseUp(event) {
    this.mouseDown = false;
    this.input.ability1 = false;
  }

  handleTouchStart(event) {
    Array.from(event.touches).forEach((touch) => {
      this.touches[touch.identifier] = {
        x: touch.clientX,
        y: touch.clientY,
        startX: touch.clientX,
        startY: touch.clientY
      };
    });

    if (event.touches.length === 2) {
      this.input.ability2 = true;
    }
  }

  handleTouchMove(event) {
    Array.from(event.touches).forEach((touch) => {
      if (this.touches[touch.identifier]) {
        this.touches[touch.identifier].x = touch.clientX;
        this.touches[touch.identifier].y = touch.clientY;
      }
    });

    const touch = event.touches[0];
    if (this.touches[touch.identifier]) {
      const dx = touch.clientX - this.touches[touch.identifier].startX;
      const dy = touch.clientY - this.touches[touch.identifier].startY;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance > 20) {
        this.input.moveX = dx / Math.abs(distance);
        this.input.moveY = dy / Math.abs(distance);
      }
    }
  }

  handleTouchEnd(event) {
    Array.from(event.changedTouches).forEach((touch) => {
      delete this.touches[touch.identifier];
    });

    if (event.touches.length < 2) {
      this.input.ability2 = false;
    }
  }

  getInput() {
    return { ...this.input };
  }

  reset() {
    this.input = {
      moveX: 0,
      moveY: 0,
      mouseX: 0,
      mouseY: 0,
      ability1: false,
      ability2: false,
      ability3: false,
      ultimate: false,
      dash: false,
      pause: false
    };
  }
}

module.exports = InputHandler;