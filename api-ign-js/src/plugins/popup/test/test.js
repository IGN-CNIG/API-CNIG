import Popup from 'facade/popup';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new Popup({
  position: 'TR',
  collapsed: true,
  collapsible: true,
  helpLink: {
    es: 'https://componentes.cnig.es/ayudaIberpix/es.html',
    en: 'https://componentes.cnig.es/ayudaIberpix/en.html',
  },
  tooltip: 'Ayuda',
});


// map.removeControls('panzoom');
window.map = map;

map.addPlugin(mp);
