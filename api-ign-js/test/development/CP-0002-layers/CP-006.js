import { map as Mmap } from 'M/mapea';
import { wmts_004 } from '../layers/wmts/wmts';


const mapa = Mmap({
  container: 'map',
  // projection: 'EPSG:4326*d',
  center: [-443273.10081370454, 4757481.749296248],
  zoom: 6,
  layers: ['OSM'],
  controls: ['scale', 'getfeatureinfo'],
});

mapa.addLayers([wmts_004]);


window.mapa = mapa;
