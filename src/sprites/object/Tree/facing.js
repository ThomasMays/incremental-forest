import { showHint, hideHint } from '../../../ui';

import ProgressBar from './ProgressBar';

export function facing() {
  if (this.bar) {
    this.bar.show();
  } else {
    this.bar = new ProgressBar(this);
    this.bar.update();
  }
}

export function notFacing() {
  if (!this.bar) return;

  this.bar.hide();
}
