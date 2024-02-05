import { map as Mmap } from 'M/mapea';
import { wms_001 } from '../layers/wms/wms'

const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  controls: ['attributions', 'backgroundlayers'],
  // layers: [wms_001],
});

// mapa.createAttribution({
//   collectionsAttributions: ['Prueba Attribution String 1'],
// });

/*
mapa.createAttribution({
  collectionsAttributions: [
    {
      name: 'Name Prueba',
      description: 'Description Prueba',
      url: 'https://www.ign.es',
    }
  ],
});
*/

// ? Se añade una atribución al mapa
// mapa.addAttribution('Prueba Attribution String 2');
// ? Se consulta las atribuciones del mapa
// console.log(mapa.getAttributions());

// mapa.addLayers(wms_001);

window.mapa = mapa;