import GeometryDraw from 'facade/geometrydraw';

const map = M.map({
  container: 'mapjs',
});

const mp = new GeometryDraw();

map.addPlugin(mp);

window.map = map;
