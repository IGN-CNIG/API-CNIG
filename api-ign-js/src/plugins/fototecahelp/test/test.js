import FototecaHelp from 'facade/fototecahelp';

M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});

const mp = new FototecaHelp({
  position: 'TR',
  helpLink: 'http://fototeca.cnig.es/help_es.pdf',
  contactEmail: 'fototeca@cnig.es',
});

// map.removeControls('panzoom');

window.map = map;
map.addPlugin(mp);
