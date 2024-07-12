import Locator from 'facade/locator';

M.language.setLang('es');
// M.language.setLang('en');

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
  collapsible: true, // Ignorado con position 'TC', porque es false en ese caso.
  collapsed: false, // Ignorado con position 'TC', porque "collapsible" se pone a false.
  isDraggable: true, // Ignorado con position 'TC', porque elimina ese título
  position: 'TC', // TL | TR | BL | BR | TC
  useProxy: false,
  tooltip: 'Plugin Localizador',
  pointStyle: 'pinRojo', // 'pinAzul' | 'pinRojo' | 'pinMorado' | 'in_case_of_wrong_string'
  zoom: 15,
  // byPlaceAddressPostal: true,
  byPlaceAddressPostal: {
    maxResults: 5,
    noProcess: 'poblacion', // 'municipio' | 'poblacion' | 'toponimo' | 'callejero' | 'municipio,poblacion' | 'municipio,provincia,comunidad%20autonoma,poblacion,toponimo,expendeduria,ngbe,callejero,carretera,portal' | etc
    countryCode: 'es',
    reverse: true, // Añadir o no la opción de escoger punto del mapa en el buscado
    resultVisibility: true,
    urlCandidates: 'http://www.cartociudad.es/geocoder/api/geocoder/candidatesJsonp',
    urlFind: 'http://www.cartociudad.es/geocoder/api/geocoder/findJsonp',
    urlReverse: 'http://www.cartociudad.es/geocoder/api/geocoder/reverseGeocode',
    geocoderCoords: [-5.741757, 41.512058], // Muestra popup con información de este punto, desaparece instantáneamente si esta "requestStreet" puesto.
    requestStreet: 'https://www.cartociudad.es/geocoder/api/geocoder/findJsonp?q=Sevilla&type=provincia&tip_via=null&id=41&portal=null&extension=null',
  },
  byParcelCadastre: false,
  /*/
  byParcelCadastre: {
    cadastreWMS: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_RCCOOR',
    CMC_url: 'http://ovc.catastro.meh.es/ovcservweb/ConsultaMunicipioCodigos',
    DNPPP_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCallejeroCodigos.asmx/Consulta_DNPPP_Codigos',
    CPMRC_url: 'http://ovc.catastro.meh.es/ovcservweb/OVCSWLocalizacionRC/OVCCoordenadas.asmx/Consulta_CPMRC',
  }, // */
  byCoordinates: true,
  /*/
  byCoordinates: {
    projections: [
      { title: 'ETRS89 geographic (4258) d', code: 'EPSG:4258', units: 'd' },
      { title: 'ETRS89 geographic (4258) dms', code: 'EPSG:4258', units: 'dms' },
    ],
    help: 'https://www.google.com/',
  }, // */
  order: 1,
});

map.addPlugin(mp);
window.mp = mp;

map.addPlugin(new M.plugin.Vectors({ position: 'TL' }));
map.addPlugin(new M.plugin.Layerswitcher({ position: 'TR' }));

