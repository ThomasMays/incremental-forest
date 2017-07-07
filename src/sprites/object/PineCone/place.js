import getChance from '../../../game-data/chances';
import { tryChance } from '../../../utils';
import { fastMap } from '../../../world';
import objectPool from '../../../object-pool';

import Phaser from 'phaser';
import Tree from '../Tree';

export default function place() {
  this.placed = true;

  this.changeType('planted-pine-cone');

  this.game.time.events.add(Phaser.Timer.SECOND * 5, function() {
    if (this.destroyed) return;

    const playerTile = this.game.state.states.Game.player.tile;
    const thisTile = this.tile;

    if (
      (playerTile.x !== thisTile.x || playerTile.y !== thisTile.y) &&
      fastMap[thisTile.y][thisTile.x].length === 1 && // this pine cone should be only thing on tile
      tryChance(getChance('tree-grow'))
    ) {
      objectPool.new('tree', Tree, {
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
