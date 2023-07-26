/**
 * @module M/plugin/Layerswitcher
 */
import '../assets/css/layerswitcher';
import '../assets/css/fonts';
import LayerswitcherControl from './layerswitchercontrol';
import api from '../../api';
import { getValue } from './i18n/language';

import es from './i18n/es';
import en from './i18n/en';

export default class Layerswitcher extends M.Plugin {
  /**
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api
   */
  constructor(options = {}) {
    super();
    /**
     * Fachada del mapa
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Array de controles
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];

    /**
     * Nombre del plugin
     * @private
     * @type {String}
     */
    this.name_ = 'layerswitcher';

    /**
     * Parámetros del plugin
     * @public
     * @type {Object}
     */
    this.options = options;

    /**
     * Posición del plugin
     * @private
     * @type {string}
     */
    this.position_ = options.position || 'TR';

    /**
     * Permite saber si el plugin está colapsado o no
     * @private
     * @type {boolean}
     */
    this.collapsed_ = !M.utils.isUndefined(options.collapsed) ? options.collapsed : true;

    /**
     * Permite que el plugin sea colapsado o no
     * @private
     * @type {Boolean}
     */
    this.collapsible_ = !M.utils.isUndefined(options.collapsible) ? options.collapsible : true;

    /**
     * Tooltip
     * @private
     * @type {String}
     */
    this.tooltip_ = options.tooltip || getValue('tooltip');

    /**
     * Determina si el plugin es draggable o no
     * @public
     * @type {Boolean}
     */
    this.isDraggable = !M.utils.isUndefined(options.isDraggable) ? options.isDraggable : false;

    /**
     * Determina el orden de visualización de las capas
     * @public
     * @type {Boolean}
     */
    this.reverse = M.utils.isUndefined(options.reverse) ? true : options.reverse;

    /**
     * Determina el modo de selección de las capas
     * @public
     * @type {String}
     */
    this.modeSelectLayers = M.utils.isUndefined(options.modeSelectLayers) ? 'eyes' : options.modeSelectLayers;

    /**
     * Metadata from api.json
     * @private
     * @type {Object}
     */
    this.metadata_ = api.metadata;
  }

  /**
   * Devuelve el idioma del plugin
   *
   * @public
   * @function
   * @param {string} lang lenguaje
   * @api stable
   */
  static getJSONTranslations(lang) {
    if (lang === 'en' || lang === 'es') {
      return (lang === 'en') ? en : es;
    }
    return M.language.getTranslation(lang).layerswitcher;
  }

  /**
   * Esta función añade el plugin al mapa
   *
   * @public
   * @function
   * @param {M.Map} map el mapa donde se añadirá el plugin
   */
  addTo(map) {
    this.map_ = map;
    // creamos control
    this.control_ =
      new LayerswitcherControl({
        isDraggable: this.isDraggable,
        reverse: this.reverse,
        modeSelectLayers: this.modeSelectLayers,
      });
    // creamos panel
    this.panel_ = new M.ui.Panel('Layerswitcher', {
      className: 'm-plugin-layerswitcher',
      collapsed: this.collapsed_,
      collapsible: this.collapsible_,
      position: M.ui.position[this.position_],
      collapsedButtonClass: 'm-layerswitcher-layers',
      tooltip: this.tooltip_,
    });
    this.controls_.push(this.control_);

    // se dispara evento cuando se añade al mapa
    this.control_.on(M.evt.ADDED_TO_MAP, () => {
      this.fire(M.evt.ADDED_TO_MAP);
    });

    // Se definen eventos para detectar cuando se han añadido/eliminado capas
    this.map_.on(M.evt.COMPLETED, () => {
      if (this.map_ !== null) {
        this.map_.on(M.evt.ADDED_LAYER, () => {
          if (this.control_ !== null) {
            this.control_.render();
          }
        });
        this.map_.on(M.evt.REMOVED_LAYER, () => {
          if (this.control_ !== null) {
            this.control_.render();
          }
        });
      }
    });

    this.panel_.addControls(this.controls_);
    this.map_.addPanels(this.panel_);
  }

  /**
   * Esta función devuelve la posición del plugin
   *
   * @public
   * @return {string}
   * @api
   */
  get position() {
    return this.position_;
  }

  /**
   * Esta función devuelve el nombre del plugin
   *
   * @getter
   * @function
   */
  get name() {
    return this.name_;
  }

  /**
   * Esta función devuelve si el panel es collapsible o no
   *
   * @getter
   * @function
   */
  get collapsed() {
    return this.panel_.isCollapsed();
  }

  /**
   * Devuelve la cadena API-REST del plugin
   *
   * @function
   * @public
   * @api
   */
  getAPIRest() {
    return `${this.name}=${this.position_}*${this.collapsed}*${this.collapsible}*${this.tooltip_}*${this.isDraggable}`;
  }

  /**
   * Devuelve la cadena API-REST del plugin en base64
   *
   * @function
   * @public
   * @api
   */
  getAPIRestBase64() {
    return `${this.name}=base64=${M.utils.encodeBase64(this.options)}`;
  }

  /**
   * Esta función devuelve los metadatos del plugin
   *
   * @public
   * @function
   * @api stable
   */
  getMetadata() {
    return this.metadata_;
  }

  /**
   * Esta función elimina el plugin del mapa
   *
   * @public
   * @function
   * @api
   */
  destroy() {
    this.map_.removeControls([this.control_]);
    [this.control_, this.controls_, this.panel_] = [null, null, null];
  }

  /**
   * Esta función devuelve si el plugin recibido por parámetro es instancia de Layerswitcher
   *
   * @public
   * @function
   * @param {M.plugin} plugin para comparar
   * @api
   */
  equals(plugin) {
    if (plugin instanceof Layerswitcher) {
      return true;
    }
    return false;
  }
}
