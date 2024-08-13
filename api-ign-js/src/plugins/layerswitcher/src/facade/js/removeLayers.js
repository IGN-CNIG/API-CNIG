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
