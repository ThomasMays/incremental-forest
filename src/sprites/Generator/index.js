import Phaser from 'phaser';

import frames from '../../sprite-frames';
import Inventory from '../Common/inventory';

import update from './update';
import { facing, notFacing } from './facing';
import interact from './interact';

export default class extends Phaser.Sprite {
  constructor({ game, x, y }) {

    this.anchor.setTo(0.5, 0.5);
    super(game, x, y, 'tiles', frames.MAIN.GENERATOR_OFF);

    this.inventory = new Inventory(this.game);
    this.timer = null;
    this.powered = false;

    this.facing = facing.bind(this);
    this.notFacing = notFacing.bind(this);

    this.interact = interact.bind(this);

    this.update = update.bind(this);
  }
}
