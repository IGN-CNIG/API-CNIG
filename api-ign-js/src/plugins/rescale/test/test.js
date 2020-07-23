import Rescale from 'facade/rescale';

M.language.setLang('es');


const map = M.map({
  container: 'mapjs',
  controls: ['scale*true'],
});

const mp = new Rescale({
  collapsible: true,
  collapsed: true,
  position: 'TL',
});

map.addPlugin(mp);

window.map = map;
