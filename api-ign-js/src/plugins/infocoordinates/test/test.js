import Infocoordinates from 'facade/infocoordinates';

const map = M.map({
  container: 'mapjs',
  zoom: 7,
  center: [-467062.8225, 4783459.6216],

});


M.language.setLang('es');

const mp = new Infocoordinates({
  position: 'TR',
  collapsed: true,
  collapsible: true,
  tooltip: 'Información de coordenadas',
  decimalGEOcoord: 4,
  decimalUTMcoord: 4,
  helpUrl: 'https://www.ign.es/',
  outputDownloadFormat: 'txt'
});

/*const mp2 = new M.plugin.Information({
  position: 'TR',
  buffer: 100,
});

const mp3 = new M.plugin.Vectors({
  collapsed: true,
  collapsible: true,
  position: 'TR',
  wfszoom: 12,
});

const mp4 = new M.plugin.MeasureBar({ position: 'TR' });
*/

map.addPlugin(mp);
// map.addPlugin(mp2);
// map.addPlugin(mp3);
// map.addPlugin(mp4);
// map.addPlugin(new M.plugin.FullTOC({
//   precharged: {
//       groups: [{
//               name: 'Hidrografía',
//               services: [{
//                   name: 'IDEE Hidrografía',
//                   type: 'WMS',
//                   url: 'http://servicios.idee.es/wms-inspire/hidrografia?',
//                   white_list: ['HY.PhysicalWaters.Waterbodies', 'HY.PhysicalWaters.Wetland', 'HY.PhysicalWaters.Catchments'],
//               }, ],
//           },
//           {
//               name: 'Transporte',
//               services: [{
//                       name: 'IDEE - Red de transporte',
//                       type: 'WMS',
//                       url: 'http://servicios.idee.es/wms-inspire/transportes?',
//                   },
//                   {
//                       name: 'ADIF - Red de transporte ferroviario',
//                       type: 'WMS',
//                       url: 'http://ideadif.adif.es/services/wms?',
//                   },
//               ],
//           },
//       ],
//       services: [{
//               name: 'Camino de Santiago',
//               type: 'WMS',
//               url: 'https://www.ign.es/wms-inspire/camino-santiago',
//           },
//           {
//               name: 'Redes Geodésicas',
//               type: 'WMS',
//               url: 'https://www.ign.es/wms-inspire/redes-geodesicas',
//           },
//           {
//               name: 'Planimetrías',
//               type: 'WMS',
//               url: 'https://www.ign.es/wms/minutas-cartograficas',
//           },
//           {
//             name: 'Límites Administrativos',
//             type: 'WMS',
//             url: 'http://www.ign.es/wms-inspire/unidades-administrativas',
//           },
//       ],
//   },
// }));

window.map = map;
