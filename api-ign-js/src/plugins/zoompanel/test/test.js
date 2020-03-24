import ZoomPanel from 'facade/zoompanel';

M.language.setLang('en');

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
