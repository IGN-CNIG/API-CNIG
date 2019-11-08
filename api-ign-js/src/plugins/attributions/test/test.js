import Attributions from 'facade/attributions';

const map = M.map({
  container: 'mapjs',
  controls: ['scale'],
  zoom: 4,
});

window.map = map;

M.config.attributions.defaultAttribution = 'Ministerio de Justicia';
M.config.attributions.defaultURL = 'https://mapadefosas.mjusticia.es';


const mp = new Attributions({
  mode: 1,
  scale: 25000,
  url: 'https://componentes.ign.es/NucleoVisualizador/vectorial_examples/atribucion.kml',
  type: 'kml',
});
map.addPlugin(mp);

// {
//   mode,
//   layer,
//   url,
//   type,
//   zoom,
//   minWidth,
//   defaultAttribution
//   position 'TL', 'TR', 'BL' , 'BR'
//
// }
