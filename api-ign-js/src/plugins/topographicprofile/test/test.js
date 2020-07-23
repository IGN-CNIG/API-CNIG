import Topographicprofile from 'facade/topographicprofile';

const map = M.map({
  container: 'mapjs',
  zoom: 6,
  center: [-467062.8225, 4683459.6216],
});

const mp = new Topographicprofile();

map.addPlugin(mp);

window.map = map;
