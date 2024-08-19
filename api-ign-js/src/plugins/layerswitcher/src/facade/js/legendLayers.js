import { getValue } from './i18n/language';

// eslint-disable-next-line import/prefer-default-export
export const legendInfo = (evt, layer) => {
  const legend = evt.target.parentElement.parentElement.parentElement.querySelector('.m-layerswitcher-legend');
  if (legend.style.display !== 'block') {
    const legendUrl = layer.getLegendURL();
    if (legendUrl instanceof Promise) {
      legendUrl.then((url) => {
        if (url.indexOf('assets/img/legend-default.png') === -1) {
          legend.querySelector('img').src = url;
        } else {
          this.errorLegendLayer(layer).then((newLegend) => {
            if (newLegend !== '') {
              legend.querySelector('img').src = newLegend;
            } else {
              legend.querySelector('img').src = url;
            }
          });
        }
      });
    } else if (legendUrl.indexOf('assets/img/legend-default.png') >= 0) {
      this.errorLegendLayer(layer).then((newLegend) => {
        if (newLegend === 'error legend') {
          const img = legend.querySelector('img');
          const messageError = document.createElement('p');
          const icon = document.createElement('span');
          icon.classList.add('m-layerswitcher-icons-cancel');
          messageError.classList.add('m-layerswitcher-legend-error');
          messageError.appendChild(icon);
          const text = document.createTextNode(getValue('legend_error'));
          messageError.appendChild(text);
          img.parentNode.insertBefore(messageError, img);
        } else if (newLegend !== '') {
          legend.querySelector('img').src = newLegend;
        } else {
          legend.querySelector('img').src = legendUrl;
        }
      });
    } else {
      legend.querySelector('img').src = legendUrl;
    }
    legend.style.display = 'block';
  } else {
    const img = legend.querySelector('img');
    const p = img.parentElement.querySelector('p');
    if (!M.utils.isNullOrEmpty(p)) {
      p.remove();
    }
    legend.style.display = 'none';
  }
};
