import VectorsManagement from 'facade/vectorsmanagement';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
  center: [-458756.9690741142, 4682774.665868655],
  layers: ['OSM'],
  zoom: 6,
});

map.addLayers(new M.layer.Vector({
  name: 'vector_a',
  legend: 'Vector A',
}, {displayInLayerSwitcher: true}));

const mp = new VectorsManagement({
  position: 'TR',
  collapsed: true,
  collapsible: true,
  // Herramientas
  selection: true,
  addlayer: true,
  creation: true,
  edition: true,
  style: true,
  analysis: true,
  download: true,
  help: true,
});

map.addPlugin(mp);

window.map = map;
