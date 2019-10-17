import Overview from 'facade/overview';

const map = M.map({
  container: 'mapjs',
});

const mp = new Overview();

map.addPlugin(mp);

window.map = map;
