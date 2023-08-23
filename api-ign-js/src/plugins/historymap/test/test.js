import HistoryMap from 'facade/historymap';

import HistoryMapJSON2 from './HistoryMapJSON2'; // https://openlayers.org/en/latest/examples/animation.html
import HistoryMapJSON1 from './HistoryMapJSON1';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',

});


const mp = new HistoryMap({
  collapsed: false,
  collapsible: true,
  position: 'TR',
  content: {
    es: HistoryMapJSON2,
    en: HistoryMapJSON1,
  },
  indexInContent: {
    title: 'Indice HistoryMap',
    subtitle: 'Visualizador de Cervantes y el Madrid del siglo XVII',
    js: "console.log('HolaMundo')",
  },
  delay: 2000,
});

map.addPlugin(mp);

// window.map = map;
