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

  // inputLayer(evtParameter) {
  //   const evt = (evtParameter || window.event);
  //   if (!M.utils.isNullOrEmpty(evt.target)) {
  //     const layerName = evt.target.getAttribute('data-layer-name');
  //     const layerURL = evt.target.getAttribute('data-layer-url');
  //     const layerType = evt.target.getAttribute('data-layer-type');
  //     if (!M.utils.isNullOrEmpty(layerName) &&
  //       !M.utils.isNullOrEmpty(layerURL) && !M.utils.isNullOrEmpty(layerType)) {
  //       evt.stopPropagation();
  //       const layer = this.map_.getLayers().filter((l) => {
  //         return l.name === layerName && l.url === layerURL && l.type === layerType;
  //       })[0];
  //       if (evt.target.classList.contains('m-layerswitcher-transparency')) {
  //         layer.setOpacity(evt.target.value);
  //       }
  //     }
  //   }
  // }
  inputLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    if (!M.utils.isNullOrEmpty(evt.target)) {
      const layerName = evt.target.getAttribute('data-layer-name');
      if (!M.utils.isNullOrEmpty(layerName)) {
        evt.stopPropagation();
        const layer = this.map_.getLayers().filter(l => l.name === layerName)[0];
        layer.setOpacity(evt.target.value);
      }
    }
  }


  showHideAllLayers() {
    this.statusShowHideAllLayers = !this.statusShowHideAllLayers;
    this.overlayLayers.forEach((layer) => {
      layer.setVisible(this.statusShowHideAllLayers);
    });
  }


  clickLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    const layerName = evt.target.getAttribute('data-layer-name');
    const layerURL = evt.target.getAttribute('data-layer-url');
    const layerType = evt.target.getAttribute('data-layer-type');
    const selectLayer = evt.target.getAttribute('data-select-type');

    if (evt.target.id === 'm-layerswitcher-hsalllayers') {
      this.showHideAllLayers();
    } else if (selectLayer === 'eye' && !M.utils.isNullOrEmpty(layerName) && !M.utils.isNullOrEmpty(layerURL) &&
      !M.utils.isNullOrEmpty(layerType)) {
      const layer = this.map_.getLayers().filter((l) => {
        return l.name === layerName && l.url === layerURL && l.type === layerType;
      })[0];
      // show hide layer
      if (evt.target.classList.contains('m-layerswitcher-check')) {
        if (layer.transparent === true || !layer.isVisible()) {
          layer.setVisible(!layer.isVisible());
          this.render();
        }
      }
    } else if (selectLayer === 'radio' && !M.utils.isNullOrEmpty(layerName) && !M.utils.isNullOrEmpty(layerURL) &&
      !M.utils.isNullOrEmpty(layerType)) {
      this.overlayLayers.forEach((l) => {
        if (l.name === layerName && l.url === layerURL && l.type === layerType) {
          if (this.modeSelectLayers === 'radio') {
            l.checkedLayer = 'true';
          }
          l.setVisible(true);
        } else {
          if (this.modeSelectLayers === 'radio') {
            l.checkedLayer = 'false';
          }
          l.setVisible(false);
        }
      });
    }
    evt.stopPropagation();
  }

  /**
   * @function
   * @public
   * @api
   */
  render() {
    this.getTemplateVariables(this.map_).then((templateVars) => {
      const html = M.template.compileSync(template, {
        vars: templateVars,
      });
      this.template_.innerHTML = html.innerHTML;
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
   * @function
   * @public
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
            },
            allVisible: !this.statusShowHideAllLayers,
            isRadio: this.modeSelectLayers === 'radio',
            isEyes: this.modeSelectLayers === 'eyes',
          });
        });
      }
    });
  }

  /**
   * @function
   * @public
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
   *
   *
   * @private
   * @function
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
