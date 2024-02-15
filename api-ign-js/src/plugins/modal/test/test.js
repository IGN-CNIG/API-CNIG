import Modal from 'facade/modal';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new Modal({
  collapsed: true,
  collapsible: true,
  position: 'TR',
  tooltip: 'Más información',
  url_en: 'https://www.ign.es/iberpix/ayuda/en.html',
  url_es: 'https://www.ign.es/iberpix/ayuda/es.html',
});


// map.removeControls('panzoom');
window.map = map;

map.addPlugin(mp);
