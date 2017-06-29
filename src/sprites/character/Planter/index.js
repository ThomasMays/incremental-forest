import Worker from '../Worker';

import doWork from './do-work';

export default class extends Worker {
  constructor({ game, x, y }) {
    super(game, x, y, 'worker-planter', null, 'planter');

    this.targetObjects = null;

    this.doWork = doWork.bind(this);
  }
}
