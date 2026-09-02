/**
 * Inventory Screen
 * - Display player inventory
 * - Equipment management
 * - Ability loadout customization
 */

class InventoryScreen {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;
    
    this.activeTab = 'weapons'; // weapons, mods, abilities, equipment
    this.selectedItem = null;
  }

  render(playerData) {
    const ctx = this.ctx;
    
    // Background
    ctx.fillStyle = '#0a0e27';
    ctx.fillRect(0, 0, this.width, this.height);
    
    // Header
    ctx.fillStyle = '#ffffff';
    ctx.font = 'bold 28px Arial';
    ctx.fillText('Inventory', 20, 40);
    
    // Tabs
    this.drawTabs(ctx);
    
    // Content
    this.drawTabContent(ctx, playerData);
    
    // Back button
    ctx.fillStyle = '#4488ff';
    ctx.fillRect(this.width - 120, this.height - 50, 100, 40);
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('Back', this.width - 100, this.height - 25);
  }

  drawTabs(ctx) {
    const tabs = ['weapons', 'mods', 'abilities', 'equipment'];
    const tabWidth = 100;
    const tabX = 20;
    const tabY = 70;
    
    tabs.forEach((tab, index) => {
      const x = tabX + index * (tabWidth + 10);
      
      ctx.fillStyle = this.activeTab === tab ? '#4488ff' : '#333333';
      ctx.fillRect(x, tabY, tabWidth, 40);
      
      ctx.fillStyle = '#ffffff';
      ctx.font = '12px Arial';
      ctx.fillText(tab.charAt(0).toUpperCase() + tab.slice(1), x + 10, tabY + 25);
    });
  }

  drawTabContent(ctx, playerData) {
    const contentY = 130;
    const contentHeight = this.height - contentY - 70;
    
    switch (this.activeTab) {
      case 'weapons':
        this.drawWeapons(ctx, playerData.weapons, contentY);
        break;
      case 'mods':
        this.drawMods(ctx, playerData.mods, contentY);
        break;
      case 'abilities':
        this.drawAbilities(ctx, playerData.abilities, contentY);
        break;
      case 'equipment':
        this.drawEquipment(ctx, playerData.equipment, contentY);
        break;
    }
  }

  drawWeapons(ctx, weapons, y) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('Weapons:', 20, y);
    
    weapons.forEach((weapon, index) => {
      const itemY = y + 30 + index * 40;
      ctx.fillStyle = '#333333';
      ctx.fillRect(20, itemY, this.width - 40, 35);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${weapon.name} (Lvl ${weapon.level})`, 30, itemY + 20);
      ctx.font = '12px Arial';
      ctx.fillText(`Damage: ${weapon.damage.toFixed(1)}`, 220, itemY + 20);
    });
  }

  drawMods(ctx, mods, y) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText(`Mods (${mods.length}/6):`, 20, y);
    
    mods.forEach((mod, index) => {
      const itemY = y + 30 + index * 40;
      ctx.fillStyle = this.getRarityColor(mod.rarity);
      ctx.fillRect(20, itemY, this.width - 40, 35);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${mod.name} (+${mod.bonus.toFixed(1)}%)`, 30, itemY + 20);
    });
  }

  drawAbilities(ctx, abilities, y) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('Abilities:', 20, y);
    
    Object.entries(abilities).forEach(([slot, ability], index) => {
      const itemY = y + 30 + index * 40;
      ctx.fillStyle = '#333333';
      ctx.fillRect(20, itemY, this.width - 40, 35);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${slot.toUpperCase()}: ${ability.name}`, 30, itemY + 20);
      ctx.font = '12px Arial';
      ctx.fillText(`Element: ${ability.element}`, 220, itemY + 20);
    });
  }

  drawEquipment(ctx, equipment, y) {
    ctx.fillStyle = '#ffffff';
    ctx.font = '14px Arial';
    ctx.fillText('Equipment:', 20, y);
    
    Object.entries(equipment).forEach(([slot, item], index) => {
      const itemY = y + 30 + index * 40;
      ctx.fillStyle = '#333333';
      ctx.fillRect(20, itemY, this.width - 40, 35);
      
      ctx.fillStyle = '#ffffff';
      ctx.fillText(`${slot.toUpperCase()}: ${item}`, 30, itemY + 20);
    });
  }

  getRarityColor(rarity) {
    const colors = {
      common: '#cccccc',
      uncommon: '#00dd00',
      rare: '#0088ff',
      legendary: '#ffaa00'
    };
    return colors[rarity] || '#ffffff';
  }
}

module.exports = InventoryScreen;