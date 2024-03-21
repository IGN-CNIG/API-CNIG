import TMS from 'M/layer/TMS';

export const tms_001 = new TMS({
  url: 'https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg',
  name: 'TMSBaseIGN',
  projection: 'EPSG:3857',
  legend: 'Capa TMS',
  minZoom: 5,
  maxZoom: 9,
  tileGridMaxZoom: 10,
  // tileSize: 50,
  // maxExtent: [-1259872.4694101033, 4359275.566199489, -85799.71494979598, 4620384.454821652],
  // visibility: false,
  // visibility: true,
  transparent: false,
  // transparent: true,
  // isBase: false,
  // isBase: true,
  // attribution: {
  //   name: 'Name Prueba TMS',
  //   description: 'Description Prueba',
  //   url: 'https://www.ign.es',
  //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //   contentType: 'kml',
  // }
  // crossOrigin: true,
  crossOrigin: 'anonymous',
  // displayInLayerSwitcher: false,
  // displayInLayerSwitcher: true,
}, {
  // opacity: 0,
  // opacity: 0.5,
  // opacity: 1,
  // displayInLayerSwitcher: false,
  // displayInLayerSwitcher: true,
}, {

},
);

// ERROR: No funcionan los niveles de zooom maximo y minimo

export const tms_002 = 'TMS*TMSBaseIGNRest*https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg*true*false*17***anonymous';
