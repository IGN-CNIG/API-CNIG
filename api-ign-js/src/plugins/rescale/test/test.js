import Rescale from 'facade/rescale';

M.language.setLang('es');
// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  controls: ['scale*true'],
  minZoom: 4, zoom: 4,
  center: [-428106, 4334472],
  // maxZoom: 18, center: [-363801.6403681238, 4147987.099271644],
  // bbox: [-2485874.09002167, 3070874.568008104, 1629660.3577912687, 5598069.939868236],
  /* /
  resolutions: [51444.18059766173, 25722.090298830866, 12861.045149415433,
    6430.522574707717, 3215.2612873538583, 1607.6306436769291, 803.8153218384646,
    401.9076609192323, 200.95383045961614, 100.47691522980807, 50.238457614904036,
    25.119228807452018, 12.559614403726009, 6.2798072018630045, 3.1399036009315022,
    1.5699518004657511, 0.7849759002328756, 0.3699518004657511, 0.18497590023287555,
  ], // */
});

const mp = new Rescale({
  collapsible: true,
  collapsed: true,
  position: 'TL', // 'TL' | 'TR' | 'BR' | 'BL'
  // tooltip: 'TOOLTIP TEST Rescale',
});
map.addPlugin(mp); window.map = map;

// Lista de errores encontrados

// 1 - ERROR, En "rescale/src/facade/js/rescalecontrol.js" zoomToInputScale usa el siguiente transformado "const writtenScale = e.target.value.trim().replace(/ /g, '').replace(/\./g, '').replace(/,/g, '');"
// Se puede reemplazar por esto que es más rápido "const writtenScale = e.target.value.replace(/1:| |\.|,/g, '');", a la vez que se podría quitar la prueba regex de "1:" dejando solo el regex de cadena de números simples para comprobarlo.
// Podría no se intencionado el diseño de esto ya que en caso de introducir "3.000,524" se interpreta como "3000524" en vez de "3000" que en este caso es más apropiado. Se podría impedir esto con atributo "pattern" en el input con esos números diseñados por regex, si se añade al css #m-rescale-scaleinput:invalid se puede cambiar el color si es erróneo para que se entienda porque no se pueda lanzar, el problema es que el copiado y pegado no funcionarían bien en ese caso si tienen puntos, comas o otros símbolos.
