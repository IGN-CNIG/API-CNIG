import GeometryDraw from 'facade/geometrydraw';

const map = M.map({
  container: 'mapjs',
});

const mp = new GeometryDraw({
  collapsed: true,
  collapsible: true,
  position: 'TL',
});

map.addPlugin(mp);

window.map = map;
