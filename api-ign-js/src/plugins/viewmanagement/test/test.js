/* eslint-disable max-len */
import ViewManagement from 'facade/viewmanagement';

M.language.setLang('es');
// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});
window.map = map;

const mp = new ViewManagement({
  position: 'TL', // 'TL' | 'TR' | 'BR' | 'BL'
  collapsible: true,
  collapsed: true,
  isDraggable: true,
  // tooltip: 'TEST TOOLTIP',
  // predefinedZoom: false, // Prueba de excluir
  // predefinedZoom: true, // Prueba default
  // Prueba de predefinedZoom predefinido por usuario
  predefinedZoom: [{
    name: 'Zoom con CENTER',
    center: [-428106.86611520057, 4334472.25393817],
    zoom: 4,
  },
  {
    name: 'Zoom con BBOX',
    bbox: [-2392173.2372, 3033021.2824, 1966571.8637, 6806768.1648],
  }], // */
  zoomExtent: true,
  viewhistory: true,
  zoompanel: true,
  order: 1,
});

map.addPlugin(mp); window.mp = mp;

// Lista de errores encontrados

// 1 - ERROR, Errores anteriormente apuntados de función "getAPIRest" de variable errónea "isDraggableE" y salto de linea no esperado.
// Ademas los objetos de "predefinedzoom" se escriben como "[object Object]" que posiblemente se tendría que hacer de otra forma. Se podría tener en cuneta que "isDefault: true" esta presente en caso de solo usar el default zoom, por lo que se podría detectar y poner solo "true" y no tener que trabajar con el objeto.

// 2 - ERROR, La interacción de "predefinedZoom" con varias opciones de zoom que usa "newBtn.addEventListener('click', () => ..." posiblemente debería de estar puesto el evento no en el botón de la imagen pero en todo el div del botón para que no haga falta hacer click sobre solo la imagen.
// Se soluciona cambiando "newBtn" por "newDiv" y parece funcionar bien en este caso.

// 3 - ERROR, En JSP el parámetro de "predefinedZoom" solo puede ser true/false. Podría ser una buena idea añadir "Custom" que activa un input adicional que tenga un ejemplo valido de 2 zooms como mínimo, para que estén todas las pruebas de su comportamiento.
