import Printer from 'facade/printer';

const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
  // wmcfiles: ['cdau'],
});

// const layerinicial = new M.layer.WMS({
//   url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
//   name: 'AU.AdministrativeBoundary',
//   legend: 'Limite administrativo',
//   tiled: false,
// }, {});

// const campamentos = new M.layer.GeoJSON({
//   name: 'Campamentos',
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?service=WFS&version=1.0.0&request=GetFeature&typeName=sepim:campamentos&outputFormat=application/json&',
//   extract: true,
// });

/* Pruebas */

// SE DEBEN AÑADIR LOS SIGUIENTES DOMINIOS AL YAML PARA QUE FUNCIONEN

// /* Estilo básico */
// const layer2 = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'Provincias',
//   geometry: 'MPOLYGON',
//   ids: '3,4',
// });

// /* Estilo con textos */
// const arboleda = 'KML*Arboleda*http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml*true';
// // new M.layer.KML({
// //   url: 'http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml',
// //   name: 'Arboleda',
// //   extract: true,
// //   transparent: false,
// // });
// // 'KML*Arboleda*http://mapea4-sigc.juntadeandalucia.es/files/kml/arbda_sing_se.kml*true';

// /* Varios estilos puntos: si fallan, es por límite de tamaño de Mapfish */

// const layer = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/sepim/ows?',
//   namespace: 'sepim',
//   name: 'EstructuraJA',
//   legend: 'Menores de 15 años por provincia',
//   geometry: 'MPOLYGON',
// });

// const provincias = new M.layer.WFS({
//   url: 'http://geostematicos-sigc.juntadeandalucia.es/geoserver/tematicos/ows?',
//   namespace: 'tematicos',
//   name: 'Provincias',
//   legend: 'Provincias',
//   geometry: 'MPOLYGON',
// });

// const estiloProvincias = new M.style.Polygon({
//   stroke: {
//     color: '#FF0000',
//     width: 1,
//   },
// });

// provincias.setStyle(estiloProvincias);

// const styleProp = new M.style.Point({
//   fill: {
//     color: '#000000',
//   },
//   stroke: {
//     color: '#FFFFFF',
//     width: 2,
//   },
//   label: {
//     text: '{{id}}',

//     offset: [0, 20],
//     stroke: {
//       color: 'yellow',
//       width: 2,
//     },
//   },
// });
// layer.setStyle(styleProp);

/* Fin pruebas */

const mp = new Printer({
  collapsed: true,
  collapsible: true,
  position: 'TR',
});

map.addPlugin(mp);
// map.addLayers([campamentos, layerinicial, layer2, layer, provincias, arboleda]);

window.map = map;
