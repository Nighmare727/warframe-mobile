/**
 * Tutorial System
 * - Interactive tutorials for new players
 * - Skill progression tracking
 * - Hints and tips system
 */

class TutorialSystem {
  constructor() {
    this.tutorials = {};
    this.completedTutorials = [];
    this.currentTutorial = null;
    this.hints = [];
    this.skipable = true;
    
    this.initializeTutorials();
  }

  initializeTutorials() {
    this.tutorials = {
      movement: {
        id: 'movement',
        title: 'Movement',
        description: 'Use WASD or arrow keys to move. Try moving around the arena.',
        objective: 'Move 100 pixels',
        completed: false,
        rewards: { credits: 100, xp: 50 }
      },
      combat: {
        id: 'combat',
        title: 'Basic Combat',
        description: 'Click to fire your primary ability. Destroy 3 enemies.',
        objective: 'Defeat 3 enemies',
        completed: false,
        rewards: { credits: 200, xp: 100 }
      },
      abilities: {
        id: 'abilities',
        title: 'Abilities',
        description: 'Press 1-4 to use different abilities. Each ability uses energy.',
        objective: 'Use 5 different abilities',
        completed: false,
        rewards: { credits: 300, xp: 150 }
      },
      elements: {
        id: 'elements',
        title: 'Element Synergies',
        description: 'Combine different elements for stronger effects. Mix Fire and Ice for Thermal!',
        objective: 'Trigger 1 element synergy',
        completed: false,
        rewards: { credits: 400, xp: 200 }
      },
      progression: {
        id: 'progression',
        title: 'Progression System',
        description: 'Defeat enemies to gain experience and level up. Unlock new abilities!',
        objective: 'Reach level 5',
        completed: false,
        rewards: { credits: 500, xp: 250 }
      }
    };
  }

  startTutorial(tutorialId) {
    const tutorial = this.tutorials[tutorialId];
    if (tutorial && !tutorial.completed) {
      this.currentTutorial = tutorial;
      return tutorial;
    }
    return null;
  }

  completeTutorial(tutorialId) {
    const tutorial = this.tutorials[tutorialId];
    if (tutorial) {
      tutorial.completed = true;
      this.completedTutorials.push(tutorialId);
      this.currentTutorial = null;
      return tutorial.rewards;
    }
    return null;
  }

  skipTutorial() {
    if (this.skipable && this.currentTutorial) {
      this.currentTutorial = null;
      return true;
    }
    return false;
  }

  addHint(hint) {
    if (!this.hints.includes(hint)) {
      this.hints.push(hint);
    }
  }

  getHint() {
    if (this.hints.length > 0) {
      return this.hints[Math.floor(Math.random() * this.hints.length)];
    }
    return null;
  }

  getUncompletedTutorials() {
    return Object.values(this.tutorials).filter(t => !t.completed);
  }

  getProgress() {
    const total = Object.keys(this.tutorials).length;
    const completed = this.completedTutorials.length;
    return { completed, total, percentage: (completed / total * 100).toFixed(1) };
  }
}

module.exports = TutorialSystem;