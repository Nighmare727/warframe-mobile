/**
 * Progression System
 * - Experience and leveling
 * - Ability upgrades
 * - Equipment and mods
 * - Persistent character progression
 */

class ProgressionSystem {
  constructor() {
    this.playerLevel = 1;
    this.experience = 0;
    this.experienceToNextLevel = 100;
    
    this.credits = 0;
    this.playtime = 0;
    
    this.unlockedAbilities = ['primary', 'secondary', 'mobility'];
    
    this.mods = [];
    this.maxModSlots = 6;
    
    this.equipment = {
      armor: 'basic',
      helmet: 'basic',
      boots: 'basic'
    };
    
    this.achievements = [];
    this.completedMissions = [];
  }

  gainExperience(amount) {
    this.experience += amount;
    
    while (this.experience >= this.experienceToNextLevel) {
      this.levelUp();
    }
  }

  levelUp() {
    this.playerLevel++;
    this.experience -= this.experienceToNextLevel;
    this.experienceToNextLevel = Math.floor(this.experienceToNextLevel * 1.1);
    
    if (this.playerLevel === 5) {
      this.unlockedAbilities.push('ultimate');
    }
    if (this.playerLevel === 10) {
      this.unlockedAbilities.push('ability4');
    }
  }

  addMod(mod) {
    if (this.mods.length < this.maxModSlots) {
      this.mods.push(mod);
      return true;
    }
    return false;
  }

  removeMod(modIndex) {
    if (modIndex >= 0 && modIndex < this.mods.length) {
      this.mods.splice(modIndex, 1);
      return true;
    }
    return false;
  }

  equipArmor(armorType) {
    this.equipment.armor = armorType;
  }

  equipHelmet(helmetType) {
    this.equipment.helmet = helmetType;
  }

  equipBoots(bootsType) {
    this.equipment.boots = bootsType;
  }

  unlockAchievement(achievementId) {
    if (!this.achievements.includes(achievementId)) {
      this.achievements.push(achievementId);
      return true;
    }
    return false;
  }

  completeMission(missionId) {
    if (!this.completedMissions.includes(missionId)) {
      this.completedMissions.push(missionId);
      return true;
    }
    return false;
  }

  getPlayerStats() {
    return {
      level: this.playerLevel,
      experience: this.experience,
      experienceToNextLevel: this.experienceToNextLevel,
      progressPercent: (this.experience / this.experienceToNextLevel * 100).toFixed(1),
      credits: this.credits,
      playtime: this.playtime,
      unlockedAbilities: this.unlockedAbilities,
      equippedMods: this.mods.length,
      achievements: this.achievements.length
    };
  }

  saveToLocalStorage() {
    const data = {
      level: this.playerLevel,
      experience: this.experience,
      credits: this.credits,
      playtime: this.playtime,
      mods: this.mods,
      equipment: this.equipment,
      unlockedAbilities: this.unlockedAbilities,
      achievements: this.achievements,
      completedMissions: this.completedMissions
    };
    localStorage.setItem('warframe-progression', JSON.stringify(data));
  }

  loadFromLocalStorage() {
    const data = localStorage.getItem('warframe-progression');
    if (data) {
      const parsed = JSON.parse(data);
      this.playerLevel = parsed.level || 1;
      this.experience = parsed.experience || 0;
      this.credits = parsed.credits || 0;
      this.playtime = parsed.playtime || 0;
      this.mods = parsed.mods || [];
      this.equipment = parsed.equipment || this.equipment;
      this.unlockedAbilities = parsed.unlockedAbilities || [];
      this.achievements = parsed.achievements || [];
      this.completedMissions = parsed.completedMissions || [];
    }
  }
}

class Mod {
  constructor(name, type, bonus) {
    this.name = name;
    this.type = type;
    this.bonus = bonus;
    this.rarity = 'common';
    this.level = 1;
    this.maxLevel = 10;
  }

  upgrade() {
    if (this.level < this.maxLevel) {
      this.level++;
      this.bonus *= 1.1;
      return true;
    }
    return false;
  }

  getStats() {
    return {
      name: this.name,
      type: this.type,
      bonus: this.bonus.toFixed(2),
      level: this.level,
      rarity: this.rarity
    };
  }
}

module.exports = { ProgressionSystem, Mod };