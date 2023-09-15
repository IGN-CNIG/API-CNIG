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
  collapsed: false,
  position: 'TL',
  tooltip: 'Capas',
  collapsible: true,
  isDraggable: true,
  modeSelectLayers: 'radio',
  tools: [],
  // tools: ['transparency', 'legend', 'zoom', 'information', 'style', 'delete'],
  isMoveLayers: true,
  // precharged: [],
  https: true,
  http: true,
});
map.addPlugin(mp);

// CAPAS

const capaGeoJSON = new M.layer.GeoJSON({
  name: 'Capa GeoJSON',
  legend: 'Capa GeoJSON',
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application%2Fjson',
  extract: false,
});

const capaOSM = new M.layer.OSM({
  name: 'Capa OSM',
  legend: 'Capa OSM',
  transparent: true,
  url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  matrixSet: 'EPSG:3857',
});

const capaKML = new M.layer.KML({
  url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
  name: 'Capa KML',
  legend: 'Capa KML',
  extract: true,
});

window.fetch('./cabrera.mbtiles').then((response) => {
  const mbtile = new M.layer.MBTiles({
    name: 'mbtiles',
    legend: 'Capa MBTiles L',
    source: response,
  });
  map.addLayers(mbtile);
  window.mbtile = mbtile;
}).catch((e) => {
  throw e;
});

window.fetch('./countries.mbtiles').then((response) => {
  const mbtilesvector = new M.layer.MBTilesVector({
    name: 'mbtiles_vector',
    legend: 'Capa MBTilesVector L',
    source: response,
    // maxZoomLevel: 5,
  });
  map.addLayers(mbtilesvector);
}).catch((e) => {
  throw e;
});

const capaMVT = new M.layer.MVT({
  url: 'https://www.ign.es/web/resources/mapa-base-xyz/vt/{z}/{x}/{y}.pbf',
  // layers: ['camino_lin'],
  name: 'Capa MVT',
  legend: 'Capa MVT',
  projection: 'EPSG:3857',
  extract: true,
});

const capaOGCAPIFeatures = new M.layer.OGCAPIFeatures({
  url: 'https://api-features.idee.es/collections/',
  name: 'hidrografia/Falls',
  legend: 'Capa OGCAPIFeatures L',
  limit: 20,
}, {
  predefinedStyles: [
    new M.style.Point({
      fill: {
        color: 'black',
        width: 3,
        opacity: 1,
      },
      radius: 5,
      // name: 'Negro',
    }),
    new M.style.Point({
      fill: {
        color: 'yellow',
        width: 3,
        opacity: 1,
      },
      radius: 5,
      name: 'Amarillo',
    }),
  ],
  style: new M.style.Point({
    fill: {
      color: 'red',
      width: 3,
      opacity: 1,
    },
    radius: 15,
    // name: 'Rojo',
  }),
});

const capaTMS = new M.layer.TMS({
  url: 'https://tms-mapa-raster.ign.es/1.0.0/mapa-raster/{z}/{x}/{-y}.jpeg',
  name: 'Capa TMS',
  legend: 'Capa TMS L',
  projection: 'EPSG:3857',
});

const capaVector = new M.layer.Vector({
  name: 'capaVector',
  legend: 'vector legend',
});
const feature = new M.Feature('localizacion', {
  type: 'Feature',
  properties: {},
  geometry: {
    type: 'Point',
    coordinates: [-458757.1288, 4795217.2530],
  },
});
capaVector.addFeatures(feature);


const capaWFS = new M.layer.WFS({
  url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
  namespace: 'tematicos',
  name: 'Provincias',
  legend: 'Capa WFS l',
  geometry: 'MPOLYGON',
});

const capaWMS = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Capa WMS l',
});

const capaWMTS = new M.layer.WMTS({
  url: 'https://servicios.idee.es/wmts/ocupacion-suelo',
  name: 'LC.LandCoverSurfaces',
  legend: 'LC.LandCoverSurfaces l',
  matrixSet: 'GoogleMapsCompatible',
  format: 'image/png',
});

const capaXYZ = new M.layer.XYZ({
  url: 'https://www.ign.es/web/catalogo-cartoteca/resources/webmaps/data/cresques/{z}/{x}/{y}.jpg',
  name: 'Capa XYZ',
  legend: 'Capa XYZ l',
  projection: 'EPSG:3857',
});


map.addLayers(capaGeoJSON);
map.addLayers(capaOSM);
map.addLayers(capaKML);
map.addLayers(capaMVT);
map.addLayers(capaOGCAPIFeatures);
map.addLayers(capaTMS);
map.addLayers(capaVector);
capaVector.addFeatures(feature);
map.addLayers(capaWFS);
map.addLayers(capaWMS);
map.addLayers(capaWMTS);
map.addLayers(capaXYZ);

window.map = map;
window.capaGeoJSON = capaGeoJSON;
window.capaKML = capaKML;

// OTRAS PRUEBAS

// const capa2 = new M.layer.WMS({
//   url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
//   name: 'AU.AdministrativeUnit',
//   legend: 'capa2',
//   tiled: false,
//   transparent: true,
// }, {
//   maxScale: 14000000,
//   minScale: 3000000,
// });
// // window.capa2 = capa2;

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
