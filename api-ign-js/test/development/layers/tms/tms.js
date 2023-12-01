import TMS from 'M/layer/TMS';

export const tms_001 = new TMS({
    url: 'https://tms-ign-base.ign.es/1.0.0/IGNBaseTodo/{z}/{x}/{-y}.jpeg',
    name: 'TMSBaseIGN',
    projection: 'EPSG:3857',
    // visibility: true,
    // isBase: true,
    // transparent: false,
  });

