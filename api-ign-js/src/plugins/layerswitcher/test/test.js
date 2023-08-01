import Layerswitcher from 'facade/layerswitcher';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
  center: {
    x: -528863.345515127,
    y: 4514194.232367303,
  },
  zoom: 9,
});

const capa1 = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'capa1',
  geometry: 'MPOLYGON',
});
window.capa1 = capa1;
map.addWFS(capa1);
// capa1.setZIndex(999999);

const capa2 = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'capa2',
  tiled: false,
  transparent: true,
}, {
  // maxScale: 28000000,
  // minScale: 14000000,
});
window.capa2 = capa2;

// capa2.setZIndex(99);

map.addWMS(capa2);

// const capa3 = new M.layer.KML({
//   url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
//   name: 'capa3',
//   extract: true,
// });
// map.addKML(capa3);

// const capa4 = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Municipios',
//   legend: 'capa4',
//   geometry: 'MPOLYGON',
// });
// map.addWFS(capa4);

// const capa5 = new M.layer.WMS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/wms?',
//   name: 'provincias_pob',
//   legend: 'capa5',
//   tiled: false,
//   transparent: true,
// });

// map.addWMS(capa5);


const mp = new Layerswitcher({
  collapsed: false,
  position: 'TL',
  collapsible: true,
  isDraggable: false,
  reverse: true,
  modeSelectLayers: 'eyes',
  tools: ['transparency', 'legend', 'zoom', 'information', 'style', 'delete'],
  isMoveLayers: true,
});
map.addPlugin(mp);

const mp2 = new M.plugin.TOC({
  collapsed: false,
  position: 'TL',
  collapsible: true,
  isDraggable: false,
  reverse: true,
  modeSelectLayers: 'eyes',
});
map.addPlugin(mp2);
window.mp = mp;

window.map = map;
