import Attributions from 'facade/attributions';

const map = M.map({
  container: 'mapjs',
  controls: ['layerswitcher', 'panzoombar', 'overviewmap',
    'scale', 'location', 'mouse', 'getfeatureinfo',
  ],
  zoom: 4,
});

window.map = map;

const mp = new Attributions({
  mode: 1,
  scale: 10000,
  defaultURL: 'http://www.ign.es/',
  defaultAttribution: 'Instituto Geográfico Nacional',
  position: 'BL',
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
