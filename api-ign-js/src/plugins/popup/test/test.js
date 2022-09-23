import Popup from 'facade/popup';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new Popup({
  position: 'TR',
  helpLink: {
    es: 'http://visores-cnig-gestion-publico.desarrollo.guadaltel.es/iberpix/ayuda/es.html',
    en: 'http://visores-cnig-gestion-publico.desarrollo.guadaltel.es/iberpix/ayuda/en.html',
  },
});

// map.removeControls('panzoom');
window.map = map;

map.addPlugin(mp);
