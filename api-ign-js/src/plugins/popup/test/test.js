import Popup from 'facade/popup';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new Popup({
  position: 'TR',
  helpLink: 'https://www.ign.es/iberpix2/visor/help/Manual%20de%20Usuario.html?1Introduccion.html',
});

// map.removeControls('panzoom');
window.map = map;

map.addPlugin(mp);
