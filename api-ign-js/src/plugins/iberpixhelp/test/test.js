import IberpixHelp from 'facade/iberpixhelp';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',
});

const mp = new IberpixHelp({
  position: 'TR',
  helpLink: 'https://www.ign.es/iberpix2/visor/help/Manual%20de%20Usuario.html?1Introduccion.html',
});

// map.removeControls('panzoom');

map.addPlugin(mp);
