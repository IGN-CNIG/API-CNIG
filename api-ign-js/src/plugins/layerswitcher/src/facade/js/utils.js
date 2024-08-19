//  Esta función ordena todas las capas por zindex
export const reorderLayers = (layers) => {
  const result = layers.sort((layer1, layer2) => layer1.getZIndex()
      - layer2.getZIndex()).reverse();
  return result;
};

export const removeLayerGroup = (map, layerName) => {
  map.getLayerGroup().forEach((layerGroup) => {
    layerGroup.getLayers().forEach((layerGroupLayer) => {
      if (layerGroupLayer.name === layerName) {
        layerGroup.removeLayers(layerGroupLayer);
      }
    });
  });
};

export const removeLayersInLayerSwitcher = (evt, layer, map, layerName) => {
  if (evt.target.className.indexOf('m-layerswitcher-icons-delete') > -1) {
    removeLayerGroup(map, layerName);
    map.removeLayers(layer);
  }
};
