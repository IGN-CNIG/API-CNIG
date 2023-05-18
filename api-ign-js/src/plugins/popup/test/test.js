import Popup from 'facade/popup';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new Popup({
  position: 'TR',
  collapsed: true,
  collapsible: true,
  url_es: 'https://componentes.cnig.es/ayudaIberpix/es.html',
  url_en: 'https://componentes.cnig.es/ayudaIberpix/en.html',
  tooltip: 'Ayuda',
});


// map.removeControls('panzoom');
window.map = map;

map.addPlugin(mp);
