/* eslint-disable no-param-reassign */
/* eslint-disable max-len */
import { getAllLayersGroup } from './groupLayers';

// eslint-disable-next-line import/prefer-default-export
export const showHideLayersRadio = (layer, map, overlayLayers, layerName, layerType, layerURL) => {
  const allLayers = getAllLayersGroup(map).concat(overlayLayers);

  allLayers.forEach((l) => {
    if (l.name === layerName && l.type === layerType && (l.url === layerURL || layerURL === 'noURL')) {
      l.checkedLayer = 'true';
      l.setVisible(true);
    } else {
      l.checkedLayer = 'false';
      l.setVisible(false);
    }
  });

  if (layer.type === 'LayerGroup') {
    layer.getLayers().forEach((l) => {
      l.setVisible(true);
      l.checkedLayer = 'true';
    });
  }
};
