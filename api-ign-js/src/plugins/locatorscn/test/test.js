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
  position: 'TL',
  collapsible: true,
  collapsed: true,
  zoom: 16,
  pointStyle: 'pinMorado',
    searchOptions: {
    addendum: 'iderioja',
    size: 15,
    layers: 'address,street,venue',
    radius: 200,
  },
});

map.addPlugin(mp);

window.map = map;
window.mp = mp;
