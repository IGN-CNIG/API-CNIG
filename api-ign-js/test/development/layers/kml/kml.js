/* eslint-disable camelcase */
import KML from 'M/layer/KML';

export const kml_001 = new KML({
  url: 'https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml',
  name: 'capaKML',
  // extract: true,
  // isBase: true,
  // transparent: false,
  // attribution: {
  //     name: 'Name Prueba KML',
  //     description: 'Description Prueba',
  //     url: 'https://www.ign.es',
  //     contentAttributions: 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml',
  //     contentType: 'kml',
  //   }
},
// {
//   minZoom: 5,
//   maxZoom: 10
// }
);

export const kml_002 = new KML({
  url: 'https://www.ign.es/resources/CaminoDeSantiago_PRE/rutas/04/04-Via%20de%20la%20Plata%20-%20Camino%20Moz%C3%A1rabe%20a%20Santiago.kml',
  name: 'routeKmlLayer',
  extract: true,
});
