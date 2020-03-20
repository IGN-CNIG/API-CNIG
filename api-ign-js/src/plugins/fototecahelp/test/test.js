import FototecaHelp from 'facade/fototecahelp';

const map = M.map({
  container: 'mapjs',
});

const mp = new FototecaHelp({
  position: 'TR',
  helpLink: 'http://fototeca.cnig.es/help_es.pdf',
  contactEmail: 'fototeca@cnig.es',
});

// map.removeControls('panzoom');

map.addPlugin(mp);
