import XYZ from 'M/layer/XYZ';

export const xyz_001 = new XYZ({
  url: 'https://www.ign.es/web/catalogo-cartoteca/resources/webmaps/data/cresques/{z}/{x}/{y}.jpg',
  name: 'AtlasDeCresques',
  projection: 'EPSG:3857',
  // visibility: true,
   isBase: true,
  // transparent: true,
  // attribution: {
  //   name: 'Name Prueba XYZ',
  //   description: 'Description Prueba',
  //   url: 'https://www.ign.es',
  //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //   contentType: 'kml',
  // },
}, 
// {
//   minZoom: 5,
//   maxZoom: 10
// }
);

export const xyz_002 = 'XYZ*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*true';
