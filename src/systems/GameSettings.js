/**
 * Settings and Game Configuration
 */

class GameSettings {
  constructor() {
    this.graphics = {
      particleQuality: 'high',
      shadowQuality: 'medium',
      antialiasing: true,
      postProcessing: true
    };
    
    this.gameplay = {
      difficulty: 'normal',
      autoAim: false,
      showDamageNumbers: true,
      screenShake: true,
      colorblindMode: false
    };
    
    this.controls = {
      invertY: false,
      mouseSensitivity: 1.0,
      keyboardSensitivity: 1.0,
      touchSensitivity: 1.0,
      vibration: true
    };
    
    this.audio = {
      masterVolume: 1.0,
      sfxVolume: 0.8,
      musicVolume: 0.6,
      voiceVolume: 0.7
    };
    
    this.loadSettings();
  }

  saveSettings() {
    const settings = {
      graphics: this.graphics,
      gameplay: this.gameplay,
      controls: this.controls,
      audio: this.audio
    };
    localStorage.setItem('game-settings', JSON.stringify(settings));
  }

  loadSettings() {
    const saved = localStorage.getItem('game-settings');
    if (saved) {
      try {
        const settings = JSON.parse(saved);
        this.graphics = { ...this.graphics, ...settings.graphics };
        this.gameplay = { ...this.gameplay, ...settings.gameplay };
        this.controls = { ...this.controls, ...settings.controls };
        this.audio = { ...this.audio, ...settings.audio };
      } catch (e) {
        console.error('Failed to load settings:', e);
      }
    }
  }

  resetToDefaults() {
    localStorage.removeItem('game-settings');
    this.__proto__.constructor.call(this);
  }

  updateGraphics(key, value) {
    if (key in this.graphics) {
      this.graphics[key] = value;
      this.saveSettings();
    }
  }

  updateGameplay(key, value) {
    if (key in this.gameplay) {
      this.gameplay[key] = value;
      this.saveSettings();
    }
  }

  updateControls(key, value) {
    if (key in this.controls) {
      this.controls[key] = value;
      this.saveSettings();
    }
  }

  updateAudio(key, value) {
    if (key in this.audio) {
      this.audio[key] = value;
      this.saveSettings();
    }
  }
}

module.exports = GameSettings;