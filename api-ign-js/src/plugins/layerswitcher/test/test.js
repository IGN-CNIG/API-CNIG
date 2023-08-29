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

const mp = new Layerswitcher({
  collapsed: true,
  position: 'BL',
  collapsible: true,
  isDraggable: true,
  modeSelectLayers: 'eyes',
  tools: ['transparency', 'legend', 'zoom', 'information', 'style', 'delete'],
  isMoveLayers: true,
});
map.addPlugin(mp);

const capaGeoJSON = new M.layer.GeoJSON({
  name: 'Capa GeoJSON',
  url: 'http://www.ign.es/resources/geodesia/GNSS/SPTR_geo.json',
  extract: false,
});
// map.addLayers(capaGeoJSON);

const capaOSM = new M.layer.OSM({
  name: 'OSM',
  legend: 'Capa OSM',
  transparent: true,
  url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  matrixSet: 'EPSG:3857',
});
// map.addLayers(capaOSM);

const capaKML = new M.layer.KML({
  url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
  name: 'Capa KML',
  extract: true,
});
// map.addLayers(capaKML);

window.fetch('./cabrera.mbtiles').then((response) => {
  const mbtile = new M.layer.MBTiles({
    name: 'mbtiles',
    legend: 'Capa MBTiles',
    source: response,
  });
  // map.addLayers(mbtile);
}).catch((e) => {
  throw e;
});

window.fetch('./countries.mbtiles').then((response) => {
  const mbtilesvector = new M.layer.MBTilesVector({
    name: 'mbtiles_vector',
    legend: 'Capa MBTilesVector',
    source: response,
    maxZoomLevel: 5,
  });
  // map.addLayers(mbtilesvector);
}).catch((e) => {
  throw e;
});

const capaMVT = new M.layer.MVT({
  url: 'https://igo.idee.es/vt/{z}/{x}/{y}.pbf',
  name: 'Capa MVT',
  projection: 'EPSG:3857',
  extract: true,
});
// map.addLayers(capaMVT);

const capaOGCAPIFeatures = new M.layer.OGCAPIFeatures({
  url: 'https://api-features.idee.es/collections/',
  name: 'hidrografia/Falls',
  legend: 'Capa OGCAPIFeatures',
  limit: 20,
});
// map.addLayers(capaOGCAPIFeatures);


const capaTMS = new M.layer.TMS({
  url: 'https://tms-ign-base.idee.es/1.0.0/IGNBaseOrto/{z}/{x}/{-y}.png',
  name: 'Capa TMS',
  legend: 'Capa TMS',
  projection: 'EPSG:3857',
  tileGridMaxZoom: 19,
});
// map.addLayers(capaTMS);

const capaVector = new M.layer.Vector({
  name: 'capaVector',
});
const feature = new M.Feature('localizacion', {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [-458757.1288, 4795217.2530],
  },
});
// capaVector.addFeatures(feature);
// map.addLayers(capaVector);

const capaWFS = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Capa WFS',
  geometry: 'MPOLYGON',
});
// map.addLayers(capaWFS);

const capaWMS = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Capa WMS',
});
// map.addLayers(capaWMS);

const capaWMTS = new M.layer.WMTS({
  url: 'https://www.ign.es/wmts/primera-edicion-mtn?',
  name: 'catastrones',
  legend: 'Capa WMTS',
  matrixSet: 'GoogleMapsCompatible',
  format: 'image/jpeg',
});
// map.addLayers(capaWMTS);

const capaXYZ = new M.layer.XYZ({
  url: 'https://tms-pnoa-ma.ign.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg',
  name: 'Capa XYZ',
  legend: 'Capa XYZ',
  projection: 'EPSG:3857',
});
// map.addLayers(capaXYZ);



map.addLayers(capaGeoJSON);
// map.addLayers(capaOSM);
// map.addLayers(capaKML);
// map.addLayers(mbtile);
// map.addLayers(mbtilesvector);
// map.addLayers(capaMVT);
capaOGCAPIFeatures.setZIndex(99);
map.addLayers(capaOGCAPIFeatures);
// map.addLayers(capaTMS);
// capaVector.addFeatures(feature);
// map.addLayers(capaVector);
// map.addLayers(capaWFS);
map.addLayers(capaWMS);
// map.addLayers(capaWMTS);
// map.addLayers(capaXYZ);





// map.addLayers(capaGeoJSON);
// map.addLayers(capaOSM);
// map.addLayers(capaWMS);

// const capa1 = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'capa1',
//   geometry: 'MPOLYGON',
// });
// window.capa1 = capa1;
// map.addWFS(capa1);
// // capa1.setZIndex(999999);

// const capa2 = new M.layer.WMS({
//   url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
//   name: 'AU.AdministrativeUnit',
//   legend: 'capa2',
//   tiled: false,
//   transparent: true,
// }, {
//   // maxScale: 28000000,
//   // minScale: 14000000,
// });
// window.capa2 = capa2;

// capa2.setZIndex(99);

// map.addWMS(capa2);

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


// const mp2 = new M.plugin.TOC({
//   collapsed: false,
//   position: 'TL',
//   collapsible: true,
//   isDraggable: false,
//   modeSelectLayers: 'eyes',
// });
// map.addPlugin(mp2);
window.mp = mp;

window.map = map;
