import WMS from 'M/layer/WMS';

export const wms_001 = new WMS({
    url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
    name: 'AU.AdministrativeUnit',
    legend: 'Unidades Administrativas',
    // tiled: false,
    // visibility: false,
    // isBase: false,
    transparent: true,
    // attribution: {
    //     name: 'Name Prueba WMS',
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
)

export const wms_002 = 'WMS*Unidadesadministrativa*http://www.ign.es/wms-inspire/unidades-administrativas?*AU.AdministrativeUnit*false*true**1.3.0*true*true*true';
