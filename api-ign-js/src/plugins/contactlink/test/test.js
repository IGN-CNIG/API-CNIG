/* eslint-disable max-len */
import ContactLink from 'facade/contactlink';

M.language.setLang('es');
// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
  // controls: ['layerswitcher'],
});
window.map = map;

const mp = new ContactLink({
  position: 'BL', // TR, BR, TL, BL
  collapsed: false,
  collapsible: true, // false, // 1 - ERROR
  descargascnig: 'http://centrodedescargas.cnig.es/CentroDescargas/index.jsp',
  pnoa: 'https://www.ign.es/web/comparador_pnoa/index.html',
  visualizador3d: 'https://visualizadores.ign.es/estereoscopico/',
  fototeca: 'https://fototeca.cnig.es/',
  twitter: 'https://twitter.com/IGNSpain', // 3 - ERROR
  instagram: 'https://www.instagram.com/ignspain/',
  facebook: 'https://www.facebook.com/IGNSpain/',
  pinterest: 'https://www.pinterest.es/IGNSpain/',
  youtube: 'https://www.youtube.com/user/IGNSpain',
  mail: 'mailto:ign@fomento.es',
  tooltip: 'Contacta con nosotros',
  // order: 1, // 2 - ERROR
});
window.mp = mp;

/* / PRUEBA con capa
const mvt = new M.layer.MVT({
  url: 'https://herramienta-centralizada-sigc.desarrollo.guadaltel.es/geoserver/gwc/service/tms/1.0.0/Global:carloscastellano_rios____cc_20191104@EPSG%3A3857@pbf/{z}/{x}/{-y}.pbf',
  name: 'vectortile',
  projection: 'EPSG:3857',
});
map.addLayers(mvt) // */

map.addPlugin(mp);

// Lista de errores

// 1 - ERROR "collapsible: true" y "collapsible: false" tienen diferentes aspectos, parece como si el border-radius de las esquinas inferiores se cambia a bastante más grande en el false.

// 2 - ERROR El parámetro order nunca llega a "accessibilityTab", porque en el creado de "ContactLinkControl" de "contactlink/src/facade/js/contactlink.js" no se incluye el orden, se podría modificarlo para que el orden se configure antes que este generado de control.

// 3 - ERROR El icono de twitter ahora se tiene que cambiar al icono de "X", la URL no parece que ha sido cambiada.
