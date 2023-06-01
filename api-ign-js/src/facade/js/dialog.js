/**
 * Este modulo contiene las funciones para mostrar un modal.
 * @module M/dialog
 */
import 'assets/css/dialog';
import dialogTemplate from 'templates/dialog';
import { isNullOrEmpty } from './util/Utils';
import { compileSync as compileTemplate } from './util/Template';
import { getValue } from './i18n/language';

/**
 * Eliminar el modal padre.
 * - ⚠️ Advertencia: Este método no debe ser llamado por el usuario.
 * @public
 * @function
 * @param {HTMLElement} element Elimina el elemento html.
 * @api
 */
export const removeElement = (element) => {
  const parent = element.parentElement;
  parent.removeChild(element);
};

/**
 * Elimina el elemento "Dialog"
 * @public
 * @function
 * @api
 */
export const remove = () => {
  const dialogs = document.querySelectorAll('div.m-dialog');
  Array.prototype.forEach.call(dialogs, (dialog) => {
    const parent = dialog.parentElement;
    parent.removeChild(dialog);
  });
};

/**
 * Esta función genera la plantilla del modal.
 * @public
 * @function
 * @param {String} message Contenido que se mostrará.
 * @param {String} title Título del modal.
 * @param {String} severity Tipo de modal.
 * @param {Number} order "tabindex" de los elementos del modal, por defecto 300.
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
  // remove();

  // append new dialog
  const mapeaContainer = document.querySelector('div.m-mapea-container');

  // adds listener to close the dialog
  const okButton = html.querySelector('div.m-button > button');
  okButton.addEventListener('click', evt => removeElement(html));
  mapeaContainer.appendChild(html);
};

/**
 * Genera el modal de tipo "info".
 *
 * @public
 * @function
 * @param {String} message Mensaje que se mostrará.
 * @param {String} titleParam Título del dialogo.
 * @param {Number} order "tabIndex" de los elementos del HTML.
 * @api
 */
export const info = (message, titleParam, order) => {
  let title = titleParam;
  if (isNullOrEmpty(title)) {
    title = getValue('dialog').info;
  }
  show(message, title, 'info', order);
};

/**
 * Genera el modal de tipo "error".
 *
 * @public
 * @function
 * @param {String} message Mensaje que se mostrará.
 * @param {String} title Título del dialogo.
 * @param {Number} order "tabIndex" de los elementos del HTML.
 * @api
 */
export const error = (message, titleParam, order) => {
  let title = titleParam;
  if (isNullOrEmpty(title)) {
    title = getValue('dialog').error;
  }
  show(message, title, 'error', order);
};

/**
 * Genera el modal de tipo "success".
 *
 * @public
 * @function
 * @param {String} message Mensaje que se mostrará.
 * @param {String} title Título del dialogo.
 * @param {Number} order "tabIndex" de los elementos del HTML.
 * @api
 */
export const success = (message, titleParam, order) => {
  let title = titleParam;
  if (isNullOrEmpty(title)) {
    title = getValue('dialog').success;
  }
  show(message, title, 'success', order);
};

/**
 * Este comentario no se verá, es necesario incluir
 * una exportación por defecto para que el compilador
 * muestre las funciones.
 *
 * Esto se produce por al archivo normaliza-exports.js
 * @api stable
 */
export default {};
