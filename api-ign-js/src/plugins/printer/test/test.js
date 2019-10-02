import Printer from 'facade/printer';

const map = M.map({
  container: 'mapjs',
  // wmcfiles: ['cdau'],
});

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

// const provincias = new M.layer.GeoJSON({
//   name: 'Provincias',
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=tematicos:Provincias&maxFeatures=50&outputFormat=application/json',
//   extract: true,
// });


// const layerGroup1 = new LayerGroup({
//   id: 'id_grupo_1',
//   title: 'Grupo 1',
//   collapsed: true,
//   zIndex: 100000,
//   children: [provincias, campamentos],
//   order: 0,
// });


// const capaWMS = new M.layer.WMS({
//   url: 'https://www.ideandalucia.es/services/andalucia/wms?',
//   name: '05_Red_Viaria',
//   legend: 'Red Viaria',
//   transparent: true,
//   tiled: false,
// });

// const layer = new WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'Provincias',
//   geometry: 'MPOLYGON',
//   ids: '3,4',
// });

// const arboleda = new KML({
//   url: 'http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml',
//   name: 'Arboleda',
//   extract: true,
// });

// const layerWMTS = new WMTS({
//   url: 'http://www.ideandalucia.es/geowebcache/service/wmts',
//   name: 'toporaster',
//   matrixSet: 'EPSG:25830',
//   legend: 'Toporaster',
// });

// const printer = new Printer({
//   url: 'https://geoprint.desarrollo.guadaltel.es/print/SIGC',
//   params: {
//     layout: {
//       outputFilename: 'mapea_${yyyy-MM-dd_hhmmss}',
//     },
//     pages: {
//       clientLogo: 'http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif',
//       creditos: 'Impresión generada a través de Mapea',
//     },
//     parameters: {
//       imagenCoordenadas: 'file://E01_logo_IGN_CNIG.png',
//       imagenEscala: 'file://E01_logo_IGN_CNIG.png',
//     },
//   },
// }, {
//   options: {
//     legend: 'true',
//   },
// });

const mp = new Printer({
  position: 'BR',
  url: 'https://geoprint.desarrollo.guadaltel.es/print/CNIG',
  params: {
    layout: {
      outputFilename: 'mapea_${yyyy-MM-dd_hhmmss}',
    },
    pages: {
      clientLogo: 'http://www.juntadeandalucia.es/economiayhacienda/images/plantilla/logo_cabecera.gif',
      creditos: 'Impresión generada a través de Mapea',
    },
    parameters: {
      imageSpain: 'file://E01_logo_IGN_CNIG.png',
      imageCoordinates: 'file://E01_logo_IGN_CNIG.png',
    },
  },
}, {
  options: {
    legend: 'true',
  },
});

map.addPlugin(mp);
map.addLayers([campamentos, layerinicial]);

window.map = map;
