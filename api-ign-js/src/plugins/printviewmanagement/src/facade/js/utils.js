import { getValue } from './i18n/language';

/**
* This function creates list element.
*
* @public
* @function
* @api stable
*/

export function createQueueElement(title) {
  const queueElem = document.createElement('li');
  queueElem.innerHTML = title || getValue('notitle');
  return queueElem;
}


export function showQueueElement(element) {
  const e = element;
  if (e.style.display === 'none') {
    e.style.display = 'block';
  }
}

// Services SIG Geoprint List
export const LIST_SERVICES = `
    <h1>TO-DO DEFINIR</h1>
`;
