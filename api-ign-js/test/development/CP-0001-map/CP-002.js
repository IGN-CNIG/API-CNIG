import { map as Mmap } from 'M/mapea';

const mapa = Mmap({
  container: 'map',
  projection: 'EPSG:3857*m',
});

mapa.createAttribution({
  collectionsAttributions: ['Prueba Attribution String 1'],
});

mapa.addAttribution({
  collectionsAttributions: ['Prueba Attribution String 2'],
});