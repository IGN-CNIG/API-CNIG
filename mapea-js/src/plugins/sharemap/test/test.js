import ShareMap from 'facade/sharemap';

const map = M.map({
  container: 'mapjs',
  controls: ['scale*true', 'location'],
  zoom: 3,
});

const mp = new ShareMap({
  baseUrl: 'https://mapea-lite.desarrollo.guadaltel.es/api-core/',
  position: 'BR',
});

map.addPlugin(mp);
// map.addKML(new M.layer.KML("KML*Arboleda*http://mapea4-sigc.juntadeandalucia.es/files/kml/*arbda_sing_se.kml*true"))
window.map = map;
const kml2 = new M.layer.KML({
  url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
  name: 'Delegaciones',
  extract: false,
  label: false,
});
map.addLayers(kml2);


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

const mp4 = new M.plugin.XYLocator({
  position: 'TL',
});
const mp5 = new M.plugin.BackgroundLayersSelector({
  position: 'TR',
  layerOpts: [{
      id: 'mapa',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Callejero',
        matrixSet: "GoogleMapsCompatible",
        transparent: false,
      }, {
        format: 'image/jpeg',
      })]
    },
    {
      id: 'imagen',
      title: 'Imagen',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen',
        matrixSet: "GoogleMapsCompatible",
        transparent: false,
      }, {
        format: 'image/jpeg',
      })]
    },
    {
      id: 'hibrido',
      title: 'Híbrido',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen',
        matrixSet: "GoogleMapsCompatible",
      }, {
        displayInLayerSwitcher: false,
        format: 'image/jpeg',
      }), new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        legend: 'Mapa IGN',
        matrixSet: "GoogleMapsCompatible",
      }, {
        displayInLayerSwitcher: false,
        format: 'image/png',
      }), ],
    },
  ],
});
const mp6 = new M.plugin.ZoomExtent();
const mp7 = new M.plugin.MouseSRS({
  projection: 'EPSG:4326',
});
const mp8 = new M.plugin.TOC();

map.addPlugin(mp2);
map.addPlugin(mp3);
map.addPlugin(mp4);
map.addPlugin(mp5);
map.addPlugin(mp6);
map.addPlugin(mp7);
map.addPlugin(mp8);
