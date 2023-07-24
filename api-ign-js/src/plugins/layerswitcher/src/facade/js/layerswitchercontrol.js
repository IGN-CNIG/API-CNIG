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

    // facade control goes to impl as reference param
    impl.facadeControl = this;

    /**
     * Map
     * @private
     * @type {Object}
     */
    this.map_ = undefined;

    /**
     * Template
     * @private
     * @type {String}
     */
    this.template_ = undefined;

    /**
     * Option to allow the plugin to be draggable or not
     * @private
     * @type {Boolean}
     */
    this.isDraggable_ = options.isDraggable;

    this.reverse = options.reverse;

    this.overlayLayers = [];

    this.statusShowHideAllLayers = true;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
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

        this.getPanel().getButtonPanel().addEventListener('click', (e) => {
          if (!e.target.parentElement.classList.contains('collapsed')) {
            this.render();
          }
        }, false);

        this.getImpl().registerEvents(map);

        this.template_.addEventListener('click', this.clickLayer.bind(this), false);

        this.render();
        success(this.template_);
      });
    });
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
    if (evt.target.id === 'm-layerswitcher-hsalllayers') {
      this.showHideAllLayers();
    } else if (!M.utils.isNullOrEmpty(layerName) && !M.utils.isNullOrEmpty(layerURL) &&
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
        overlayLayersPromise.then(parsedOverlayLayers => success({
          overlayLayers: parsedOverlayLayers,
          translations: {
            layers: getValue('layers'),
          },
          allVisible: !this.statusShowHideAllLayers,
        }));
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
