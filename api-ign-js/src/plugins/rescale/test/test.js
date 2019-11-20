import Rescale from 'facade/rescale';

const map = M.map({
  container: 'mapjs',
  controls: ['scale*true', 'panzoom'],
});

const mp = new Rescale({
  collapsible: true,
  collapsed: true,
  position: 'BL',
});

map.addPlugin(mp);

window.map = map;
