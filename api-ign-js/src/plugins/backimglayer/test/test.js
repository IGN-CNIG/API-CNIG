import BackImgLayer from 'facade/backimglayer';

const map = M.map({
  container: 'mapjs',
});

const mp = new BackImgLayer({
  position: 'TR',
  layerId: 0,
  layerVisibility: true,
  layerOpts: [{
      id: 'mapa',
      preview: '../src/facade/assets/images/mapea4sigc.png',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Mapa IGN',
        matrixSet: 'GoogleMapsCompatible',
      }, {
        format: 'image/jpeg',
      })],
    },
    {
      id: 'imagen',
      title: 'Imagen',
      preview: '../src/facade/assets/images/osm.png',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
      }, {
        format: 'image/png',
      })],
    },
    {
      id: 'hibrido',
      title: 'Híbrido',
      preview: '../src/facade/assets/images/mapea4sigc.png',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
      }, {
        format: 'image/png',
      }), new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        matrixSet: 'GoogleMapsCompatible',
        legend: 'Mapa IGN',
      }, {
        format: 'image/png',
      })],
    },
  ],
});

map.addPlugin(mp);

// const layerinicial = new M.layer.WMTS({
//   url: 'http://www.ign.es/wmts/pnoa-ma?',
//   name: 'OI.OrthoimageCoverage',
//   legend: 'Imagen (PNOA)',
// });


// const map = M.map({
//   container: 'mapjs',
//   layers: [layerinicial],
//   projection: 'EPSG:4326*d',
//   // controls: ['layerswitcher'],
//   zoom: 3,
//   center: [-5.86, 37.68], //   center: [-4.5703, 39.4687],
// });


// map.addWMS(new M.layer.WMS({
//   url: 'http://servicios.idee.es/wms-inspire/transportes?',
//   name: 'TN.RoadTransportNetwork.RoadLink',
//   legend: 'Transporte',
// }));


// map.addWMS(new M.layer.WMS({
//   url: 'http://www.ideandalucia.es/wms/mta400v_2008?',
//   name: 'Redes_energeticas',
//   legend: 'Redes',
// }));

window.map = map;
