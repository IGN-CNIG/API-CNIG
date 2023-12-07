import WMS from 'M/layer/WMS';

export const wms_001 = new WMS({
    url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
    name: 'AU.AdministrativeUnit',
    legend: 'Unidades Administrativas',
    // tiled: false,
    // visibility: false,
    // isBase: true,
    // transparent: false,
    // attribution: {
    //     name: 'Name Prueba WMS',
    //     description: 'Description Prueba',
    //     url: 'https://www.ign.es',
    //     contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
    //     contentType: 'kml',
    //   },
}, {})
