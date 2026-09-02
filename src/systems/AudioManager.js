/**
 * Audio Manager
 * Handles all game sounds and music
 */

class AudioManager {
  constructor() {
    this.sounds = {};
    this.music = {};
    this.masterVolume = 0.7;
    this.sfxVolume = 0.8;
    this.musicVolume = 0.5;
    this.muted = false;
    
    this.currentMusic = null;
  }

  loadSound(name, url) {
    const audio = new Audio(url);
    audio.volume = this.sfxVolume * this.masterVolume;
    this.sounds[name] = audio;
  }

  loadMusic(name, url) {
    const audio = new Audio(url);
    audio.volume = this.musicVolume * this.masterVolume;
    audio.loop = true;
    this.music[name] = audio;
  }

  playSound(name) {
    if (this.muted || !this.sounds[name]) return;
    
    const clone = this.sounds[name].cloneNode();
    clone.play().catch(e => console.log('Audio play failed:', e));
  }

  playMusic(name) {
    if (this.muted || !this.music[name]) return;
    
    if (this.currentMusic) {
      this.currentMusic.pause();
    }
    
    this.currentMusic = this.music[name];
    this.currentMusic.play().catch(e => console.log('Music play failed:', e));
  }

  stopMusic() {
    if (this.currentMusic) {
      this.currentMusic.pause();
      this.currentMusic.currentTime = 0;
      this.currentMusic = null;
    }
  }

  setVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    this.updateVolumes();
  }

  setMuted(muted) {
    this.muted = muted;
  }

  updateVolumes() {
    Object.values(this.sounds).forEach(sound => {
      sound.volume = this.sfxVolume * this.masterVolume;
    });
    
    Object.values(this.music).forEach(music => {
      music.volume = this.musicVolume * this.masterVolume;
    });
  }

  playAbilityCast() {
    this.playSound('ability_cast');
  }

  playEnemyHit() {
    this.playSound('hit');
  }

  playEnemyDeath() {
    this.playSound('enemy_death');
  }

  playCombo() {
    this.playSound('combo');
  }

  playLevelUp() {
    this.playSound('levelup');
  }
}

module.exports = AudioManager;