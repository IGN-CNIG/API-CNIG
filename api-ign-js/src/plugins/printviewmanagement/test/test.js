import PrintViewManagement from 'facade/printviewmanagement';

M.language.setLang('es');

// const suelo = new M.layer.WMTS({
//   url: 'https://servicios.idee.es/wmts/ocupacion-suelo?',
//   name: 'LU.ExistingLandUse',
//   legend: 'Ocupación del suelo WMTS',
//   matrixSet: 'GoogleMapsCompatible',
//   maxZoom: 20,
//   minZoom: 4,
//   visibility: true,
// }, { crossOrigin: 'anonymous' });

const map = M.map({
  container: 'mapjs',
  zoom: 9,
  maxZoom: 20,
  minZoom: 4,
  // layers: [suelo],
  center: [-467062.8225, 4683459.6216],
});

const capaKML1 = new M.layer.KML({
  url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
  name: 'Capa KML',
  legend: 'Capa KML',
  extract: true,
}, {
  // extractStyles: false,
  // style: new M.style.Point({
  //   radius: 5,
  //   fill: {
  //     color: 'green',
  //     opacity: 0.5,
  //   },
  //   stroke: {
  //     color: '#FF0000',
  //   },
  // }),
});

map.addLayers(capaKML1);

// const capaWFS = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
//   namespace: 'sepim',
//   name: 'campamentos',
//   legend: 'Capa WFS l',
//   geometry: 'MPOINT',
// });

// map.addLayers(capaWFS);

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
  defaultOpenControl: 2,
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
    fixedDescription: true,
    headerLegend: 'data:image/png;base64,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',
    // filterTemplates: ['A3 Horizontal'],
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

const capaOSM = new M.layer.OSM({
  name: 'Capa OSM',
  legend: 'Capa OSM',
  transparent: true,
  url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  matrixSet: 'EPSG:3857',
});

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

const capaWMS = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeUnit',
  legend: 'Capa WMS l',
}, { crossOrigin: 'anonymous' });

// map.addLayers(capaWMS);


const capaWMTS = new M.layer.WMTS({
  url: 'https://servicios.idee.es/wmts/ocupacion-suelo',
  name: 'LC.LandCoverSurfaces',
  legend: 'LC.LandCoverSurfaces l',
  matrixSet: 'GoogleMapsCompatible',
  format: 'image/png',
}, { crossOrigin: 'anonymous' });

// map.addLayers(capaWMTS);

const capaXYZ = new M.layer.XYZ({
  url: 'https://www.ign.es/web/catalogo-cartoteca/resources/webmaps/data/cresques/{z}/{x}/{y}.jpg',
  name: 'Capa XYZ',
  legend: 'Capa XYZ l',
  projection: 'EPSG:3857',
}, { crossOrigin: 'anonymous' });

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
