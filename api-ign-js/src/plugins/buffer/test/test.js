import Buffer from 'facade/buffer';

const map = M.map({
  container: 'mapjs',
});

const mp = new Buffer({
  position: 'TL',
});

map.addPlugin(mp);
