import changeNameTemplate from 'templates/changename';
import { getValue } from './i18n/language';

export const changeLayerLegend = (layer, target) => {
  const element = target;
  const selector = 'div.m-mapea-container div.m-dialog #m-layer-change-name input';
  const newValue = document.querySelector(selector).value.trim();
  if (newValue.length > 0) {
    layer.setLegend(newValue);
    document.querySelector('div.m-mapea-container div.m-dialog').remove();
    element.lastChild.textContent = ` ${newValue} `;
  }
};

export const showModalChangeName = (layer, target, order) => {
  const changeName = M.template.compileSync(changeNameTemplate, {
    jsonp: true,
    parseToHtml: false,
    vars: {
      name: layer.legend || layer.name,
      translations: {
        change: getValue('change'),
      },
      order,
    },
  });

  M.dialog.info(changeName, getValue('change_name'), order);

  document.querySelector('#m-layer-change-name button').addEventListener('click', () => {
    changeLayerLegend(layer, target);
  });

  const button = document.querySelector('div.m-dialog.info div.m-button > button');
  button.innerHTML = getValue('close');
  button.style.width = '75px';
  button.style.backgroundColor = '#71a7d3';
};
