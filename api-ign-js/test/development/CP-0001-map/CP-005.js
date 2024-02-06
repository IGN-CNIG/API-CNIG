import { map as Mmap } from 'M/mapea';


const mapa = Mmap({
  container: 'map',
  controls: ['scale'],
  viewExtent: [-2658785.5918715713, 4280473.583969865, 2037505.425969658, 5474114.217671178]
});

window.mapa = mapa;
