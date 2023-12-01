import WMS from 'M/layer/WMS';

export const wms_001 = new WMS({
    url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
    name: 'AU.AdministrativeUnit',
    legend: 'Unidades Administrativas',
    // tiled: false,
    // visibility: false,
    // isBase: true,
    // transparent: false,
}, {})
