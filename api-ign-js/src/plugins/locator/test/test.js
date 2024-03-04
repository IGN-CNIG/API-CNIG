import Locator from 'facade/locator';

M.language.setLang('es');

M.proxy(false);

const map = M.map({
  container: 'mapjs',
  zoom: 5,
  maxZoom: 20,
  minZoom: 4,
  center: [-467062.8225, 4783459.6216],
});

window.map = map;

const mp = new Locator({
  useProxy: true,
  isDraggable: true,
  // position: 'BR',
  position: 'TC',
  collapsible: true,
  collapsed: true,
  order: 1,
  tooltip: 'Plugin Localizador',
  zoom: 5,
  pointStyle: 'pinMorado',
  byCoordinates: true,
  // byCoordinates: {
  //   projections: [
  //     { title: 'ETRS89 geographic (4258) dd', code: 'EPSG:4258', units: 'd' },
  //     { title: 'ETRS89 geographic (4258) dms', code: 'EPSG:4258', units: 'dms' },
  //   ],
  //   help: 'https://www.google.com/',
  // },
  byParcelCadastre: true,
  // byParcelCadastre: {
  //   cadastreWMS: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR',
  //   CMC_url: 'http://ovc.catastro.meh.es/ovcservweb/ConsultaMunicipioCodigos',
  //   DNPPP_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/Consulta_DNPPP_Codigos',
  //   CPMRC_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_CPMRC',
  // },
  byPlaceAddressPostal: true,
  // byPlaceAddressPostal: {
  //   maxResults: 5,
  //   noProcess: 'poblacion',
  //   countryCode: 'es',
  //   reverse: false,
  //   resultVisibility: true,
  //   urlCandidates: 'http://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp',
  //   urlFind: 'http://www.cartociudad.es/geocoder/api/geocoder/findJsonp',
  //   urlReverse: 'http://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode',
  //   geocoderCoords: [-5.741757, 41.512058],
  //   requestStreet: 'https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?q=Sevilla&type=provincia&tip_via=null&id=41&portal=null&extension=null',
  // },
});

map.addPlugin(mp);

map.addPlugin(new M.plugin.Vectors({
  position: 'TL'
}));

map.addPlugin(new M.plugin.Layerswitcher({
  position: 'TR'
}));

window.map = map;
window.mp = mp;
