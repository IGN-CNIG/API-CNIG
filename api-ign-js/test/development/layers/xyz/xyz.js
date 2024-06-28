/* eslint-disable camelcase */
import XYZ from 'M/layer/XYZ';

export const xyz_001 = new XYZ({
  url: 'https://www.ign.es/web/catalogo-cartoteca/resources/webmaps/data/cresques/{z}/{x}/{y}.jpg',
  name: 'AtlasDeCresques',
  projection: 'EPSG:3857',
  legend: 'Leyenda XYZ',
  maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
  // tileSize: 256,
  // tileSize: 2048,
  // visibility: false,
  // visibility: true,
  // isBase: false,
  // isBase: true,
  // transparent: false,
  // transparent: true,
  // tileGridMaxZoom: 5,
  // displayInLayerSwitcher: false,
  // displayInLayerSwitcher: true,
  // attribution: {
  //   name: 'Name Prueba XYZ',
  //   description: 'Description Prueba',
  //   url: 'https://www.ign.es',
  //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //   contentType: 'kml',
  // },
}, {
  minZoom: 5,
  maxZoom: 10,
  // opacity: 0,
  // opacity: 0.5,
  // opacity: 1,
  // crossOrigin: true,
  // crossOrigin: 'anonymous',
  // displayInLayerSwitcher: false,
  // displayInLayerSwitcher: true,
}, {

});

export const xyz_002 = 'XYZ*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*true';
