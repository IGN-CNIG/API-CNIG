import GeometryDraw from 'facade/geometrydraw';

const map = M.map({
  container: 'mapjs',
  // controls: ['layerswitcher'],
});

const mp = new GeometryDraw({
  collapsed: true,
  collapsible: true,
  position: 'TR',
});

map.addControls(new M.control.GetFeatureInfo('gml', { buffer: 1000 }));

map.addPlugin(mp);

window.map = map;
