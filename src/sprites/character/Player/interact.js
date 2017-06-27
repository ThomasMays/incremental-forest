import interfaceWithObjects from '../Common/interface-objects';
import { pixelToTile, tileToPixel } from '../../../tiles';
import { fastMap } from '../../../world';
import { tileOutOfBounds } from '../../../utils';
import objectPool from '../../../object-pool';

export default function tryInteract() {
  const { cursor, inventory } = this;

  if (tileOutOfBounds(cursor.tile)) return;

  const cursorObjects = cursor.objects;
  const cursorObjectTypes = fastMap[cursor.tile.y][cursor.tile.x];
  const selectedItem = inventory.selected;

  if (selectedItem === 'wood-axe' && cursorObjectTypes.includes('tree')) {
    interfaceWithObjects(cursorObjects, 'interact', this);
  } else {
    const lastTile = this.lastInteractedTile;
    if (lastTile !== null && lastTile.x === cursor.tile.x && lastTile.y === cursor.tile.y) return;

    if (cursorObjects.length > 0) {
      interfaceWithObjects(cursorObjects, 'interact', this);

      this.lastInteractedTile = Object.assign({}, cursor.tile);
    } else {
      placeItem.call(this);

      this.lastInteractedTile = Object.assign({}, cursor.tile);
    }
  }
}

function placeItem() {
  const { cursor, inventory } = this;

  const selectedItem = inventory.items[inventory.selected];

  if (!selectedItem || !selectedItem.hasOwnProperty('place')) return;

  if (selectedItem.value > 0) {
    const pixelCoord = tileToPixel(cursor.tile);

    if (tileOutOfBounds(pixelToTile(pixelCoord))) return;

    const Item = selectedItem.place;
    const placedItem = objectPool.new(inventory.selected, Item, {
      game: this.game,
      x: pixelCoord.x,
      y: pixelCoord.y,
      placed: true,
    });

    selectedItem.value--;

    if (placedItem.hasOwnProperty('place')) placedItem.place(this);
  }
}
