import BackImgLayer from 'facade/backimglayer';
import ShareMap from '../../sharemap/src/facade/js/sharemap';

M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});

const mp2 = new ShareMap({
  baseUrl: `${window.location.href.substring(0, window.location.href.indexOf('api-core'))}api-core/`,
  position: 'TR',
});

const mp = new BackImgLayer({
  collapsed: true,
  collapsible: true,
  position: 'TR',
  columnsNumber: 3,
  layerOpts: [{
      id: 'mapa',
      preview: '../src/facade/assets/images/svqmapa.png',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'http://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Mapa IGN',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
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
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
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
          transparent: true,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/jpeg',
        }),
        new M.layer.WMTS({
          url: 'http://www.ign.es/wmts/ign-base?',
          name: 'IGNBaseOrto',
          matrixSet: 'GoogleMapsCompatible',
          legend: 'Mapa IGN',
          transparent: false,
          displayInLayerSwitcher: false,
          queryable: false,
          visible: true,
          format: 'image/png',
        })
      ],
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
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/png',
      })],
    },
    {
      id: 'lidar2',
      preview: '../src/facade/assets/images/svqlidar.png',
      title: 'LIDAR2',
      layers: [new M.layer.WMTS({
        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        name: 'EL.GridCoverageDSM',
        legend: 'Modelo Digital de Superficies LiDAR',
        matrixSet: 'GoogleMapsCompatible',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/png',
      })],
    }
  ],
});

// const mp = new BackImgLayer({
//   collapsed: true,
//   collapsible: true,
//   position: 'BR',
//   columnsNumber: 3,
//   ids: ['mapa', 'hibrido'],
//   titles: ['Mapa', 'Hibrido'],
//   previews: ['../src/facade/assets/images/svqmapa.png', '../src/facade/assets/images/svqhibrid.png'],
//   layers: ['WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true', 'WMTS*https://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*GoogleMapsCompatible*Imagen (PNOA)*false*image/png*false*false*true+WMTS*https://www.ign.es/wmts/ign-base?*IGNBaseOrto*GoogleMapsCompatible*Mapa IGN*true*image/jpeg*false*false*true'],
// });




// Formato parámetros REST:
// ids: 'mapa,hibrido',
// titles: 'Mapa,Hibrido',
// previews: '', // '../src/facade/assets/images/svqmapa.png,
// ../src/facade/assets/images/svqhibrid.png',
// layers: 'WMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseTodoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscofalseasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue,WMTSasteriscohttps://www.ign.es/wmts/pnoa-ma?asteriscoOI.OrthoimageCoverageasteriscoGoogleMapsCompatibleasteriscoImagen (PNOA)asteriscofalseasteriscoimage/pngasteriscofalseasteriscofalseasteriscotruesumarWMTSasteriscohttps://www.ign.es/wmts/ign-base?asteriscoIGNBaseOrtoasteriscoGoogleMapsCompatibleasteriscoMapa IGNasteriscotrueasteriscoimage/jpegasteriscofalseasteriscofalseasteriscotrue',


map.addPlugin(mp);
// map.addPlugin(mp2);

window.map = map;
