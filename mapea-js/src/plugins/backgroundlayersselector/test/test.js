import BackgroundLayersSelector from 'facade/backgroundlayersselector';

const layerinicial = new M.layer.WMTS({
  url: 'http://www.ign.es/wmts/pnoa-ma?',
  name: 'OI.OrthoimageCoverage',
  legend: 'Imagen (PNOA)',
});


const map = M.map({
  container: 'mapjs',
  layers: [layerinicial],
  projection: 'EPSG:4326*d',
  controls: ['layerswitcher'],
  zoom: 3,
  center: [-5.86, 37.68], //   center: [-4.5703, 39.4687],
});


map.addWMS(new M.layer.WMS({
  url: 'http://servicios.idee.es/wms-inspire/transportes?',
  name: 'TN.RoadTransportNetwork.RoadLink',
  legend: 'Transporte',
}));


map.addWMS(new M.layer.WMS({
  url: 'http://www.ideandalucia.es/wms/mta400v_2008?',
  name: 'Redes_energeticas',
  legend: 'Redes',
}));


const mp = new BackgroundLayersSelector({
  position: 'TR',
  layerOpts: [{
      id: 'mapa',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Mapa IGN',
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
        legend: 'Imagen (PNOA)',
      }, {
        format: 'image/png',
      })]
    },
    {
      id: 'hibrido',
      title: 'Híbrido',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
      }, {
        format: 'image/png',
      }), new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        legend: 'Mapa IGN',
      }, {
        format: 'image/png',
      }), ],
    },
  ],
});
window.map = map;
map.addPlugin(mp);
