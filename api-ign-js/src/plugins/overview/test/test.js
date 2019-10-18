import Overview from 'facade/overview';

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  maxZoom: 17,
  minZoom: 5,
  center: [-467062.8225, 4683459.6216],
});

const mp = new Overview();

map.addPlugin(mp);

window.map = map;
