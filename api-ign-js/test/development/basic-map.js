import { map as Mmap } from 'M/mapea';
import WMS from 'M/layer/WMS';
import WMTS from 'M/layer/WMTS';
import KML from 'M/layer/KML';

const map = Mmap({
  container: 'map',
  //controls: ['backgroundlayers*2*false'],
  controls: ['backgroundlayers', 'location', 'getfeatureinfo'],
  maxZoom: 20,
  layers: [],
});

// const layerUA = new WMS({
//   url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
//   name: 'AU.AdministrativeUnit',
//   legend: 'Unidad administrativa',
//   tiled: false
// }, {});
// map.addLayers(new WMTS("WMTS*http://wmts-mapa-lidar.idee.es/lidar*EL.GridCoverageDSM*GoogleMapsCompatible*Modelo%20Digital%20de%20Superficies%20LiDAR*true*image/png*true*true*true"));
// map.addLayers(new WMS("WMS*Leyenda*http://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeBoundary*true*false**1.1.1*false*true*false"));
// const ocupacionSuelo = new WMTS({
//   url: 'http://wmts-mapa-lidar.idee.es/lidar',
//   name: 'EL.GridCoverageDSM',
//   legend: 'Modelo Digital de Superficies LiDAR',
//   matrixSet: 'GoogleMapsCompatible',
// });

// map.addLayers([ocupacionSuelo]);
window.map = map;

map.addLayers(new WMTS({
  url: 'http://wmts-mapa-lidar.idee.es/lidar',
  name: 'EL.GridCoverageDSM',
  legend: 'Modelo Digital de Superficies LiDAR',
  matrixSet: 'GoogleMapsCompatible',
  visibility: true,
}, {}))

const layerUA = new WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false
}, {});

map.addLayers(layerUA)
