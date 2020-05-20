import Topographicprofile from 'facade/topographicprofile';

const map = M.map({
  container: 'mapjs',
  // controls: ["mouse"],
  //layers: ['OSM'],
  //projection: 'EPSG:4326*d'
});

const mp = new Topographicprofile();

map.addPlugin(mp);

window.map = map;
