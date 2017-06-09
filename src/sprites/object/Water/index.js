import CommonObject from '../Common';

import frames from '../../../sprite-frames';

import { facing, notFacing } from './facing';
import interact from './interact';

export default class extends CommonObject {
  constructor({ game, x, y }) {
    super(game, x, y, 'tiles', frames.MAIN.WATER, null, 'water');

    this.facing = facing.bind(this);
    this.notFacing = notFacing.bind(this);

    this.interact = interact.bind(this);
  }
}
