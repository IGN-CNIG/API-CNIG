//  Esta función ordena todas las capas por zindex
// eslint-disable-next-line import/prefer-default-export
export const reorderLayers = (layers) => {
  const result = layers.sort((layer1, layer2) => layer1.getZIndex()
      - layer2.getZIndex()).reverse();
  return result;
};
