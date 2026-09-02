/**
 * Statistics and Analytics Tracking
 * - Player performance metrics
 * - Leaderboard data
 * - Achievement tracking
 */

class StatisticsTracker {
  constructor() {
    this.stats = {
      totalPlaytime: 0,
      sessionsPlayed: 0,
      totalScore: 0,
      highScore: 0,
      totalEnemiesKilled: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      totalHealed: 0,
      abilitiesCast: 0,
      combosTriggered: 0,
      maxCombo: 0,
      levelReached: 1
    };
    
    this.sessionStats = {};
    this.achievements = {};
    this.loadStats();
  }

  startSession() {
    this.sessionStats = {
      startTime: Date.now(),
      score: 0,
      enemiesKilled: 0,
      damageDealt: 0,
      damageTaken: 0,
      abilitiesCast: 0,
      maxCombo: 0
    };
  }

  endSession() {
    const duration = (Date.now() - this.sessionStats.startTime) / 1000 / 60;
    
    this.stats.totalPlaytime += duration;
    this.stats.sessionsPlayed++;
    this.stats.totalScore += this.sessionStats.score;
    this.stats.totalEnemiesKilled += this.sessionStats.enemiesKilled;
    this.stats.totalDamageDealt += this.sessionStats.damageDealt;
    this.stats.totalDamageTaken += this.sessionStats.damageTaken;
    this.stats.abilitiesCast += this.sessionStats.abilitiesCast;
    
    if (this.sessionStats.score > this.stats.highScore) {
      this.stats.highScore = this.sessionStats.score;
    }
    
    if (this.sessionStats.maxCombo > this.stats.maxCombo) {
      this.stats.maxCombo = this.sessionStats.maxCombo;
    }
    
    this.saveStats();
  }

  recordKill(damage) {
    this.sessionStats.enemiesKilled++;
    this.stats.totalEnemiesKilled++;
    this.sessionStats.damageDealt += damage;
    this.stats.totalDamageDealt += damage;
  }

  recordDamage(damage) {
    this.sessionStats.damageTaken += damage;
    this.stats.totalDamageTaken += damage;
  }

  recordAbilityCast() {
    this.sessionStats.abilitiesCast++;
    this.stats.abilitiesCast++;
  }

  recordCombo(comboCount) {
    this.sessionStats.maxCombo = Math.max(this.sessionStats.maxCombo, comboCount);
    this.stats.combosTriggered++;
  }

  updateSessionScore(score) {
    this.sessionStats.score = score;
  }

  unlockAchievement(achievementId) {
    if (!this.achievements[achievementId]) {
      this.achievements[achievementId] = {
        id: achievementId,
        unlockedAt: new Date().toISOString(),
        progress: 1
      };
      this.saveStats();
      return true;
    }
    return false;
  }

  getStats() {
    return { ...this.stats };
  }

  getSessionStats() {
    return { ...this.sessionStats };
  }

  saveStats() {
    const data = {
      stats: this.stats,
      achievements: this.achievements
    };
    localStorage.setItem('game-stats', JSON.stringify(data));
  }

  loadStats() {
    const saved = localStorage.getItem('game-stats');
    if (saved) {
      try {
        const data = JSON.parse(saved);
        this.stats = { ...this.stats, ...data.stats };
        this.achievements = data.achievements || {};
      } catch (e) {
        console.error('Failed to load stats:', e);
      }
    }
  }
}

module.exports = StatisticsTracker;