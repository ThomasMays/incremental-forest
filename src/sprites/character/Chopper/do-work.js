import { nextCoord, findObjByKey } from '../../../utils';
import { objectsAtTile } from '../../../world';

export default function doWork() {
  // ensure that we're facing a tree
  const nextTile = nextCoord(this.tile, this.faceDirection, 1);
  const objects = objectsAtTile(nextTile);
  const facingTree = findObjByKey(objects, 'objectType', 'tree');

  if (facingTree !== false) {
    facingTree.interact(this);

    this.player.inventory.addDebt(this.salary);
  }

  this.cancelWork();
}
