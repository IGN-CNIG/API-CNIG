/**
 * @module M/dialog
 */
import 'assets/css/dialog';
import dialogTemplate from 'templates/dialog';
import { isNullOrEmpty } from './util/Utils';
import { compileSync as compileTemplate } from './util/Template';
import { getValue } from './i18n/language';

/**
 * TODO
 *
 * @public
 * @function
 */
const removeElement = (element) => {
  const parent = element.parentElement;
  parent.removeChild(element);
};

/**
 * TODO
 *
 * @public
 * @function
 */
const remove = () => {
  const dialogs = document.querySelectorAll('div.m-dialog');
  Array.prototype.forEach.call(dialogs, (dialog) => {
    const parent = dialog.parentElement;
    parent.removeChild(dialog);
  });
};

/**
 * TODO
 *
 * @public
 * @function
 * @returns {Promise}
 * @api
 */
export const show = (message, title, severity, order = 300) => {
  const vars = {
    message,
    title,
    severity,
    order,
  };
  const html = compileTemplate(dialogTemplate, {
    vars,
  });
  // removes previous dialogs
  remove();

  // append new dialog
  const mapeaContainer = document.querySelector('div.m-mapea-container');

  // adds listener to close the dialog
  const okButton = html.querySelector('div.m-button > button');
  okButton.addEventListener('click', evt => removeElement(html));
  mapeaContainer.appendChild(html);
};

/**
 * TODO
 *
 * @public
 * @function
 * @param {string} message to show
 * @param {string} title of the dialog
 * @returns {Promise}
 * @api
 */
export const info = (message, titleParam, order) => {
  let title = titleParam;
  if (isNullOrEmpty(title)) {
    title = getValue('dialog').info;
  }
  return show(message, title, 'info', order);
};

/**
 * TODO
 *
 * @public
 * @function
 * @param {string} message to show
 * @param {string} title of the dialog
 * @returns {Promise}
 * @api
 */
export const error = (message, titleParam, order) => {
  let title = titleParam;
  if (isNullOrEmpty(title)) {
    title = getValue('dialog').error;
  }
  return show(message, title, 'error', order);
};

/**
 * TODO
 *
 * @public
 * @function
 * @param {string} message to show
 * @param {string} title of the dialog
 * @returns {Promise}
 * @api
 */
export const success = (message, titleParam, order) => {
  let title = titleParam;
  if (isNullOrEmpty(title)) {
    title = getValue('dialog').success;
  }
  return show(message, title, 'success', order);
};
