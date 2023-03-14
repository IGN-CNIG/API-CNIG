import IGNSearchLocator from 'facade/ignsearchlocator';

// M.language.setLang('en');


const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
});

const mp = new IGNSearchLocator({
  servicesToSearch: 'gn',
  searchPosition: 'geocoder,nomenclator',
  maxResults: 10,
  collapsed: true,
  collapsible: true,
  position: 'TL',
  reverse: false,
  cadastre: false,
  searchCoordinatesXYZ: false,
  // urlCandidates: 'http://visores-cnig-gestion-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/candidatesJsonp',
  // urlFind: 'http://visores-cnig-gestion-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/findJsonp',
  // urlReverse: 'http://visores-cnig-gestion-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/reverseGeocode',
  // urlCandidates: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/candidatesJsonp',
  // urlFind: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/findJsonp',
  // urlReverse: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/reverseGeocode',
});

// map.removeControls('panzoom');

map.addPlugin(mp);

window.map = map;
