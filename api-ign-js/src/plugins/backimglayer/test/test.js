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
      preview: '../src/facade/assets/images/svqmapa.png',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Mapa IGN',
        matrixSet: 'GoogleMapsCompatible',
        // FIXME: include transparent, displayInLayerSwitcher, visibility etc here??
        transparent: false,
      }, {
        format: 'image/jpeg', // FIXME: format doesn't get add to layer
      })],
    },
    {
      id: 'imagen',
      title: 'Imagen',
      preview: '../src/facade/assets/images/svqimagen.png',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
      }, {
        format: 'image/png',
      })],
    },
    {
      id: 'hibrido',
      title: 'Híbrido',
      preview: '../src/facade/assets/images/svqhibrid.png',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
      }, {
        format: 'image/png',
      }), new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        matrixSet: 'GoogleMapsCompatible',
        legend: 'Mapa IGN',
        transparent: true,
      }, {
        format: 'image/png',
      })],
    },
    {
      id: 'lidar',
      preview: '../src/facade/assets/images/svqlidar.png',
      title: 'LIDAR',
      layers: [new M.layer.WMTS({
        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        name: 'EL.GridCoverageDSM',
        legend: 'Modelo Digital de Superficies LiDAR',
        matrixSet: 'GoogleMapsCompatible',
      }, {
        format: 'image/png',
      })],
    },
  ],
  ids: 'mapa,hibrido',
  titles: 'Mapa,Hibrido',
  previews: '../src/facade/assets/images/svqmapa.png,../src/facade/assets/images/svqhibrid.png',
  layers: 'WMTS^http://www.ign.es/wmts/ign-base?^IGNBaseTodo^GoogleMapsCompatible^Mapa IGN^false^image/jpeg^false^false^true,WMTS^http://www.ign.es/wmts/pnoa-ma?^OI.OrthoimageCoverage^GoogleMapsCompatible^Imagen (PNOA)^false^image/jpeg^false^false^true+WMTS^http://www.ign.es/wmts/ign-base?^IGNBaseOrto^GoogleMapsCompatible^Mapa IGN^true^image/jpeg^false^false^true',
});

map.addPlugin(mp);

window.map = map;
