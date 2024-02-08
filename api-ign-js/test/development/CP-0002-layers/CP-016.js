import { map as Mmap } from 'M/mapea';
import { cog_001, cog_002, cog_003, cog_004 } from '../layers/cog/cog';


const mapa = Mmap({
  container: 'map',
  // projection: 'EPSG:4326*d',
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
  layers: ['OSM'],
  controls: ['scale', 'getfeatureinfo'],
});

mapa.addLayers([cog_001, cog_002, cog_003, cog_004]);


window.mapa = mapa;
