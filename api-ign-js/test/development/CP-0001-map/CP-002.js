import { map as Mmap } from 'M/mapea';
import { wms_001 } from '../layers/wms/wms'

const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
  controls: ['attributions*Hola'],
});

// mapa.createAttribution({
//   collectionsAttributions: ['Prueba Attribution String 1'],
// });

mapa.addAttribution('Prueba Attribution String 2');

mapa.addLayers(wms_001);

window.mapa = mapa;