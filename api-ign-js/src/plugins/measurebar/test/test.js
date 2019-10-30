import MeasureBar from 'facade/measurebar';

const mapjs = M.map({
  container: 'map',
});

const plugin = new MeasureBar();

mapjs.addPlugin(plugin);

window.plugin = plugin;
window.mapjs = mapjs;
