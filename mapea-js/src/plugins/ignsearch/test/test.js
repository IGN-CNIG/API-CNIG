import IGNSearch from 'facade/ignsearch';

const map = M.map({
  container: 'mapjs',
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
  reverse: true,
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
