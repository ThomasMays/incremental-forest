import config from '../../../config';
import { tryChance } from '../../../utils';

import Phaser from 'phaser';
import Tree from '../Tree';

const growChance = config.test ? 60 : 10;

export default function place() {
  this.placed = true;

  this.game.time.events.add(Phaser.Timer.SECOND * 5, function() {
    if (this.destroyed) return;

    const playerTile = this.game.state.states.Game.player.tile;
    const thisTile = this.tile;

    if (
      (playerTile.x !== thisTile.x || playerTile.y !== thisTile.y) &&
      tryChance(growChance)
    ) {
      new Tree({
        game: this.game,
        x: this.x,
        y: this.y,
      });

      this.destroy();
    } else {
      place.call(this);
    }
  }, this);
}
