import Locator from 'facade/locator';

M.language.setLang('es');

M.proxy(false);

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  maxZoom: 20,
  minZoom: 4,
  center: [-467062.8225, 4783459.6216],
});

window.map = map;

const mp = new Locator({
  useProxy: true,
  isDraggable: true,
  position: 'TC',
  // position: 'TC',
  collapsible: true,
  collapsed: true,
  order: 1,
  tooltip: 'Plugin Localizador',
  zoom: 5,
  pointStyle: 'pinMorado',

  searchOptions: {
    addendum: 'iderioja',
    size: 15,
    layers: 'address,street,venue',
    sources: 'calrj',
    // urlAutocomplete: '',
    // urlReverse: '',
  }
});

map.addPlugin(mp);

window.map = map;
window.mp = mp;
