import Perfiltopografico from 'facade/perfiltopografico';

const map = M.map({
  container: 'mapjs',
  // controls: ["mouse"],
  //layers: ['OSM'],
  //projection: 'EPSG:4326*d'
});

const mp = new Perfiltopografico();

map.addPlugin(mp);

window.map = map;
