onmessage = function(event) {
  // expect posted message data to be in a certain format
  if (!Array.isArray(event.data)) throw new Error('pass an array to worker');

  postMessage(findPath(event.data));
}

function findPath(data) {
  // fastMap, fastObjects expected
  let fastMap =           data[0],
      fastObjects =       data[1],
      collidableObjects = data[2];

  let mapWidth =          data[3],
      mapHeight =         data[4];

  let queue =             [],
      checkedTiles =      [],
      start =             data[5],
      target =            data[6];

  if (typeof target === 'string') {
    target = [target];
  }

  if (Array.isArray(target)) {
    let includes = false;
    for (let i = 0; i < target.length; i++) {
      if (fastObjects.includes(target[i])) {
        includes = true;
        break;
      }
    }

    if (!includes) return;
  }

  const startLocation = {
    x: start.x,
    y: start.y,
    path: [],
    walkable: true,
  };

  queue.push(startLocation);

  checkedTiles.push(startLocation.x + ',' + startLocation.y);

  let debug = 0;
  while (queue.length && debug <= 1000) { // infinite loop protection
    let item = queue[0];

    const up = processDirection(item, 'UP');
    if (up) return up;

    const left = processDirection(item, 'LEFT');
    if (left) return left;

    const down = processDirection(item, 'DOWN');
    if (down) return down;

    const right = processDirection(item, 'RIGHT');
    if (right) return right;

    // remove first item in queue
    queue.shift();

    debug++;
  }

  return [];

  function processDirection(location, direction) {
    const result = checkDirection(location, direction);

    const coordName = result.x + ',' + result.y;

    // don't want to check the same tile twice
    if (checkedTiles.includes(coordName)) return;

    // add the resulting tile to checkedTiles
    checkedTiles.push(coordName);

    // result is out of bounds
    if (result.outOfBounds) return;

    let isTarget = false;
    if (Array.isArray(target)) {
      isTarget = checkTargetType(coordName, target);
    } else {
      isTarget = checkTargetLocation(result);
    }

    if (isTarget) {
      // result is the target
      return result.path;
    } else if (result.walkable) {
      // result isn't target but is still walkable; add to queue to check
      queue.push(result);
    }
  }

  function checkTargetType(coordName, targetTypes) {
    // TODO prefer (but not require) tiles with no objects at all on them

    const mapTile = fastMap[coordName];
    for (let i = 0; i < targetTypes.length; i++) {
      if (mapTile.includes(targetTypes[i])) {
        return true;
      }
    }
  }

  function checkTargetLocation(location) {
    if (location.x === target.x && location.y === target.y) return true;

    return false;
  }

  function checkDirection(location, direction) {
    location = {
      x: location.x,
      y: location.y,
      path: JSON.parse(JSON.stringify(location.path)),
      walkable: location.walkable,
    };

    location.path.push(direction);

    location.walkable = true;

    // update location coords based on direction
    nextCoord(location, direction, 1);

    if (location.x < 0 || location.x >= mapWidth || location.y < 0 || location.y >= mapHeight) {
      location.outOfBounds = true;
      return location;
    }

    const mapTile = fastMap[location.x + ',' + location.y];

    for (let i = 0; i < collidableObjects.length; i++) {
      if (mapTile.includes(collidableObjects[i])) {
        location.walkable = false;
        break;
      }
    }

    return location;
  }
}

// utility function dependencies
const clone = (obj) => JSON.parse(JSON.stringify(obj));
function nextCoord(coord, direction, size) {
  const { x, y } = coord;

  switch (direction) {
    case 'UP': {
      coord.y = y - size;
      break;
    }
    case 'LEFT': {
      coord.x = x - size;
      break;
    }
    case 'DOWN': {
      coord.y = y + size;
      break;
    }
    case 'RIGHT': {
      coord.x = x + size;
      break;
    }
  }
}
