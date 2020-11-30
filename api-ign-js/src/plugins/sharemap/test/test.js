import ShareMap from 'facade/sharemap';

M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  controls: ['scale*true', 'location', 'backgroundlayers'],
  zoom: 3,
});

const mp = new ShareMap({
  baseUrl: 'http://mapea-lite.desarrollo.guadaltel.es/api-core/',
  position: 'BR',
  minimize: true,
});
M.language.setLang('en');
map.addPlugin(mp);
window.map = map;
const kml = new M.layer.KML('KML*Delegaciones*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*false*false*true');
map.addLayers(kml);
const layerinicial = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
  version: '1.1.1',
}, {});

const layerUA = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa'
}, {});

const ocupacionSuelo = new M.layer.WMTS({
  url: 'http://wmts-mapa-lidar.idee.es/lidar',
  name: 'EL.GridCoverageDSM',
  legend: 'Modelo Digital de Superficies LiDAR',
  matrixSet: 'GoogleMapsCompatible',
}, {
  visibility: false,
});

map.addLayers([ocupacionSuelo, layerinicial, layerUA]);


const mp3 = new M.plugin.IGNSearch({
  servicesToSearch: 'gn',
  maxResults: 10,
  isCollapsed: false,
  noProcess: 'municipio,poblacion',
  countryCode: 'es',
  reverse: true,
});
const mp2 = new M.plugin.Attributions({
  mode: 1,
  scale: 10000,
  defaultAttribution: 'Instituto Geográfico Nacional',
  defaultURL: 'https://www.ign.es/',
});

const mp6 = new M.plugin.ZoomExtent();
const mp7 = new M.plugin.MouseSRS({
  projection: 'EPSG:4326',
});
const mp8 = new M.plugin.TOC();

map.addPlugin(mp2);
map.addPlugin(mp3);
map.addPlugin(mp6);
map.addPlugin(mp7);
map.addPlugin(mp8);
const mp9 = new M.plugin.TOC();
map.addPlugin(mp9);
// M.proxy(false);
