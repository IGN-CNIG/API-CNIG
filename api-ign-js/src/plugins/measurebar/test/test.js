import MeasureBar from 'facade/measurebar';

const map = M.map({
  container: 'mapjs',
});

const plugin = new MeasureBar();

map.addPlugin(plugin);

window.plugin = plugin;
window.map = map;
