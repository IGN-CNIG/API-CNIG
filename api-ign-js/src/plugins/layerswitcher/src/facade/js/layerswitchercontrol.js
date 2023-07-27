/* eslint-disable no-param-reassign */
/**
 * @module M/control/LayerswitcherControl
 */
import LayerswitcherImplControl from 'impl/layerswitchercontrol';
import template from '../../templates/layerswitcher';
import { getValue } from './i18n/language';

export default class LayerswitcherControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(options = {}) {
    if (M.utils.isUndefined(LayerswitcherImplControl)) {
      M.exception(getValue('exception.impl'));
    }

    const impl = new LayerswitcherImplControl();
    super(impl, 'Layerswitcher');

    // Fachada del control
    impl.facadeControl = this;

    /**
     * Mapa
     * @private
     * @type {M.Map}
     */
    this.map_ = undefined;

    /**
     * Plantilla del control
     * @private
     * @type {String}
     */
    this.template_ = undefined;

    /**
     * Determina si el plugin es draggable o no
     * @private
     * @type {Boolean}
     */
    this.isDraggable_ = options.isDraggable;

    /**
     * Determina el orden de visualización de las capas
     * @private
     * @type {Boolean}
     */
    this.reverse = options.reverse;

    /**
     * Determina el modo de selección de las capas
     * @private
     * @type {Boolean}
     */
    this.modeSelectLayers = options.modeSelectLayers;

    /**
     * Determina si se ha seleccionado una capa mediante radio
     * @private
     * @type {Boolean}
     */
    this.isCheckedLayerRadio = false;

    /**
     * Listado de capas overlays
     * @private
     * @type {Boolean}
     */
    this.overlayLayers = [];

    /**
     * Determina si se van a mostrar o si se van a ocultar todas las capas
     * @private
     * @type {Boolean}
     */
    this.statusShowHideAllLayers = true;

    /**
     * Herramientas para mostrar en las capas
     * @public
     * @type {Array}
     */
    this.tools = options.tools;

    /**
     * Añadir control transparencia
     * @public
     * @type {Boolean}
     */
    this.isTransparency = false;

    /**
     * Añadir control leyenda
     * @public
     * @type {Boolean}
     */
    this.isLegend = false;
  }

  /**
   * Esta función busca la capa
   *
   * @public
   * @function
   * @param {Event} evtParameter evento que se produce cuando se cambia el valor de la opacidad
   * @api
   */
  findLayer(evt) {
    const layerName = evt.target.getAttribute('data-layer-name');
    const layerURL = evt.target.getAttribute('data-layer-url');
    const layerType = evt.target.getAttribute('data-layer-type');
    let result = [];
    if (!M.utils.isNullOrEmpty(layerName) && !M.utils.isNullOrEmpty(layerURL) &&
      !M.utils.isNullOrEmpty(layerType)) {
      result = this.overlayLayers.filter((l) => {
        return l.name === layerName && l.url === layerURL && l.type === layerType;
      });
    }
    return result;
  }

  /**
   * Esta función crea la vista
   *
   * @public
   * @function
   * @param {M.Map} map mapa donde se añade el plugin
   * @api
   */
  createView(map) {
    this.map_ = map;
    this.tools.forEach((tool) => {
      if (tool === 'transparency') {
        this.isTransparency = true;
      }
      if (tool === 'legend') {
        this.isLegend = true;
      }
    });

    return new Promise((success, fail) => {
      this.getTemplateVariables(map).then((templateVars) => {
        const html = M.template.compileSync(template, {
          vars: templateVars,
        });

        if (this.isDraggable_) {
          M.utils.draggabillyPlugin(this.getPanel(), '#m-layerswitcher-title');
        }

        this.template_ = html;

        this.template_.addEventListener('click', this.clickLayer.bind(this), false);
        this.template_.addEventListener('input', this.inputLayer.bind(this), false);

        this.getPanel().getButtonPanel().addEventListener('click', (e) => {
          if (!e.target.parentElement.classList.contains('collapsed')) {
            this.render();
          }
        }, false);

        this.getImpl().registerEvents(map);

        this.render();
        success(this.template_);
      });
    });
  }

  /**
   * Esta función renderiza la plantilla
   *
   * @public
   * @function
   * @api
   */
  render() {
    this.getTemplateVariables(this.map_).then((templateVars) => {
      const html = M.template.compileSync(template, {
        vars: templateVars,
      });
      this.template_.innerHTML = html.innerHTML;
      // si el modo de selección es radio y no se ha seleccionado ninguna capa se marca la primera
      if (this.modeSelectLayers === 'radio' && this.isCheckedLayerRadio === false) {
        const radioButtons = this.template_.querySelectorAll('input[type=radio]');
        if (radioButtons.length > 0) {
          this.isCheckedLayerRadio = true;
          radioButtons[0].click();
        }
      }
    });
  }

  /**
   * Esta función devuelve las variables para la plantilla
   *
   * @public
   * @function
   * @api
   */
  getTemplateVariables(map) {
    return new Promise((success, fail) => {
      // gets base layers and overlay layers
      if (!M.utils.isNullOrEmpty(map)) {
        this.overlayLayers = map.getRootLayers().filter((layer) => {
          const isTransparent = (layer.transparent === true);
          const displayInLayerSwitcher = (layer.displayInLayerSwitcher === true);
          return isTransparent && displayInLayerSwitcher;
        });

        this.overlayLayers = this.reorderLayers(this.overlayLayers);

        const overlayLayersPromise =
          Promise.all(this.overlayLayers.map(this.parseLayerForTemplate_.bind(this)));
        overlayLayersPromise.then((parsedOverlayLayers) => {
          success({
            overlayLayers: parsedOverlayLayers,
            translations: {
              layers: getValue('layers'),
              show_hide: getValue('show_hide'),
            },
            allVisible: !this.statusShowHideAllLayers,
            isRadio: this.modeSelectLayers === 'radio',
            isEyes: this.modeSelectLayers === 'eyes',
            isTransparency: this.isTransparency,
            isLegend: this.isLegend,
          });
        });
      }
    });
  }

  /**
   * Esta función detecta cuando se hace click en la plantilla
   *
   * @public
   * @function
   * @api
   */
  clickLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    const layerName = evt.target.getAttribute('data-layer-name');
    const layerURL = evt.target.getAttribute('data-layer-url');
    const layerType = evt.target.getAttribute('data-layer-type');
    const selectLayer = evt.target.getAttribute('data-select-type');

    if (evt.target.id === 'm-layerswitcher-hsalllayers') {
      this.showHideAllLayers();
    } else if (!M.utils.isNullOrEmpty(layerName) && !M.utils.isNullOrEmpty(layerURL) &&
      !M.utils.isNullOrEmpty(layerType)) {
      let layer = this.findLayer(evt);
      if (layer.length > 0) {
        layer = layer[0];
        if (evt.target.className.indexOf('m-layerswitcher-check') > -1 && selectLayer === 'eye') {
          // show hide layer
          if (evt.target.classList.contains('m-layerswitcher-check')) {
            if (layer.transparent === true || !layer.isVisible()) {
              layer.setVisible(!layer.isVisible());
              this.render();
            }
          }
        } else if (evt.target.className.indexOf('m-layerswitcher-check') > -1 && selectLayer === 'radio') {
          this.overlayLayers.forEach((l) => {
            if (l.name === layerName && l.url === layerURL && l.type === layerType) {
              l.checkedLayer = 'true';
              l.setVisible(true);
            } else {
              l.checkedLayer = 'false';
              l.setVisible(false);
            }
          });
          this.render();
        } else if (evt.target.className.indexOf('m-layerswitcher-image') > -1) {
          const legend = evt.target.parentElement.parentElement.parentElement.querySelector('.m-layerswitcher-legend');
          const legendUrl = layer.getLegendURL();
          if (legendUrl instanceof Promise) {
            legendUrl.then((url) => {
              legend.querySelector('img').src = url;
            });
          } else {
            legend.querySelector('img').src = legendUrl;
          }
          if (legend.style.display === 'block') {
            legend.style.display = 'none';
          } else {
            legend.style.display = 'block';
          }
        }
      }
    }
    evt.stopPropagation();
  }

  /**
   * Esta función ordena todas las capas
   *
   * @public
   * @param {Array<M.Layer>} layers listado de capas para ordenar
   * @function
   * @api
   */
  reorderLayers(layers) {
    const result = layers.sort((layer1, layer2) => layer1.getZIndex() - layer2.getZIndex());
    if (this.reverse) {
      result.reverse();
    }
    return result;
  }

  /**
   * Esta función monta objeto con propiedades de la capa para la plantilla
   *
   * @public
   * @param {M.Layer} layer capa para parsear
   * @function
   * @api
   */
  parseLayerForTemplate_(layer) {
    const layerTitle = layer.legend || layer.name;
    return new Promise((success) => {
      const layerVarTemplate = {
        title: layerTitle,
        type: layer.type,
        visible: (layer.isVisible() === true),
        id: layer.name,
        url: layer.url,
        outOfRange: !layer.inRange(),
        checkedLayer: layer.checkedLayer || 'false',
        opacity: layer.getOpacity(),
      };
      success(layerVarTemplate);
    });
  }

  /**
   * Esta función gestiona el control de la opacidad de las capas
   *
   * @public
   * @function
   * @param {Event} evtParameter evento que se produce cuando se cambia el valor de la opacidad
   * @api
   */
  inputLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    if (!M.utils.isNullOrEmpty(evt.target)) {
      const layer = this.findLayer(evt);
      if (layer.length > 0) {
        evt.stopPropagation();
        layer[0].setOpacity(evt.target.value);
      }
    }
  }

  /**
   * Esta función muestra/oculta todas las capas
   *
   * @public
   * @function
   * @param {Event} evtParameter evento que se produce cuando se cambia el valor de la opacidad
   * @api
   */
  showHideAllLayers() {
    this.statusShowHideAllLayers = !this.statusShowHideAllLayers;
    this.overlayLayers.forEach((layer) => {
      layer.setVisible(this.statusShowHideAllLayers);
    });
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api
   */
  equals(control) {
    return control instanceof LayerswitcherControl;
  }
}
