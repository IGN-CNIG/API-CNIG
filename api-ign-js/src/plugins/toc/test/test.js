import TOC from 'facade/toc';

const map = M.map({
  container: 'mapjs',
});

const mp = new TOC();

map.addPlugin(mp);
const layerUA = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Unidad administrativa',
  tiled: false
}, {});
const layerinicial = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativogggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggggg',
  tiled: false,
}, {});
map.addLayers(layerUA);
map.addLayers(layerinicial);

window.mp = mp;
