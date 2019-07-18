import { map as Mmap } from 'M/mapea';
import WMS from 'M/layer/WMS';
import WMTS from 'M/layer/WMTS';

const map = Mmap({
  container: 'map',
  controls: ['backgroundlayers*2*false'],
  maxZoom: 20,
  minZoom: 4,
  // center: [-467062.8225, 4683459.6216],
});

// const layerUA = new WMS({
//   url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
//   name: 'AU.AdministrativeUnit',
//   legend: 'Unidad administrativa',
//   tiled: false
// }, {});

// const ocupacionSuelo = new WMTS({
//   url: 'http://wmts-mapa-lidar.idee.es/lidar',
//   name: 'EL.GridCoverageDSM',
//   legend: 'Modelo Digital de Superficies LiDAR',
//   matrixSet: 'GoogleMapsCompatible',
// });

// map.addLayers([ocupacionSuelo]);
window.map = map;
