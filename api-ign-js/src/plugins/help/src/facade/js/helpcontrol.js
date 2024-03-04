/**
 * @module M/control/HelpControl
 */

import HelpImplControl from '../../impl/ol/js/helpcontrol';
import template from '../../templates/help';
import helps from '../../templates/helps';
import { getValue } from './i18n/language';

export default class HelpControl extends M.Control {
  /**
   * @classdesc
   * Constructor
   *
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(options) {
    if (M.utils.isUndefined(HelpImplControl)) {
      M.exception(getValue('exception.impl'));
    }
    const impl = new HelpImplControl();
    super(impl, 'help');

    // Opciones
    this.headerImages = options.headerImages;

    this.tooltip = options.tooltip;

    this.order = options.order;

    this.extendInitialExtraContents = options.extendInitialExtraContents;

    this.initialExtraContents = options.initialExtraContents;
    if (!M.utils.isArray(this.initialExtraContents)) {
      try {
        this.initialExtraContents = this.initialExtraContents[M.language.getLang()];
      } catch (e) {
        try {
          this.initialExtraContents = this.initialExtraContents.es;
        } catch (ex) {
          this.initialExtraContents = Object.keys(this.initialExtraContents)[0];
        }
      }
    }

    this.defaultInitialContents = [
      { title: 'API-CNIG', content: `<div><h2>API-CNIG</h2><div><p style='text-align: center'>${getValue('welcome0')}: <a href='https://plataforma.idee.es/cnig-api' target='_blank'>https://plataforma.idee.es/cnig-api</a></p><p>${getValue('welcome1')}</p><h4>${getValue('welcome2')}</h4><p>${getValue('welcome3')}: <a href="https://github.com/IGN-CNIG/API-CNIG" target="_blank">https://github.com/IGN-CNIG/API-CNIG</a></p><h4>${getValue('welcome4')}</h4><p>${getValue('welcome5')}: <a href="http://componentes.cnig.es/api-core/test.html" target="_blank">http://componentes.cnig.es/api-core/test.html</a></p><h4>Wiki API-CNIG</h4><p>${getValue('welcome6')}: <a href="https://github.com/IGN-CNIG/API-CNIG/wiki" target="_blank">https://github.com/IGN-CNIG/API-CNIG/wiki</a></p><h4>${getValue('welcome7')}</h4><p>${getValue('welcome8')}: <a href="https://plataforma.idee.es/resources/GaleriaEjemplos_APICNIG/" target="_blank">https://plataforma.idee.es/resources/GaleriaEjemplos_APICNIG/</a></p><h4>${getValue('welcome9')}</h4><p>${getValue('welcome10')}: <a href="https://plataforma.idee.es/cnig-api" target="_blank">https://plataforma.idee.es/cnig-api</a></p></div>` },
    ];

    if (this.extendInitialExtraContents) {
      this.initialExtraContents = [...this.initialExtraContents, ...this.defaultInitialContents];
    }

    this.finalExtraContents = options.finalExtraContents;
    if (!M.utils.isArray(this.finalExtraContents)) {
      try {
        this.finalExtraContents = this.finalExtraContents[M.language.getLang()];
      } catch (e) {
        try {
          this.finalExtraContents = this.finalExtraContents.es;
        } catch (ex) {
          this.finalExtraContents = Object.keys(this.finalExtraContents)[0];
        }
      }
    }

    this.orderExtra = options.orderExtra;

    this.headerTitle = options.headerTitle;

    this.nameIndex = [];
    this.helpsContent = [];

    this.currentIndex = 0;
  }

  /**
   * Crea la vista
   *
   * @public
   * @function
   * @param {M.Map} map mapa para añadir el control
   * @api
   */
  createView(map) {
    this.map = map;
    return new Promise((success) => {
      const html = M.template.compileSync(template, {
        vars: {
          translations: {
            tooltip: this.tooltip,
          },
          order: this.order,
        },
      });
      html.querySelector('#m-help-button').addEventListener('click', this.showHelp.bind(this));
      success(html);
    });
  }

  /**
   * Muestra la ayuda
   *
   * @public
   * @function
   * @api
   */
  showHelp() {
    let allContents = [...this.initialExtraContents];
    allContents.push({
      title: getValue('tools'),
      content: '<div><h2>Herramientas</h2><div><p>Apartado para texto de herramientas</p></div></div>',
      subContents: this.getHelpsPluginsControls(),
    });
    allContents = [...allContents, ...this.finalExtraContents];

    const list = `<ol>${this.generateExtraContent(allContents)}</ol>`;

    Promise.all(this.helpsContent).then((resultsHelps) => {
      const html = M.template.compileSync(helps, {
        parseToHtml: false,
        vars: {
          headerImages: this.headerImages,
          namePlugins: this.nameIndex,
          translations: {
            header: getValue('short_title'),
            title: this.headerTitle,
            tools: getValue('tools'),
            index: getValue('index'),
            help: getValue('help'),
          },
        },
      });
      const windowHelp = window.open(`${window.location.href}`, '_blank');
      windowHelp.document.open();
      windowHelp.document.write(html);

      windowHelp.document.close();
      windowHelp.addEventListener('load', () => {
        const listContent = windowHelp.document.querySelector('#m-help-index > div');
        listContent.appendChild(M.utils.stringToHtml(list));

        const contents = windowHelp.document.querySelector('#m-help-contents');
        resultsHelps.forEach((element, index) => {
          const divContainer = document.createElement('div');
          divContainer.classList.add('m-help-hidden');
          divContainer.id = `help-element-${index}`;
          divContainer.appendChild(element);
          contents.appendChild(divContainer);
        });
        windowHelp.document.querySelector('#m-help-index > div > ol > li > span').click();
      });

      this.nameIndex = [];
      this.helpsContent = [];
    });
  }

  /**
   * Obtiene la ayuda de los plugins
   *
   * @public
   * @function
   * @api
  */
  getHelpsPluginsControls() {
    const plugins = this.map.getPlugins();
    const result = [];
    plugins.forEach((element) => {
      if (!M.utils.isUndefined(element.getHelp)) {
        result.push(element.getHelp());
      }
    });
    return result;
  }

  generateExtraContent(array) {
    let count = -1;
    const generateSubContent = (subContentsArray) => {
      if (!subContentsArray || subContentsArray.length === 0) return '';

      let subContentHTML = '<ol>';
      subContentsArray.forEach(({ title, content, subContents }) => {
        count += 1;
        if (M.utils.isString(content)) {
          this.helpsContent.push(M.utils.stringToHtml(content));
        } else {
          this.helpsContent.push(content);
        }
        subContentHTML += `<li><span onclick="showContent('help-element-${count}', event)">${title}${generateSubContent(subContents)}</span></li>`;
      });
      subContentHTML += '</ol>';
      return subContentHTML;
    };

    let extraContentHTML = '';
    array.forEach(({ title, content, subContents }) => {
      count += 1;
      extraContentHTML += `<li><span onclick="showContent('help-element-${count}', event)">${title}</span>`;
      this.helpsContent.push(M.utils.stringToHtml(content));

      if (subContents && subContents.length > 0) {
        extraContentHTML += generateSubContent(subContents);
      }

      extraContentHTML += '</li>';
    });

    return extraContentHTML.replace(/\n/g, '');
  }

  /**
   * Compara dos controles
   *
   * @public
   * @function
   * @param {M.Control} control control para comparar
   * @api
   */
  equals(control) {
    return control instanceof HelpControl;
  }
}
