export const getAllLayersGroup = (map) => {
  const allLayers = [];
  const layersGroup = map.getImpl().getGroupedLayers();

  layersGroup.forEach((group) => {
    if (group.displayInLayerSwitcher) {
      allLayers.push(group);
      group.getLayers().forEach((layer) => {
        allLayers.push(layer);
      });
    }
  });

  return allLayers;
};

export const displayLayers = ({ target }, targetName, map) => {
  if (target.classList.contains('m-layerswitcher-groupDisplay')) {
    // eslint-disable-next-line no-console
    console.log('--', target.parentElement.parentElement);
    const groupLayer = map.getLayerGroup()
      .filter((layerGroup) => layerGroup.name === targetName)[0];

    const group = target.parentElement.parentElement.parentElement.children[1];
    group.style.display = group.style.display === 'none' ? 'block' : 'none';

    if (target.classList.contains('m-layerswitcher-icons-desplegar')) {
      target.classList.remove('m-layerswitcher-icons-desplegar');
      target.classList.add('m-layerswitcher-icons-colapsar');
      // eslint-disable-next-line no-console
      console.log('groupLayer', groupLayer);
      groupLayer.display = true;
    } else {
      target.classList.remove('m-layerswitcher-icons-colapsar');
      target.classList.add('m-layerswitcher-icons-desplegar');
      // eslint-disable-next-line no-console
      console.log('groupLayer', groupLayer);
      groupLayer.display = false;
    }
  }
};
