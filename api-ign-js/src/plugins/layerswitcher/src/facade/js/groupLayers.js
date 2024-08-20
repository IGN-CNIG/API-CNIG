export const getAllLayersGroup = (map) => {
  const allLayers = [];
  const layersGroup = map.getImpl().getGroupedLayers();

  layersGroup.forEach((group) => {
    if (group.displayInLayerSwitcher) {
      allLayers.push(group);
      group.getLayers().forEach((layer) => {
        if (layer.type !== 'LayerGroup') {
          allLayers.push(layer);
        }
      });
    }
  });
  return allLayers;
};

export const displayLayers = ({ target }, targetName, map) => {
  if (target.classList.contains('m-layerswitcher-groupDisplay')) {
    const groupLayer = map.getLayerGroup()
      .filter((layerGroup) => layerGroup.name === targetName)[0];

    const group = target.parentElement.parentElement.parentElement.children[1];
    group.style.display = group.style.display === 'none' ? 'block' : 'none';

    if (target.classList.contains('m-layerswitcher-icons-desplegar')) {
      target.classList.remove('m-layerswitcher-icons-desplegar');
      target.classList.add('m-layerswitcher-icons-colapsar');
      groupLayer.display = true;
    } else {
      target.classList.remove('m-layerswitcher-icons-colapsar');
      target.classList.add('m-layerswitcher-icons-desplegar');
      groupLayer.display = false;
    }
  }
};

export const fiendLayerInGroup = (layer, map) => {
  let group = null;

  const findRecursiveGroup = (layerGroup) => {
    layerGroup.getLayers().forEach((subLayer) => {
      if (subLayer.name === layer.name) {
        group = layerGroup;
      } else if (subLayer.type === 'LayerGroup') {
        findRecursiveGroup(subLayer);
      }
    });
  };

  map.getLayerGroup().forEach((subLayer) => {
    findRecursiveGroup(subLayer);
  });

  return group;
};
