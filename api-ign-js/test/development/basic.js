import { map as Mmap } from 'M/mapea';

const mapjs = Mmap({
  container: 'map',
  controls: ['rotate'],
});
window.mapjs = mapjs;
