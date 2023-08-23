import StoryMap from 'facade/storymap';

import StoryMapJSON2 from './StoryMapJSON2'; // https://openlayers.org/en/latest/examples/animation.html
import StoryMapJSON1 from './StoryMapJSON1';

M.language.setLang('es');

const map = M.map({
  container: 'mapjs',

});


const mp = new StoryMap({
  collapsed: false,
  collapsible: true,
  position: 'TR',
  content: {
    es: StoryMapJSON2,
    en: StoryMapJSON1,
  },
  indexInContent: {
    title: 'Indice StoryMap',
    subtitle: 'Visualizador de Cervantes y el Madrid del siglo XVII',
    js: "console.log('HolaMundo')",
  },
  delay: 2000,
});

map.addPlugin(mp);

// window.map = map;
