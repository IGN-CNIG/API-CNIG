import Popup from 'facade/popup';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new Popup({
  position: 'TR',
  url_es: 'http://visores-cnig-gestion-publico.desarrollo.guadaltel.es/iberpix/ayuda/es.html',
  url_en: 'http://visores-cnig-gestion-publico.desarrollo.guadaltel.es/iberpix/ayuda/en.html',
});

// map.removeControls('panzoom');
window.map = map;

map.addPlugin(mp);
