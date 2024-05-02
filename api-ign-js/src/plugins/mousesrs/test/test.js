import MouseSRS from 'facade/mousesrs';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  projection: 'EPSG:3857*m',
  // controls: ['backgroundlayers', 'scale'],
  center: [-443729, 4860856],
  zoom: 8,
});
window.map = map;

const mp = new MouseSRS({
  activeZ: true, // Añade altitud a las coordenadas
  geoDecimalDigits: 6, // Decimales de 'EPSG:4326', 'EPSG:4083', 'EPSG:4258' y 'EPSG:3857'
  utmDecimalDigits: 2, // Decimales de 'EPSG:25829', 'EPSG:25830' y 'EPSG:25831'
  label: 'EPSG:4326', // Solo se visualiza inicialmente, tras modificar se asigna label apropiado de la selección.
  srs: 'EPSG:4326', // 'EPSG:4326' | 'EPSG:4083' | 'EPSG:25829' | 'EPSG:25830' | 'EPSG:25831' | 'EPSG:4258' | 'EPSG:3857'
  // label: 'EPSG:31370', srs: 'EPSG:31370', // Prueba con SRS no existente en las opciones, termina con default
  precision: 3, // Default si en caso no hay geoDecimalDigits o utmDecimalDigits indicado.
  // tooltip: 'Prueba Observación Punto con Plugin',
  helpUrl: 'https://www.ign.es/', // si no se incluye no se añade tampoco.
  epsgFormat: false, // Utilizar otra forma de descripción de label
  draggableDialog: true, // Activa dragging sobre el popup que aparece para escoger EPSG
  order: 1,
});
map.addPlugin(mp); window.mp = mp;

// Lista de errores encontrados

// 1 - ERROR, los nombres de las variables asignados tienen "_" al final, se usa también las mismas sin "_", si no me equivoco se aplican los dos tipos con esa misma variable porque hay un get de estas variables sin "_", pero no funcionarían para set. Desconozco si sería mejor idea o no cambiarlos para dejarlos más claros.
// Por ejemplo esta el get de position pero este parámetro no existe porque aquí es siempre en el bottom, el top esta configurado así ".m-control.m-container.m-mousesrs-container { ... top: calc(100vh - 35px); ..." si se añade el parámetro, si configurá "top:5px" se puede dejar arriba también.
// Posiblemente las opciones de posición serían "BC" | "TC" con el default bottom("BC). para que se comporte igual. Sería necesarios añadir css de ".m-control.m-container.m-mousesrs-container.topMousesrs{top:5px;}" y poner en el template de "import template from '../../templates/mousesrs'" esta nueva clase según cual se quiere usar en el "createView" con "const html = M.template.compileSync(template, {..." por ejemplo con "position: this.position === 'TC' ? '.topMousesrs' : ''," si se envía la posición a esta clase también. Se observa que también se quita este plugin del HTML con "@media (max-width: 768px) { .m-control.m-container.m-mousesrs-container { display: none;..." por lo que podría ser mejor idea prever como se puede dejar visible aquí, la razón de porque se quita es porque el control de "scale" ocupa la misma posición por lo que es normal que se quite para no dejar solapado.

// 2 - ERROR, el "activeZ" que muestra la altitud solo empieza a mostrarlo tras hacer zoom o mover el mapa, antes de esto no se hace nada para mostrarlo, parece ser porque solo se lanza "updateDataGrid" en "moveend".
// El "updateDataGrid(map)" solo funcionará cuando los WCSLoader finalicen sus llamadas a URLs.
// Se ha podido ver que con añadir en "mousesrs/src/impl/ol/js/wcsloader.js" al final del get de "loadCoverage" get URL un "if (this.options.callback instanceof Function && (innerThis.cellsizeX !== undefined || innerThis.cellsizeY !== undefined)) this.options.callback();"(O poner dentro de "if" de "offsetVector"), mientras que en al menos uno de los layers se ha añadido en "mousesrs/src/impl/ol/js/extendedMouse.js" un parámetro de la opción "callback: () => { this.updateDataGrid(map); },", se consigue que al menos se refresque entonces. Se podría realmente hacer mucho mejor este código para que pruebe todos los layers pero no llame cada vez si se configuran los callback como "let alreadyDoneOnce = false; const callcbackFunction = () => { if (!alreadyDoneOnce) { alreadyDoneOnce = true; this.updateDataGrid(map); } };" para generar el callback que se enviaría a todos las opciones de estos layers. Si es necesario se puede limpiar ese callback tras llegar al final de esta llamada sin importar si ha sido o no llamado anteriormente.
