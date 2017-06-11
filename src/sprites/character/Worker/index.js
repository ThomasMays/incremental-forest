import CommonCharacter from '../Common';

import frames from '../../../sprite-frames';

import update from './update';

export default class extends CommonCharacter {
  constructor({ game, x, y }) {
    super(game, x, y, 'worker', frames.CHARACTER.STAND_DOWN, null, 'worker');

    this.faceDirection = 'DOWN';

    // make a static inventory
    this.inventory = {
      items: {
        'wood-axe': { value: true, selected: true },
      },
    };

    this.working = false;
    this.path = [];
    this.onPath = false;

    this.sendToBack();

    this.update = update.bind(this);
  }
}
