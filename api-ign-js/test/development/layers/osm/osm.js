import OSM from 'M/layer/OSM';

export const osm = new OSM({
  name: 'OSM',
  legend: 'OSM',
  url: 'https://a.tile.openstreetmap.org/{z}/{x}/{y}.png',
  matrixSet: 'EPSG:3857',
  //   isBase: true,
  //   transparent: false,
  // attribution: {
  //     name: 'Name Prueba OSM',
  //     description: 'Description Prueba',
  //     url: 'https://www.ign.es',
  //     contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //     contentType: 'kml',
  //   },
}, 
// {
//   minZoom: 5,
//   maxZoom: 10
// }
);

export const osm_002 = 'OSM';

export const osm_003 = 'OSM*Capa*OSM';
