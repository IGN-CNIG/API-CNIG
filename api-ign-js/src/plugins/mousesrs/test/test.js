import MouseSRS from 'facade/mousesrs';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  projection: 'EPSG:3857*m',
  center: [-443729, 4860856],
  zoom: 8,
});

const mp = new MouseSRS({
  activeZ: true,
  geoDecimalDigits: 6,
  utmDecimalDigits: 2,
  label: 'EPSG:4326',
  helpUrl: 'https://www.ign.es/',
});

map.addPlugin(mp);

window.map = map;
