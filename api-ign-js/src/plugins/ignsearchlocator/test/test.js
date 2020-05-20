import IGNSearchLocator from 'facade/ignsearchlocator';

M.language.setLang('en');


const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
});

const mp = new IGNSearchLocator({
  CMC_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/ConsultaMunicipioCodigos',


  servicesToSearch: 'gn',
  maxResults: 10,
  noProcess: 'poblacion',
  countryCode: 'es',
  isCollapsed: true,
  collapsible: true,
  position: 'TL',
  reverse: true,
  searchPosition: 'geocoder,nomenclator',
  // urlCandidates: 'http://sergiotorrijos:8084/geocoder/api/geocoder/candidatesJsonp',
  // urlFind: 'http://sergiotorrijos:8084/geocoder/api/geocoder/findJsonp',
  // urlReverse: 'http://sergiotorrijos:8084/geocoder/api/geocoder/reverseGeocode',

  urlCandidates: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/candidatesJsonp',
  urlFind: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/findJsonp',
  urlReverse: 'http://servicios-de-busqueda-publico.desarrollo.guadaltel.es/geocoder/api/geocoder/reverseGeocode',

});

// map.removeControls('panzoom');

map.addPlugin(mp);

window.map = map;
