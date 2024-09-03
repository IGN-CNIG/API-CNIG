import Basic from 'facade/basic';

// M.language.setLang('es');
// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});
window.map = map;

const mp = new Basic({
  position: 'TR', // TR, BR, TL, BL
  collapsed: true,
  collapsible: true,
  tooltip: 'Plantilla plugin',
});
window.mp = mp;

map.addPlugin(mp);
