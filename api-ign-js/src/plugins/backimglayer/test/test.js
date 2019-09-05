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
      // preview: '../src/facade/assets/images/svqmapa.png',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Mapa IGN',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
      }, {
        format: 'image/jpeg', // FIXME: format doesn't get add to layer
      })],
    },
    {
      id: 'imagen',
      title: 'Imagen',
      // preview: '../src/facade/assets/images/svqimagen.png',
      layers: [new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
      }, {
        format: 'image/png',
      })],
    },
    {
      id: 'hibrido',
      title: 'Híbrido',
      // preview: '../src/facade/assets/images/svqhibrid.png',
      layers: [new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
      }, {
        format: 'image/png',
      }), new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        matrixSet: 'GoogleMapsCompatible',
        legend: 'Mapa IGN',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
      }, {
        format: 'image/png',
      })],
    },
    {
      id: 'lidar',
      // preview: '../src/facade/assets/images/svqlidar.png',
      title: 'LIDAR',
      layers: [new M.layer.WMTS({
        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        name: 'EL.GridCoverageDSM',
        legend: 'Modelo Digital de Superficies LiDAR',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
      }, {
        format: 'image/png',
      })],
    },
  ],
  ids: 'mapa,hibrido',
  titles: 'Mapa,Hibrido', // FIXME: change asterisco for new character
  previews: '', // '../src/facade/assets/images/svqmapa.png,../src/facade/assets/images/svqhibrid.png',
  layers: 'WMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseTodoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscofalseasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue,WMTSasteriscohttps://www.ign.es/wmts/pnoa-ma?asteriscoOI.OrthoimageCoverageasteriscoGoogleMapsCompatibleasteriscoImagen (PNOA)asteriscofalseasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue+WMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseOrtoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscotrueasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue',
});

map.addPlugin(mp);

window.map = map;
