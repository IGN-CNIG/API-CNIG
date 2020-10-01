import Rescale from 'facade/rescale';

M.language.setLang('es');


const map = M.map({
  container: 'mapjs',
  controls: ['scale*true'],
  zoom: 5,
  maxZoom: 20,
  minZoom: 4,
  center: [-467062.8225, 4683459.6216],
});

const mp = new Rescale({
  collapsible: true,
  collapsed: true,
  position: 'TL',
});

map.addPlugin(mp);

window.map = map;
