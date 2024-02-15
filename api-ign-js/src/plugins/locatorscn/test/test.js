import Locatorscn from 'facade/locatorscn';

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

const mp = new Locatorscn({
  order: 1,
  position: 'TC',
  collapsed: true,
  collapsible: true,
  tooltip: 'Plugin Localizador',
  zoom: 5,
  useProxy: false,
  pointStyle: 'pinMorado',
  isDraggable: true,

  searchOptions: {
    addendum: 'scne',
    size: 15,
    layers: 'address,street,venue',
    // sources: 'calrj',
    radius: 200,
    // urlAutocomplete: '',
    // urlReverse: '',
  }
});

map.addPlugin(mp);

window.map = map;
window.mp = mp;
