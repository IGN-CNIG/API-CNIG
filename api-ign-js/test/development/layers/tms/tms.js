import TMS from 'M/layer/TMS';

export const tms_001 = new TMS({
  url: 'https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg',
  name: 'TMSBaseIGN',
  projection: 'EPSG:3857',
  legend: 'Capa TMS',
  // visibility: true,
  // transparent: false,
  isBase: false,
  // attribution: {
  //   name: 'Name Prueba TMS',
  //   description: 'Description Prueba',
  //   url: 'https://www.ign.es',
  //   contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //   contentType: 'kml',
  // }
}, {
  crossOrigin: 'anonymous',
  // minZoom: 5,
  // maxZoom: 10
});

export const tms_002 = 'TMS*TMSBaseIGNRest*https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg*true*false*17***anonymous';
