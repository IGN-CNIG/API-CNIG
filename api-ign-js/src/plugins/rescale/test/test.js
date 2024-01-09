import Rescale from 'facade/rescale';

M.language.setLang('es');


// const map = M.map({
//   container: 'mapjs',
//   controls: ['scale*true'],
//   zoom: 4,
//   maxZoom: 18,
//   minZoom: 4,
//   center: [-363801.6403681238, 4147987.099271644],
// });

const map = M.map({
  container: 'mapjs',
  controls: ['scale*true'],
  // bbox:  [-2485874.09002167, 3070874.568008104, 1629660.3577912687, 5598069.939868236],
  center: [-428106.86611520057, 4334472.25393817],
  resolutions: [51444.18059766173, 25722.090298830866, 12861.045149415433,
    6430.522574707717, 3215.2612873538583, 1607.6306436769291, 803.8153218384646,
    401.9076609192323, 200.95383045961614, 100.47691522980807, 50.238457614904036,
    25.119228807452018, 12.559614403726009, 6.2798072018630045, 3.1399036009315022,
    1.5699518004657511, 0.7849759002328756, 0.3699518004657511, 0.18497590023287555,
  ],
  zoom: 4,
  minZoom: 4,
});


const mp = new Rescale({
  collapsible: true,
  collapsed: true,
  position: 'TL',
  tooltip: 'Rescale',
});

map.addPlugin(mp);

window.map = map;
