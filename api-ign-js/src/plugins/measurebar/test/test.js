import MeasureBar from 'facade/measurebar';

// M.language.setLang('en');

const map = M.map({
  container: 'mapjs',
});

const plugin = new MeasureBar();

map.addPlugin(plugin);

window.plugin = plugin;
window.map = map;
