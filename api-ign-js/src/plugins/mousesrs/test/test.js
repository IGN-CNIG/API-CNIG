import MouseSRS from 'facade/mousesrs';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  projection: 'EPSG:3857*m',
  center: [-443729, 4860856],
  zoom: 4,
});

const mp = new MouseSRS({
  position: 'TR',
  srs: 'EPSG:4326',
});

map.addPlugin(mp);

window.map = map;
