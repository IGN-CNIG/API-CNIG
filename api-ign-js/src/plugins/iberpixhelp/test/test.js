import IberpixHelp from 'facade/iberpixhelp';

const map = M.map({
  container: 'mapjs',
});

const mp = new IberpixHelp({
  position: 'TR',
  helpLink: 'https://www.ign.es/iberpix2/visor/help/Manual%20de%20Usuario.html?1Introduccion.html',
});

// map.removeControls('panzoom');
window.map = map;

map.addPlugin(mp);
