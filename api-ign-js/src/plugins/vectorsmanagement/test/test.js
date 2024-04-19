import VectorsManagement from 'facade/vectorsmanagement';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
  center: [-458756.9690741142, 4682774.665868655],
  layers: ['OSM'],
  zoom: 6,
});

// map.addPlugin(new M.plugin.Layerswitcher()); // ERROR M.plugin.Layerswitcher is not a constructor

// map.addLayers(new M.layer.Vector({
//   name: 'vector_a',
//   legend: 'Capa Vector',
// }, {displayInLayerSwitcher: true}));

map.addLayers(new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "Provincias",
  legend: "Capa WFS",
  geometry: 'MPOLYGON',
}));

map.addLayers(new M.layer.GeoJSON({
  name: "Municipios",
  legend: "Capa GeoJSON",
  url: "https://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Municipios&maxFeatures=500000&outputFormat=application%2Fjson"
}));

// map.addLayers(new M.layer.KML({
//   url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
//   name: "capaKML",
//   legend: "Capa KML",
//   extract: true
// }));

// map.addLayers(new M.layer.MVT({
//   url: 'https://vts.larioja.org/rioja/{z}/{x}/{y}.pbf',
//   name: 'MVT',
//   // legend: 'Capa MVT',
//   projection: 'EPSG:3857',
// }));

// map.addLayers(new M.layer.OGCAPIFeatures({
//   url: 'https://api-features.idee.es/collections/',
//   name: 'hidrografia/Falls',
//   legend: 'Capa OGCAPIFeatures',
//   limit: 20  
// }));

// window.fetch('./countries.mbtiles').then((response) => {
//   const mbtilesvector = new M.layer.MBTilesVector({
//     name: 'mbtiles_vector',
//     legend: 'Capa MBTilesVector L',
//     source: response,
//   });
//   map.addLayers(mbtilesvector);
// }).catch((e) => {
//   throw e;
// });


const mp = new VectorsManagement({
  position: 'TL',
  tooltip: 'Gestionar mis vectores',
  // isDraggable => falta implementar
  // useProxy => falta implementar
  collapsed: false,
  collapsible: false,
  // Herramientas
  // selection: false,
  // addlayer: false,
  // creation: false,
  // edition: false,
  // style: false,
  // analysis: false,
  // download: false,
  // help: false,
  isDraggable: true
});

map.addPlugin(mp);

window.map = map;
