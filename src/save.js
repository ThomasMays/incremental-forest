// version is only bumped when an error is encountered due to an old version; not necessarily on every format change
const version = 2;
const loadedVersion = localStorage.getItem('save-version') || 1;
if (version != loadedVersion) {
  localStorage.clear();
  localStorage.setItem('save-version', version);
}

import LZString from 'lz-string';

let data = localStorage.getItem('game');
if (data) {
  const decompressedData = LZString.decompress(data);

  if (decompressedData) {
    data = JSON.parse(decompressedData);
  } else {
    // data was probably not compressed
    data = JSON.parse(data);
  }
} else {
  data = {};
}

export function backup() {
  return JSON.stringify(data);
}
export function restore(restoreData) {
  data = JSON.parse(restoreData);
  forceSave();

  // there's no way load data mid-game, so reload the page
  autoSave = false;
  window.location.reload();
}

// debugging
window.saveData = data;

export let autoSave = true;
if (typeof load('autosave') === 'boolean') autoSave = load('autosave');

export function autoSaveToggle() {
  autoSave = !autoSave;

  save('autosave', autoSave);
}

const saveCallbacks = [];
export function saveMe(callback) {
  saveCallbacks.push(callback);
}

let changes = 0;
function changed() {
  changes++;

  if (autoSave && changes >= 50) {
    forceSave();
    changes = 0;
  }
}

function callSaves() {
  for (let i = 0; i < saveCallbacks.length; i++) {
    // go through saveCallbacks and let them save their stuff
    saveCallbacks[i]();
  }
}

export function forceSave() {
  localStorage.setItem('game', LZString.compress(JSON.stringify(data)));

  console.log('game saved');
}

export function save(name, value) {
  data[name] = value;

  changed();
}
export function load(name) {
  return data[name];
}
export function clear() {
  data = {};
  localStorage.removeItem('game');

  // disable autoSave until page is refreshed
  autoSave = false;
}

window.addEventListener('error', function() {
  // try to catch errors and prevent saving (in case the error could cause a corrupt save)

  autoSave = false;
});

window.addEventListener('beforeunload', function() {
  callSaves();

  if (!autoSave || changes === 0) return;

  forceSave();
});
