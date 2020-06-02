import Popup from 'facade/popup';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new Popup({
  position: 'TR',
  url: 'https://raw.githubusercontent.com/irevios/sig/master/ejemplo.html',
});

// map.removeControls('panzoom');
window.map = map;

map.addPlugin(mp);
