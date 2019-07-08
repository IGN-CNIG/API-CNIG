import ZoomExtent from 'facade/zoomextent';

const map = M.map({
  container: 'mapjs',
});

const mp = new ZoomExtent();

map.addPlugin(mp);

window.map = map;
