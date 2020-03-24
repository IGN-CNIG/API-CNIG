import ZoomPanel from 'facade/zoompanel';

const map = M.map({
  container: 'mapjs',
});
const mp = new ZoomPanel({
  projection: 'EPSG:4326'
});
mp.on('finished:draw', (feature) => {
  console.log(feature);
});
map.addPlugin(mp);
window.map = map;
