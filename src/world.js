import config from './config';
import { indexOfObject } from './utils';

const map = {};
const objects = {};

(function generateMap() {
  for (let i = 0; i < config.mapHeight; i++) {
    for (let k = 0; k < config.mapWidth; k++) {
      map[k + ',' + i] = [];
    }
  }
})();

export function add() {
  objects[this.id] = this;

  map[this.tile.x + ',' + this.tile.y].push(this.id);
}

// move

export function movedTo(oldTileCoord) {
  const newX = this.tile.x;
  const newY = this.tile.y;
  const mapNewTile = map[newX + ',' + newY];

  if (oldTileCoord !== null) {
    // remove object ref from previous tile

    const oldX = oldTileCoord.x;
    const oldY = oldTileCoord.y;
    const mapOldTile = map[oldX + ',' + oldY];

    const index = mapOldTile.indexOf(this.id);

    mapOldTile.splice(index, 1);
  }

  mapNewTile.push(objects[this.id]);
}

export function remove() {
  const mapTile = map[this.tile.x + ',' + this.tile.y];
  const index = mapTile.indexOf(this.id);

  mapTile.splice(index, 1);

  delete objects[this.id];
}

export function objectsAtTile(tileCoord) {
  const mapTile = map[tileCoord.x + ',' + tileCoord.y];
  const tileObjects = [];

  for (let i = 0, len = mapTile.length; i < len; i++) {
    tileObjects.push(objects[mapTile[i]]);
  }

  return tileObjects;
}
