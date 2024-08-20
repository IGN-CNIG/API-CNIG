// eslint-disable-next-line import/prefer-default-export
export const showHideLayersEye = (evt, layer, self) => {
  if (evt.target.classList.contains('m-layerswitcher-check')) {
    if (layer.transparent === true || !layer.isVisible()) {
      layer.setVisible(!layer.isVisible());
      self.render();
    }
  }
};
