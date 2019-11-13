import IGNHelp from 'facade/ignhelp';

const map = M.map({
  container: 'mapjs',
});

const mp = new IGNHelp({
  position: 'TR',
  helpLink: 'http://fototeca.cnig.es/help_es.pdf',
  contactEmail: 'fototeca@cnig.es',
});

// map.removeControls('panzoom');

map.addPlugin(mp);
