export default function(frames) {
  checkControls.call(this, frames);
}

function checkControls(frames) {
  const keys = this.game.state.states.Game.keys;

  const upPressed = keys.UP.justPressed() || keys.W.justPressed();
  const leftPressed = keys.LEFT.justPressed() || keys.A.justPressed();
  const downPressed = keys.DOWN.justPressed() || keys.S.justPressed();
  const rightPressed = keys.RIGHT.justPressed() || keys.D.justPressed();

  const { tileHeight, tileWidth } = this.game.state.states.Game.map;

  if (upPressed && !this.moving) {
    this.frame = frames.STAND_UP;
    tryMove.call(this, {
      x: this.x,
      y: this.y - tileHeight,
    });
  }
  if (leftPressed && !this.moving) {
    this.frame = frames.STAND_LEFT;
    tryMove.call(this, {
      x: this.x - tileWidth,
      y: this.y,
    });
  }
  if (downPressed && !this.moving) {
    this.frame = frames.STAND_DOWN;
    tryMove.call(this, {
      x: this.x,
      y: this.y + tileHeight,
    });
  }
  if (rightPressed && !this.moving) {
    this.frame = frames.STAND_RIGHT;
    tryMove.call(this, {
      x: this.x + tileWidth,
      y: this.y,
    });
  }
}

function tryMove(nextCoord) {
  const collision = checkCollide.call(this, nextCoord);

  if (!collision) {
    tweenMove.call(this, nextCoord);
  }
}

function checkCollide(nextCoord) {
  const game = this.game.state.states.Game;

  const nextTile = game.map.getTileWorldXY(nextCoord.x, nextCoord.y, 32, 32, 'foreground');

  // if nextTile is null, there is no foreground tile at nextTile
  if (nextTile === null) return true;

  let collision = false;

  this.game.world.forEach(function(object) {
    if (collision === true || !object.key || object.key === 'guy') return;

    const {
      top,
      left,
      bottom,
      right,
    } = object;

    const withinX = nextCoord.x <= right && nextCoord.x >= left;
    const withinY = nextCoord.y <= bottom && nextCoord.y >= top;

    if (withinX && withinY) {
      collision = true;
    }
  });
  return collision;
}

function tweenMove(nextCoord) {
  const move = this.game.add.tween(this);

  this.moving = true;

  move.to(nextCoord, 50, null, true);

  move.onComplete.add(function() {
    this.moving = false;
  }, this);
}
