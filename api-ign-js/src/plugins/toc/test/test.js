import TOC from 'facade/toc';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new TOC({
  collapsed: false,
  collapsible: false,
  position: 'BR',
});

map.addPlugin(mp);
const layerUA = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false,
}, {});
const layerinicial = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {
  visibility: false,
});

// const ocupacionSuelo = new M.layer.WMTS({
//   url: 'http://wmts-mapa-lidar.idee.es/lidar',
//   name: 'EL.GridCoverageDSM',
//   legend: 'Modelo Digital de Superficies LiDAR',
//   matrixSet: 'GoogleMapsCompatible',
// }, {
//   visibility: false,
// });
map.addLayers(layerUA);
map.addLayers(layerinicial);
// map.addLayers(ocupacionSuelo);


window.map = map;
