import { map as Mmap } from 'M/mapea';

import { getTranslation, addTranslation, setLang } from '../../src/facade/js/i18n/language';
window.getTranslation = getTranslation;

addTranslation('ca', {
  "scale": {
      "title": "Escala",
      "scale": "Escala",
      "level": "Nivell"
  },

  "attributions": {
      "exception": {
          "impl": "La implementació no pot crear controls de Attribution.",
          "mode": "L'opció 'mode' no s'ha establert correctament. Consell: {mode: 1 | 2 | 3}.",
          "type": "L'opció 'type' no ha estat establerta. Quan l'opció 'url' és usada el plugin necessita l'opció 'type'. Valors = geojson | kml | topojson.",
          "layer_name": "L'opció 'layerName' no s'ha establert. Quan l'opció 'url' s'utilitza el connector necessita l'opció 'layerName'."
      },
      "attribution": "atribució",
      "tooltip": "Reconeixements"
  }
});

// setLang('ca');
// Attributions.addTranslationPlugin('ca');

const mapjs = Mmap({
  container: 'map',
});

window.mapjs = mapjs;
