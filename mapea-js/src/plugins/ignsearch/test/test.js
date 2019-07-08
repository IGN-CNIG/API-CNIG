import IGNSearch from 'facade/ignsearch';

const map = M.map({
  container: 'mapjs',
  controls: ['panzoom', 'overviewmap', 'scale*true', 'scaleline', 'rotate', 'layerswitcher', 'location', 'getfeatureinfo'],
  layers: [layerinicial, layerUA],
  projection: "EPSG:3857*m",
  center: [-467062.8225, 4683459.6216],
  getfeatureinfo: "html",
});

const mp = new IGNSearch({
  servicesToSearch: 'gn',
  maxResults: 10,
  noProcess: 'municipio,poblacion',
  countryCode: 'es',
  isCollapsed: false,
  position: 'TL',
});
map.addPlugin(mp);


window.map = map;

const layerinicial = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

const layerUA = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false,
}, {});

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
        format: 'image/jpeg',
      }), new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        legend: 'Mapa IGN',
        matrixSet: "GoogleMapsCompatible",
      }, {
        format: 'image/png',
      }), ],
    },
  ],
});

const kml = new M.layer.KML('KML*Delegaciones IGN*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*true');


map.addLayers(kml);

kml.on('load', () => {
  const features = kml.getImpl().getOL3Layer().getSource().getFeatures();

  features.forEach((f) => {
    const styles = f.getStyle()(f);
    const news = [styles[0]];
    f.setStyle(news);
  });
});
// kml.on('select:features', (feature, e) => map.setCenter(e.coord));

map.addPlugin(mp5);

map.addPlugin(mp);

const mp2 = new M.plugin.Attributions({
  mode: 1,
  scale: 10000,
  defaultAttribution: 'Instituto Geográfico Nacional',
  defaultURL: 'https://www.ign.es/',
});

map.addPlugin(mp2);

const mp3 = new M.plugin.ShareMap({
  baseUrl: 'https://cnigvisores_pub.desarrollo.guadaltel.es/mapea/',
  position: 'BR',
});

map.addPlugin(mp3);
