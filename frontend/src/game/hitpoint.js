import Component from './component';

class Hitpoint extends Component {
  constructor(health, owned = false) {
    super();
    this.onDamageFunctions = [];
    this.onDeathFunctions = [];
    this.health = health;
    this.owned = owned;
  }

  onDamage(func) {
    this.onDamageFunctions.push(func);
  }

  onDeath(func) {
    this.onDeathFunctions.push(func);
  }

  damage(damage) {
    this.dispatch({ type: 'DAMAGE', damage });
  }

  death() {
    this.dispatch({ type: 'DEATH'});
  }

  handleAction(action) {
    switch (action.type) {
      case 'DAMAGE':
        this.health = Math.max(this.health - action.damage, 0);
        this.onDamageFunctions.forEach( func => func() );
        if (this.owned && this.health === 0) this.death();
        break;
      case 'DEATH':
        this.onDeathFunctions.forEach( func => func() );
        this.gameObject.destroy();
        break;
      default:
    }
  }
}

export default Hitpoint;
