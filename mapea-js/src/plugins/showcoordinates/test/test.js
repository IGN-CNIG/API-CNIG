import ShowCoordinates from 'facade/showcoordinates';

const map = M.map({
  container: 'mapjs',
});

const mp = new ShowCoordinates({
  position: 'TR',
});

map.addPlugin(mp);
