const map = M.map({
  container: 'map',
});

const mp = new M.plugin.MeasureBar({
  position: 'TR',
});

map.addPlugin(mp);

window.map = map;
