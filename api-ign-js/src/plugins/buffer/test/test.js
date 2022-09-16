import Buffer from 'facade/buffer';

const map = M.map({
  container: 'mapjs',
});

const mp = new Buffer({
  position: 'TL',
});

const capa = new M.layer.GeoJSON({
  name: 'jsonejemplo',
  url: 'http://www.ign.es/resources/geodesia/GNSS/SPTR_geo.json',
  extract: false,
});

map.addLayers(capa)
map.addPlugin(mp);
