import devtools from './devtools';

export default {
  gameWidth: 500,
  gameHeight: 400,
  mapWidth: devtools.enabled && devtools.testMap ? devtools.testMapSize[0] : 30,
  mapHeight: devtools.enabled && devtools.testMap ? devtools.testMapSize[1] : 30,
  tileWidth: 32,
  tileHeight: 32,
};
