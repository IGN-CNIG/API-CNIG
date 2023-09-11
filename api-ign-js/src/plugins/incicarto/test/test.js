import Incicarto from 'facade/incicarto';

M.language.setLang('es'); // Español

const map = M.map({
  container: 'mapjs',
  center: {
    x: -667143,
    y: 4493011,
    draw: false,
  },
  projection: 'EPSG:3857*m',
  zoom: 6,
  // Capas precargadas
  /*layers: [
    //'WMTS*http://www.ideandalucia.es/geowebcache/service/wmts?*toporaster*SIG-C:25830*WMTS*false',
    //'WFS*CampamentosCampamentosCampamentosCampamentos*http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows*sepim:campamentos*POINT***eyJwYXJhbWV0ZXJzIjpbeyJpY29uIjp7ImZvcm0iOiJDSVJDTEUiLCJjbGFzcyI6ImctY2FydG9ncmFmaWEtYmFuZGVyYSIsImZvbnRzaXplIjowLjUsInJhZGl1cyI6MTUsImZpbGwiOiJ3aGl0ZSJ9LCJyYWRpdXMiOjV9XSwiZGVzZXJpYWxpemVkTWV0aG9kIjoiKChzZXJpYWxpemVkUGFyYW1ldGVycykgPT4gTS5zdHlsZS5TaW1wbGUuZGVzZXJpYWxpemUoc2VyaWFsaXplZFBhcmFtZXRlcnMsICdNLnN0eWxlLlBvaW50JykpIn0',
  ],*/
});

/**
 * Definimos algunas capas base
 */

/*const objWMTSMapa = new M.layer.WMTS({
  url: 'https://www.ign.es/wmts/mapa-raster',
  name: 'MTN',
  matrixSet: 'GoogleMapsCompatible',
  legend: 'Mapa MTN',
  format: 'image/jpeg'
});*/

/**
 * Añadimos el BackImgLayer
 */
/*const mpBIL = new M.plugin.BackImgLayer({
  position: 'TR',
  collapsible: true,
  collapsed: true,
  layerId: 0,
  layerVisibility: true,
  columnsNumber: 3,
  layerOpts: [
    // LiDAR Híbrido
    {
      id: 'pnoa-hibido',
      title: 'PNOA Híbrido',
      preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqhibrid.png',
      layers: [new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'EPSG:4326',
        transparent: true,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
      }),
      new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        matrixSet: 'EPSG:4326',
        legend: 'Mapa IGN',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/png',
      })
      ],
    },
    // PNOA Híbrido
    {
      id: 'lidar-hibrido',
      title: 'LiDAR Híbrido',
      preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqlidar.png',
      layers: [new M.layer.WMTS({
        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        name: 'EL.GridCoverageDSM',
        legend: 'Modelo Digital de Superficies LiDAR',
        matrixSet: 'EPSG:4326',
        transparent: true,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/png',
      }),
      new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseOrto',
        matrixSet: 'EPSG:4326',
        legend: 'Mapa IGN',
        transparent: true,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/png',
      })
      ],
    },
    // Mapa base
    {
      id: 'mapa',
      preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqmapa.png',
      title: 'Mapa',
      layers: [new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/ign-base?',
        name: 'IGNBaseTodo',
        legend: 'Mapa IGN',
        matrixSet: 'EPSG:4326',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
      })],
    },
    //PNOA sin textos
    {
      id: 'imagen',
      title: 'Imagen',
      preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqimagen.png',
      layers: [new M.layer.WMTS({
        url: 'https://www.ign.es/wmts/pnoa-ma?',
        name: 'OI.OrthoimageCoverage',
        legend: 'Imagen (PNOA)',
        matrixSet: 'EPSG:4326',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/jpeg',
      })],
    },
    // LiDAR sin textos
    {
      id: 'lidar',
      preview: 'https://componentes.ign.es/api-core/plugins/backimglayer/images/svqlidar.png',
      title: 'LIDAR',
      layers: [new M.layer.WMTS({
        url: 'https://wmts-mapa-lidar.idee.es/lidar?',
        name: 'EL.GridCoverageDSM',
        legend: 'Modelo Digital de Superficies LiDAR',
        matrixSet: 'EPSG:4326',
        transparent: false,
        displayInLayerSwitcher: false,
        queryable: false,
        visible: true,
        format: 'image/png',
      })],
    },
    // SIOSE
    {
      id: 'MAPAMTN',
      preview: 'img/mtnactual.jpg',
      title: 'Mapa MTN',
      layers: [objWMTSMapa],
    },
  ],
}
);

map.addPlugin(mpBIL);


const mpTOC = new M.plugin.FullTOC({
  position: 'TL',
});

map.addPlugin(mpTOC);*/



// addWMSLayer('AU.AdministrativeUnit', 'Líneas límite', 'https://www.ign.es/wms-inspire/unidades-administrativas?', '1.3.0', true, { visibility: false, displayInLayerSwitcher: true, queryable: false, zIndex: 501 });
//   addWMSLayer('Catastro', 'Catastro', 'http://ovc.catastro.meh.es/Cartografia/WMS/ServidorWMS.aspx?', '1.1.1', false, { visibility: false, displayInLayerSwitcher: true, queryable: false, zIndex: 502 });
//   addWMSLayer('Grid-ETRS89-lonlat-50k', 'Distribuidor MTN50', 'https://www.ign.es/wms-inspire/cuadriculas?', '1.3.0', false, { visibility: false, displayInLayerSwitcher: true, queryable: false, zIndex: 503 });
//   addWMSLayer('Grid-ETRS89-lonlat-25k', 'Distribuidor MTN25', 'https://www.ign.es/wms-inspire/cuadriculas?', '1.3.0', false, { visibility: false, displayInLayerSwitcher: true, queryable: false, zIndex: 504 });
//   addWMSLayer('GN.GeographicalNames', 'Topónimos', 'https://www.ign.es/wms-inspire/ign-base?', '1.3.0', true, { visibility: false, displayInLayerSwitcher: true, queryable: false, zIndex: 505 });
//   addWMSLayer('TN.RoadTransportNetwork.RoadLink', 'Vías de comunicación por carretera', 'https://www.ign.es/wms-inspire/ign-base?', '1.3.0', true, { visibility: false, displayInLayerSwitcher: true, queryable: false, zIndex: 506 });
//   addWMSLayer('TN.RailTransportNetwork.RailwayLink', 'Vías de comunicación ferroviarias', 'https://www.ign.es/wms-inspire/ign-base?', '1.3.0', true, { visibility: false, displayInLayerSwitcher: true, queryable: fals

/*const objLyrREDNAP = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/redes-geodesicas?',
  name: 'RED_NAP',
  legend: 'Red de Nivelación de Alta Precisión',
  tiled: false,
  visibility: false,
}, {});

const objLyrBDLJE = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
  name: 'AU.AdministrativeBoundary',
  legend: 'Líneas Límite',
  tiled: false,
  visibility: false,
}, {});

const objLyrRTRoads = new M.layer.WMS({
  url: 'https://servicios.idee.es/wms-inspire/transportes?',
  name: 'TN.RoadTransportNetwork.RoadLink',
  legend: 'Vías de comunicación por carretera',
  tiled: false,
  visibility: false,
}, {});

const objLyrRTRailways = new M.layer.WMS({
  url: 'https://servicios.idee.es/wms-inspire/transportes?',
  name: 'TN.RailTransportNetwork.RailwayLink',
  legend: 'Vías de comunicación por ferrocarril',
  tiled: false,
  visibility: false,
}, {});

const objLyrNGBE = new M.layer.WMS({
  url: 'https://www.ign.es/wms-inspire/ngbe?',
  name: 'GN.GeographicalNames',
  legend: 'Nombres geográficos - NGBE',
  tiled: false,
  visibility: false,
}, {});*/

// map.addLayers([objLyrREDNAP,objLyrBDLJE,objLyrRTRoads,objLyrRTRailways,objLyrNGBE]);

const mp = new Incicarto({
  position: 'TL',
  collapsed: true,
  isDraggable: true,
  collapsible: true,
  tooltip: 'Incicarto plugin',
  wfszoom: 12,
  prefixSubject: 'Incidencia cartográfica - ',
  interfazmode: 'simple', // simple, advance
  buzones: [{
      name: 'Cartografía (MTN, BTN, RT, HY, Pob, BCN, Provinciales, escalas pequeñas)',
      email: 'cartografia.ign@mitma.es',
    },
    {
      name: 'Atlas Nacional de España',
      email: 'ane@mitma.es',
    },
    {
      name: 'Fototeca',
      email: 'fototeca@cnig.es',
    },
    {
      name: 'Geodesia',
      email: 'buzon-geodesia@mitma.es',
    },
    {
      name: 'Líneas Límite Municipales',
      email: 'limites_municipales@mitma.es',
    },
    {
      name: 'Nombres geográficos',
      email: 'toponimia.ign@mitma.es',
    },
    {
      name: 'Ocupación del suelo',
      email: 'siose@mitma.es',
    },
    {
      name: 'Teledetección',
      email: 'pnt@mitma.es',
    },
    {
      name: 'Documentación histórica, Archivo, Cartoteca y biblioteca',
      email: 'documentacionign@mitma.es',
    },
    {
      name: 'Registro Central de Cartografía',
      email: 'rcc@mitma.es',
    },
    {
      name: 'Naturaleza, Cultura y Ocio',
      email: 'naturalezaculturaocio@mitma.es',
    },
    {
      name: 'Cartociudad',
      email: 'cartociudad@mitma.es',
    },
    {
      name: 'Infraestructura de Datos Espaciales',
      email: 'idee@mitma.es',
    },
    {
      name: 'Sistemas de Información Geográfica (SIGNA)',
      email: 'signa@mitma.es',
    },
    {
      name: 'Volcanología',
      email: 'volcanologia@mitma.es',
    },
    {
      name: 'Red Sísmica Nacional',
      email: 'sismologia@mitma.es',
    }
  ],
  controllist: [{
      id: 'themeList',
      name: 'Temas de errores',
      mandatory: true,
    },
    {
      id: 'errorList',
      name: 'Tipos de errores',
      mandatory: true,
    },
    {
      id: 'productList',
      name: 'Lista de productos',
      mandatory: true,
    },
  ],
  themeList: [{
      idTheme: 1,
      nameTheme: 'No especificado',
      emailTheme: 'consultas@cnig.es',
    },
    {
      idTheme: 2,
      nameTheme: 'Relieve',
      emailTheme: 'cartografia.ign@mitma.es',
    },
    {
      idTheme: 3,
      nameTheme: 'Hidrografía',
      emailTheme: 'cartografia.ign@mitma.es',
    },
    {
      idTheme: 4,
      nameTheme: 'Edificaciones',
      emailTheme: 'cartografia.ign@mitma.es',
    },
    {
      idTheme: 5,
      nameTheme: 'Carretera',
      emailTheme: 'cartociudad@mitma.es',
    },
    {
      idTheme: 6,
      nameTheme: 'Camino o senda',
      emailTheme: 'cartociudad@mitma.es',
    },
    {
      idTheme: 7,
      nameTheme: 'Ferrocarriles',
      emailTheme: 'cartociudad@mitma.es',
    },
    {
      idTheme: 8,
      nameTheme: 'Topónimo o nombre geográfico',
      emailTheme: 'toponimia.ign@mitma.es',
    },
    {
      idTheme: 9,
      nameTheme: 'Límite de CCAA o municipio',
      emailTheme: 'limites_municipales@mitma.es',
    },
    {
      idTheme: 10,
      nameTheme: 'Pruebas',
      emailTheme: 'danielleon@guadaltel.com',
    },
    {
      idTheme: 11,
      nameTheme: 'Pruebas Guadaltel/DVM',
      emailTheme: 'esteban.emolin@gmail.com',
    },
    {
      idTheme: 12,
      nameTheme: 'Pruebas IGN',
      emailTheme: 'aurelio.aragon@cnig.es',
    },
    {
      idTheme: 13,
      nameTheme: 'Pruebas Carmen',
      emailTheme: 'carmenmarquez@guadaltel.com',
    }
  ],
  errorList: [
    'No especificado',
    'Omisión',
    'Comisión',
    'Clasificación',
    'Nombre',
    'Valor del atributo',
    'Forma',
    'Localización',
    'Otros',
  ],
  productList: [
    'No especificado',
    'Serie MTN25',
    'Serie MTN50',
    'BTN25',
    'BTN100',
    'MP200',
    'BCN200',
    'BCN500',
    'Mapa Autonómico',
    'Mapa España 1:500 000',
    'Mapa España 1:1 000 000',
    'Cartociudad',
    'Redes de Transporte',
    'Hidrografía',
    'Poblaciones',
    'Mundo real',
    'IGN Base',
    'Otros productos',
  ],
});

/*const mp2 = new M.plugin.Infocoordinates({
  position: 'TR',
  decimalGEOcoord: 4,
  decimalUTMcoord: 4,
});

const mp3 = new M.plugin.Information({
  position: 'TR',
  buffer: 100,
});

const mp4 = new M.plugin.MeasureBar({ position: 'TR' });

const provincias = new M.layer.WFS({
  url: "http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?",
  namespace: "tematicos",
  name: "Provincias",
  legend: "Provincias",
  geometry: 'MPOLYGON',
});

const viales = new M.layer.WFS({
  url: "http://g-gis-online-lab.desarrollo.guadaltel.es/geoserver/ggiscloud_root/wms?",
  namespace: "ggiscloud_root",
  name: "a1585302352391_viales_almeria",
  legend: "Viales",
  geometry: 'LINE',
});

//map.addWFS(provincias);
//map.addWFS(viales);
map.addPlugin(mp2);
map.addPlugin(mp3);
map.addPlugin(mp4);*/

map.addPlugin(mp);
// map.addPlugin(new M.plugin.MeasureBar({ position: 'TR' }));
window.map = map;
