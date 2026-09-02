# Warframe Mobile Enhanced

A revolutionary mobile action game inspired by Warframe with **unique mechanics**, **advanced AI**, and **deep progression systems**.

## 🎮 Unique Features

### Advanced Combat System
- **Dual-Element Ability System**: Combine elements for unique effects
  - Fire + Ice = Thermal (1.5x damage)
  - Fire + Lightning = Inferno (1.8x damage)
  - Earth + Void = Collapse (2.0x damage)
  - And more synergies to discover!

- **Learning AI Enemies**: Enemies adapt to your playstyle
  - Patrol, Chase, Attack, and Flee states
  - Fear and confidence systems
  - Special abilities that scale with difficulty

- **Dynamic Wave System**: Progressive difficulty that adapts to your performance
- **Combo Multiplier**: Chain hits to increase score multipliers
- **Energy-Based Abilities**: Manage your resources strategically

### Unique Player Mechanics
- **Multiple Stances**: Offensive, Defensive, Mobility
  - Each stance modifies your speed and defense
- **Dual Weapons**: Switch between Rifle, Shotgun, Melee, and Bow
- **Advanced Movement**: Dash, slide, and evade mechanics
- **Elemental Damage System**: Each element has unique properties

### Progression & Customization
- **Level Up System**: Unlock new abilities and equipment
- **Mod System**: Customize your character with stat mods
- **Equipment**: Armor, Helmets, and Boots with unique effects
- **Achievement System**: Unlock and track achievements
- **Persistent Progression**: Your progress is saved locally

### Mobile-First Design
- **Touch Controls**: Optimized for mobile gameplay
- **Responsive UI**: Adapts to any screen size
- **Smooth Performance**: Optimized for mobile devices

## 🛠️ Tech Stack

- **React Native** with **Expo** for cross-platform mobile development
- **Canvas API** for fast 2D rendering
- **Custom Physics Engine** for accurate collisions
- **Babylon.js** support for future 3D elements

## 📋 Project Structure

```
warframe-mobile/
├── src/
│   ├── core/
│   │   ├── GameEngine.js      # Main game loop and logic
│   │   ├── Player.js          # Player character system
│   │   ├── Enemy.js           # AI enemy system
│   │   ├── Ability.js         # Ability and projectile system
│   │   ├── PhysicsEngine.js   # Physics and collision detection
│   │   └── InputHandler.js    # Input management (keyboard/touch)
│   ├── systems/
│   │   └── ProgressionSystem.js # Leveling and progression
│   ├── effects/
│   │   └── Particles.js       # Particle effects
│   └── App.js                  # Main React component
├── package.json
├── app.json
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Expo CLI: `npm install -g expo-cli`

### Installation

```bash
# Clone the repository
git clone https://github.com/Nighmare727/warframe-mobile.git
cd warframe-mobile

# Install dependencies
npm install

# Start the dev server
npm start

# For iOS
npm run ios

# For Android
npm run android

# For Web
npm run web
```

## 🎮 Controls

### Desktop (Keyboard & Mouse)
- **Movement**: WASD or Arrow Keys
- **Aim**: Mouse movement
- **Primary Ability**: Left Click or "1"
- **Secondary Ability**: "2"
- **Mobility Ability**: "3"
- **Ultimate**: "4"
- **Dash**: Spacebar
- **Pause**: ESC

### Mobile (Touch)
- **Movement**: Swipe in direction to move
- **Ability 1**: Tap to cast
- **Ability 2**: Two-finger tap
- **Dash**: Rapid double tap

## 🎯 Gameplay Tips

1. **Use Combos**: Chain hits to build your combo multiplier for bonus points
2. **Element Synergies**: Experiment with different element combinations
3. **Manage Energy**: Use your secondary ability to recharge energy efficiently
4. **Switch Stances**: Change your stance based on the situation
5. **Learn Enemy Patterns**: Enemies adapt to you - keep them guessing!

## 📈 Game Balance

- **Difficulty Scaling**: The game gets progressively harder as you survive longer
- **Wave System**: New waves spawn every few enemies killed
- **Adaptive AI**: Enemy AI learns from your behavior
- **Fair Challenge**: Designed to be challenging but not frustrating

## 🔮 Future Features

- [ ] Campaign mode with story missions
- [ ] Co-op multiplayer gameplay
- [ ] Raid dungeons with unique bosses
- [ ] Daily challenges and events
- [ ] Battle pass and cosmetics
- [ ] Leaderboard system
- [ ] Advanced graphics with particle effects
- [ ] Sound and music system
- [ ] More enemy types and bosses
- [ ] Clan/Guild system

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎨 Art & Design Philosophy

This game focuses on:
- **Fluid Combat**: Every action feels responsive and impactful
- **Visual Feedback**: Clear particle effects and animations
- **Player Empowerment**: Make the player feel powerful and skilled
- **Progressive Challenge**: Difficulty scales naturally with skill

## 📞 Support & Feedback

For bugs, suggestions, or feedback, please open an issue on GitHub.

---

**Made with ❤️ for mobile gamers who want an AAA-quality action experience on their phones.**

*Warframe Mobile Enhanced - Where Action Meets Strategy*