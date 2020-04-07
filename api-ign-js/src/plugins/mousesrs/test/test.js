import MouseSRS from 'facade/mousesrs';

const map = M.map({
  container: 'mapjs',
  projection: 'EPSG:3857*m',
  center: [-443729, 4860856],
  //  controls: ['scale'],
  zoom: 4,
});

const mp = new MouseSRS({
  position: 'TR',
  tooltip: 'Muestra coordenadas',
  srs: 'EPSG:4326',
});

map.addPlugin(mp);

window.map = map;
