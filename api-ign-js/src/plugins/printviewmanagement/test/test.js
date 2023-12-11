import PrintViewManagement from 'facade/printviewmanagement';

M.language.setLang('es');

const suelo = new M.layer.WMTS({
  url: 'https://servicios.idee.es/wmts/ocupacion-suelo?',
  name: 'LU.ExistingLandUse',
  legend: 'Ocupación del suelo WMTS',
  matrixSet: 'GoogleMapsCompatible',
  maxZoom: 20,
  minZoom: 4,
  visibility: true,
}, { crossOrigin: 'anonymous' });

const map = M.map({
  container: 'mapjs',
  zoom: 9,
  maxZoom: 20,
  minZoom: 4,
  layers: [suelo],
  center: [-467062.8225, 4683459.6216],
});

// añadir wmts API-CNIG {url: 'http://www.ign.es/wms-inspire/mapa-raster?', name: 'mtn_rasterizado',format: 'image/jpeg',legend: 'Mapa ETRS89 UTM',EPSG: 'EPSG:4258',},
// WMTS -> OK

const mp = new PrintViewManagement({
  isDraggable: true,
  position: 'TL',
  collapsible: true,
  collapsed: true,
  tooltip: 'Imprimir',
  serverUrl: 'https://componentes.cnig.es/geoprint',
  printStatusUrl: 'https://componentes.cnig.es/geoprint/print/status',
  defaultOpenControl: 3,
  georefImageEpsg: {
    tooltip: 'Georeferenciar imagen',
    layers: [{
        url: 'http://www.ign.es/wms-inspire/mapa-raster?',
        name: 'mtn_rasterizado',
        format: 'image/jpeg',
        legend: 'Mapa ETRS89 UTM',
        EPSG: 'EPSG:4326',
      },
      {
        url: 'http://www.ign.es/wms-inspire/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        format: 'image/jpeg',
        legend: 'Imagen (PNOA) ETRS89 UTM',
        // EPSG: 'EPSG:4258',
      },
    ],
  },
  georefImage: {
    tooltip: 'Georeferenciar imagen',
    printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/mapexport',
    printSelector: true,
    // printType: 'client', // 'client' or 'server'
  },
  printermap: {
    printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/CNIG',
    // fixedDescription: true,
    headerLegend: 'https://www.idee.es/csw-codsi-idee/images/cabecera-CODSI.png',
    filterTemplates: ['A3 Horizontal'],
    logo: 'https://www.idee.es/csw-codsi-idee/images/cabecera-CODSI.png',
  },
});


map.addPlugin(mp);

window.map = map;

// CAPAS

// const capaGeoJSON = new M.layer.GeoJSON({
//   name: 'Capa GeoJSON',
//   legend: 'Capa GeoJSON',
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application%2Fjson',
//   extract: true,
// });

// map.addLayers(capaGeoJSON);

// const capaOSM = new M.layer.OSM({
//   name: 'Capa OSM',
//   legend: 'Capa OSM',
//   transparent: true,
//   url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
//   matrixSet: 'EPSG:3857',
// });

// map.addLayers(capaOSM);


// const capaKML = new M.layer.KML({
//   url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
//   name: 'Capa KML',
//   legend: 'Capa KML',
//   extract: true,
// }, { crossOrigin: 'anonymous' });

// map.addLayers(capaKML);

// const capaMVT = new M.layer.MVT({
//   url: 'https://www.ign.es/web/resources/mapa-base-xyz/vt/{z}/{x}/{y}.pbf',
//   // layers: ['camino_lin'],
//   name: 'Capa MVT',
//   legend: 'Capa MVT',
//   projection: 'EPSG:3857',
//   extract: true,
// }, { crossOrigin: 'anonymous' });

// map.addLayers(capaMVT);

// const capaOGCAPIFeatures = new M.layer.OGCAPIFeatures({
//   url: 'https://api-features.idee.es/collections/',
//   name: 'hidrografia/Falls',
//   legend: 'Capa OGCAPIFeatures L',
//   limit: 20,
// });

// map.addLayers(capaOGCAPIFeatures);

// const capaTMS = new M.layer.TMS({
//   url: 'https://tms-mapa-raster.ign.es/1.0.0/mapa-raster/{z}/{x}/{-y}.jpeg',
//   name: 'Capa TMS',
//   legend: 'Capa TMS L',
//   projection: 'EPSG:3857',
// }, { crossOrigin: 'anonymous' });

// map.addLayers(capaTMS);

// const capaVector = new M.layer.Vector({
//   name: 'capaVector',
//   legend: 'vector legend',
//   attribution: {
//     nameLayer: 'Nombre capa',
//     name: 'Otro nombre', // se puede llamar description?
//     url: 'https://www.google.es',
//     contentAttributions: 'https://mapea-lite.desarrollo.guadaltel.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
//     contentType: 'kml',
//   },
// });
// const feature = new M.Feature('localizacion', {
//   type: 'Feature',
//   properties: { text: 'prueba' },
//   geometry: {
//     type: 'Point',
//     coordinates: [-458757.1288, 4795217.2530],
//   },
// });
// capaVector.addFeatures(feature);

// map.addLayers(capaVector);

// const capaWFS = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'Capa WFS l',
//   geometry: 'MPOLYGON',
//   attribution: {
//     nameLayer: 'Nombre capa',
//     name: 'Otro nombre', // se puede llamar description?
//     url: 'https://www.google.es',
//     contentAttributions: 'https://mapea-lite.desarrollo.guadaltel.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
//     contentType: 'kml',
//   },
// });

// map.addLayers(capaWFS);

// const capaWMS = new M.layer.WMS({
//   url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
//   name: 'AU.AdministrativeUnit',
//   legend: 'Capa WMS l',
// }, { crossOrigin: 'anonymous' });

// map.addLayers(capaWMS);


// const capaWMTS = new M.layer.WMTS({
//   url: 'https://servicios.idee.es/wmts/ocupacion-suelo',
//   name: 'LC.LandCoverSurfaces',
//   legend: 'LC.LandCoverSurfaces l',
//   matrixSet: 'GoogleMapsCompatible',
//   format: 'image/png',
// }, { crossOrigin: 'anonymous' });

// map.addLayers(capaWMTS);

// const capaXYZ = new M.layer.XYZ({
//   url: 'https://www.ign.es/web/catalogo-cartoteca/resources/webmaps/data/cresques/{z}/{x}/{y}.jpg',
//   name: 'Capa XYZ',
//   legend: 'Capa XYZ l',
//   projection: 'EPSG:3857',
// }, { crossOrigin: 'anonymous' });

// map.addLayers(capaXYZ);


// window.fetch('./cabrera.mbtiles').then((response) => {
//   const mbtile = new M.layer.MBTiles({
//     name: 'mbtiles',
//     legend: 'Capa MBTiles L',
//     source: response,
//   });
//   map.addLayers(mbtile);
//   window.mbtile = mbtile;
// }).catch((e) => {
//   throw e;
// });

// window.fetch('./countries.mbtiles').then((response) => {
//   const mbtilesvector = new M.layer.MBTilesVector({
//     name: 'mbtiles_vector',
//     legend: 'Capa MBTilesVector L',
//     source: response,
//     // maxZoomLevel: 5,
//   });
//   map.addLayers(mbtilesvector);
// }).catch((e) => {
//   throw e;
// });
