/* eslint-disable no-param-reassign */
/* eslint-disable max-len */

import { fiendLayerInGroup } from './groupLayers';

export const hideLayers = (layer) => {
  layer.checkedLayer = 'false';
  layer.setVisible(false);
};

export const showLayers = (layer) => {
  layer.checkedLayer = 'true';
  layer.setVisible(true);
};

const showHideLayersInLayerGroup = (layer, map) => {
  const group = fiendLayerInGroup(layer, map);

  if (group) {
    group.getLayers().forEach((subLayer) => {
      if (subLayer.name === layer.name) {
        showLayers(subLayer);
      } else {
        hideLayers(subLayer);
      }
    });
  }
};

export const showHideLayersRadio = (layer, map, layerName, layerType, layerURL) => {
  const layers = map.getLayers().filter((l) => l.displayInLayerSwitcher === true);
  const layerMap = layers.filter((l) => l.name === layerName && l.type === layerType && l.url === layerURL)[0];

  if (layerMap) {
    layers.forEach((l) => {
      if (l.name === layerName && l.type === layerType && (l.url === layerURL || layerURL === 'noURL')) {
        showLayers(l);
      } else {
        hideLayers(l);
      }
    });
  } else {
    showHideLayersInLayerGroup(layer, map);
  }
};

export const showHideLayersGroup = (layer) => {
  if (layer.type === 'LayerGroup') {
    layer.checkedLayer = 'true';
    layer.setVisible(true);
  }
};

export const selectDefaultRange = (radioButtons, map) => {
  radioButtons.forEach((radio, i) => {
    if (i === 0) {
      radio.click();
    }

    if (radio.getAttribute('data-layer-type') === 'LayerGroup'
      && map.getLayerGroup().find((layerGroup) => layerGroup.name === radio.getAttribute('data-layer-name'))
      && map.getLayerGroup().find((layerGroup) => layerGroup.name === radio.getAttribute('data-layer-name')).getLayers().length > 0) {
      radioButtons[i + 1].click();
    }
  });
};
