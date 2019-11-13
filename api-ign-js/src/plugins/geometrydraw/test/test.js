import GeometryDraw from 'facade/geometrydraw';

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  maxZoom: 20,
  minZoom: 4,
  center: [-467062.8225, 4783459.6216],
});

const mp = new GeometryDraw({
  collapsed: false,
  collapsible: true,
  position: 'TR',
});

map.addPlugin(mp);

window.map = map;
