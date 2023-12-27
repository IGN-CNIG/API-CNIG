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

const PRECHARGED = {
  services: [{
      name: 'Camino de Santiago',
      type: 'WMS',
      url: 'https://www.ign.es/wms-inspire/camino-santiago',
    },
    {
      name: 'Redes Geodésicas',
      type: 'WMS',
      url: 'https://www.ign.es/wms-inspire/redes-geodesicas',
    },
    {
      name: 'Planimetrías',
      type: 'WMS',
      url: 'https://www.ign.es/wms/minutas-cartograficas',
    },
  ],
  groups: [{
      name: 'Cartografía',
      services: [{
          name: 'Mapas',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/mapa-raster?',
        },
        {
          name: 'Callejero ',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/ign-base?',
        },
        {
          name: 'Primera edición MTN y Minutas de 1910-1970',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/primera-edicion-mtn?',
        },
        {
          name: 'Planimetrías (1870 y 1950)',
          type: 'WMS',
          url: 'https://www.ign.es/wms/minutas-cartograficas?',
        },
        {
          name: 'Planos de Madrid (1622 - 1960)',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/planos?',
        },
        {
          name: 'Hojas kilométricas (Madrid - 1860)',
          type: 'WMS',
          url: 'https://www.ign.es/wms/hojas-kilometricas?',
        },
        {
          name: 'Cuadrículas Mapa Topográfico Nacional',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/cuadriculas?',
        },

      ],
    },
    {
      name: 'Imágenes',
      services: [{
          name: 'Ortofotos máxima actualidad PNOA',
          type: 'WMTS',
          url: 'https://www.ign.es/wmts/pnoa-ma?',
        },
        {
          name: 'Ortofotos históricas y PNOA anual',
          type: 'WMS',
          url: 'https://www.ign.es/wms/pnoa-historico?',
        },
        {
          name: 'Ortofotos provisionales PNOA',
          type: 'WMS',
          url: 'https://wms-pnoa.idee.es/pnoa-provisionales?',
        },
        {
          name: 'Mosaicos de satélite',
          type: 'WMS',
          url: 'https://wms-satelites-historicos.idee.es/satelites-historicos?',
        },
        {
          name: 'Fototeca (Consulta de fotogramas históricos y PNOA)',
          type: 'WMS',
          url: 'https://wms-fototeca.idee.es/fototeca?',
        },
      ],
    },
    {
      name: 'Información geográfica de referencia y temática',
      services: [{
          name: 'Catastro ',
          type: 'WMS',
          url: 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?',
        },
        {
          name: 'Unidades administrativas',
          type: 'WMS',
          url: ' https://www.ign.es/wms-inspire/unidades-administrativas?',
        },
        {
          name: 'Nombres geográficos (Nomenclátor Geográfico Básico NGBE)',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/ngbe?',
        },
        {
          name: 'Redes de transporte',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/transportes?',
        },
        {
          name: 'Hidrografía ',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/hidrografia?',
        },
        {
          name: 'Direcciones y códigos postales',
          type: 'WMS',
          url: 'https://www.cartociudad.es/wms-inspire/direcciones-ccpp?',
        },
        {
          name: 'Ocupación del suelo (Corine y SIOSE)',
          type: 'WMTS',
          url: 'https://servicios.idee.es/wmts/ocupacion-suelo?',
        },
        {
          name: 'Ocupación del suelo Histórico (Corine y SIOSE)',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/ocupacion-suelo-historico?',
        },
        {
          name: 'Copernicus Land Monitoring Service',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms/copernicus-landservice-spain?',
        },
        {
          name: 'Información sísmica (terremotos)',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/geofisica?',
        },
        {
          name: 'Red de vigilancia volcánica',
          type: 'WMS',
          url: 'https://wms-volcanologia.ign.es/volcanologia?',
        },
        {
          name: 'Redes geodésicas',
          type: 'WMS',
          url: 'https://www.ign.es/wms-inspire/redes-geodesicas?',
        },
      ],
    },
    {
      name: 'Modelos digitales de elevaciones',
      services: [{
          name: 'Modelo Digital de Superficies (Sombreado superficies y consulta de elevaciones edificios y vegetación)',
          type: 'WMTS',
          url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        },
        {
          name: 'Modelo Digital del Terreno (Sombreado terreno y consulta de altitudes)',
          type: 'WMTS',
          url: 'https://servicios.idee.es/wmts/mdt?',
          white_list: ['EL.ElevationGridCoverage'],
        },
        {
          name: 'Curvas de nivel y puntos acotados',
          type: 'WMS',
          url: 'https://servicios.idee.es/wms-inspire/mdt?',
          white_list: ['EL.ContourLine', 'EL.SpotElevation'],
        },
      ],
    },

  ],
};

const mp = new Layerswitcher({
  collapsed: false,
  position: 'TL',
  tooltip: 'Capas',
  collapsible: true,
  isDraggable: true,
  modeSelectLayers: 'eyes',
  // tools: [],
  tools: ['transparency', 'zoom', 'legend', 'information', 'style', 'delete'],
  // tools: ['transparency', 'legend', 'zoom', 'information', 'style', 'delete'],
  isMoveLayers: true,
  precharged: PRECHARGED,
  https: true,
  http: true,
  showCatalog: true,
  useProxy: true,
});
map.addPlugin(mp);

// CAPAS
// M.proxy(false);
const capaGeoJSON = new M.layer.GeoJSON({
  name: 'Capa GeoJSON',
  legend: 'Capa GeoJSON',
  url: 'http://localhost:6123/test/features.json',
  // url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application%2Fjson',
  extract: true,
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
  properties: { text: 'prueba' },
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

const generic_001 = new M.layer.Generic({}, {}, new ol.layer.Image({
  source: new ol.source.ImageWMS({
    url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/wms?',
    params: { LAYERS: 'tematicos:Municipios' },
  }),
}));

const generic_002 = new M.layer.Generic({}, {}, new ol.layer.Vector({
  source: new ol.source.Vector({
    format: new ol.format.GeoJSON(),
    url: 'https://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application%2Fjson',
    strategy: ol.loadingstrategy.bbox,
  }),
}));



// map.addLayers(capaGeoJSON);
// map.getMapImpl().on('moveend', () => {
//   map.removeLayers([capaGeoJSON]);
//   capaGeoJSON = new M.layer.GeoJSON({
//     name: 'Capa GeoJSON',
//     legend: 'Capa GeoJSON',
//     url: 'http://localhost:6123/test/features.json',
//     // url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application%2Fjson',
//     extract: true,
//   });
//   map.addLayers(capaGeoJSON);
// });

// map.addLayers(generic_001);
map.addLayers(generic_002);
// map.addLayers(capaOSM);
window.capaOSM = capaOSM;
// map.addLayers(capaKML);
window.capaKML = capaKML;
// map.addLayers(capaMVT);
// map.addLayers(capaOGCAPIFeatures);
window.capaOGCAPIFeatures = capaOGCAPIFeatures;
// map.addLayers(capaTMS);
// map.addLayers(capaVector);
// capaVector.addFeatures(feature);
// map.addLayers(capaWFS);
window.capaWFS = capaWFS;
// map.addLayers(capaWMS);
// map.addLayers(capaWMTS);
// map.addLayers(capaXYZ);

window.map = map;
window.capaGeoJSON = capaGeoJSON;
window.capaKML = capaKML;

// const capa = new M.layer.GeoJSON({
//   name: "capaJson",
//   source: {
//     "type": "FeatureCollection",
//     "features": [{
//       "properties": {
//         "estado": 1,
//         "vendor": {
//           "mapea": {}
//         },
//         "sede": "/Sevilla/CHGCOR003-Oficina de la zona regable del Genil",
//         "tipo": "ADSL",
//         "name": "/Sevilla/CHGCOR003-Oficina de la zona regable del Genil"
//       },
//       "type": "Feature",
//       "geometry": {
//         "type": "Point",
//         "coordinates": [-5.278075, 37.69374444444444]
//       }
//     }],
//     "crs": {
//       "properties": {
//         "name": "EPSG:4326"
//       },
//       "type": "name"
//     }
//   }
// });

// map.addLayers(capa);

// const mbtile = new M.layer.MBTiles({
//   name: 'mbtilesLoadFunction',
//   legend: 'Capa personalizada MBTiles',
//   tileLoadFunction: (z, x, y) => {
//     return new Promise((resolve) => {
//       if (z > 4) {
//         resolve('https://cdn-icons-png.flaticon.com/512/4616/4616040.png');
//       } else {
//         resolve('https://cdn.icon-icons.com/icons2/2444/PNG/512/location_map_pin_direction_icon_148665.png');
//       }
//     });
//   },
// });
// map.addLayers(mbtile);

// const mbtileVector = new M.layer.MBTilesVector({
//   name: 'mbtilesvector',
//   legend: 'Capa personalizada MBTilesVector',
//   tileLoadFunction: (z, x, y) => {
//     return new Promise((resolve) => {
//       window.fetch(`https://ahocevar.com/geoserver/gwc/service/tms/1.0.0/ne:ne_10m_admin_0_countries@EPSG%3A900913@pbf/${z}/${x}/${y}.pbf`).then((response) => {
//         resolve(response.arrayBuffer());
//       });
//     });
//   },
// });
// map.addLayers(mbtileVector);

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
