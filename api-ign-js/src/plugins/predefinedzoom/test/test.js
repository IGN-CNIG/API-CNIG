import PredefinedZoom from 'facade/predefinedzoom';

const map = M.map({
  container: 'mapjs',
});

const mp = new PredefinedZoom({
  position: 'TL',
});

map.addPlugin(mp);
