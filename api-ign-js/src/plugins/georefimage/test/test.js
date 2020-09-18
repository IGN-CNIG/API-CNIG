import Georefimage from 'facade/georefimage';

// M.language.setLang('en');

// const map = M.map({
//   container: 'mapjs',
//   layers: ['WMTS*http://www.ign.es/wmts/mapa-raster?*MTN*EPSG:4326*label*false'],
//   projection: 'EPSG:4326*d',
//   controls: [''],
//   center: { x: -6, y: 37.4 },
// });

const map = M.map({
  container: 'mapjs',
  // zoom: 5,
  // maxZoom: 20,
  // minZoom: 4,
  // center: [1294092, 4180386],

  layers: ['WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*EPSG:4326*IGNBaseTodo*false*image/png*false*false*true'],
  // layer: ['OSM'],
  projection: 'EPSG:4326*d',
  // layers: ['WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*IGNBaseTodo*false*image/png*false*false*true'],
});

// const wmts = new M.layer.WMTS({
//   url: 'http://www.ign.es/wmts/ign-base?',
//   name: 'IGNBaseTodo',
//   matrixSet: 'EPSG:25830',
//   // legend: 'IGNBaseTodo',
//   tiled: false,
// }, {
//   format: 'image/png',
// });
// map.addWMTS(wmts);


// layers: ['WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*EPSG:25830*IGNBaseTodo*false*image/png*false*false*true'],
//   projection: 'EPSG:25830*m',

// layers: ['WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*IGNBaseTodo*false*image/png*false*false*true'],
//   projection: 'EPSG:3857*m',

// 25830 ANDALUCIA

// layers: ['WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*EPSG:25830*PNOA'],


// const map = M.map({
//   container: 'mapjs',
//   center: {
//     x: 360020,
//     y: 4149045,
//   },
//   zoom: 5,
//   layers: [
//     'WMTS*http://www.ideandalucia.es/geowebcache/service/wmts?*toporaster*SIG-C:25830*WMTS*false',
//   ],
// });

const layerinicial = new M.layer.WMS({
  url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Limite administrativo',
  tiled: false,
}, {});

const campamentos = new M.layer.GeoJSON({
  name: 'Campamentos',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&',
  extract: true,
});

const georefimage = new Georefimage({
  collapsed: true,
  collapsible: true,
  position: 'TR',
});

map.addLayers([layerinicial, campamentos]);
map.addPlugin(georefimage);
window.map = map;
