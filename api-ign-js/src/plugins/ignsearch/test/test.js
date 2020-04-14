import IGNSearch from 'facade/ignsearch';

M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  // controls: ['layerswitcher'],
});

const mp = new IGNSearch({
  servicesToSearch: 'gn',
  maxResults: 10,
  noProcess: 'poblacion',
  countryCode: 'es',
  isCollapsed: true,
  position: 'BL',
  // reverse: true,

  // urlCandidates: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/candidatesJsonp',
  // urlFind: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/findJsonp',
  // urlReverse: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/reverseGeocode',
});

map.addControls(new M.control.GetFeatureInfo('gml', { buffer: 1000 }));

map.addPlugin(mp);

window.map = map;
