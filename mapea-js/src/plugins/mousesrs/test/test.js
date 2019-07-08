import MouseSRS from 'facade/mousesrs';

const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
});

const mp = new MouseSRS({
  position: 'BR',
  tooltip: 'Muestra coordenadas',
  srs: 'EPSG:4326',
});

map.addPlugin(mp);
window.mp = mp;
window.map = map;
