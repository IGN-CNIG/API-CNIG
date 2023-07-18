/**
 * @module M/control/LayerswitcherControl
 */

/*
eslint no-param-reassign: ["error", { "props": true, "ignorePropertyModificationsFor": ["item"] }]
*/

import Sortable from 'sortablejs';
import LayerswitcherImplControl from 'impl/layerswitchercontrol';
import template from '../../templates/layerswitcher';
import { getValue } from './i18n/language';

export default class LayerswitcherControl extends M.Control {
  /**
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(order) {
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

    this.order = order;
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

        this.template_ = html;
        success(html);
        this.render();
      });
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
        const overlayLayers = map.getRootLayers().filter((layer) => {
          const isTransparent = (layer.transparent === true);
          const displayInLayerSwitcher = (layer.displayInLayerSwitcher === true);
          const isRaster = ['wms', 'wmts'].indexOf(layer.type.toLowerCase()) > -1;
          const isNotWMSFull = !((layer.type === M.layer.type.WMS) &&
            M.utils.isNullOrEmpty(layer.name));
          return ((isTransparent && displayInLayerSwitcher && isRaster && isNotWMSFull) || (layer.type === 'OGCAPIFeatures'));
        }).reverse();

        const overlayLayersPromise = Promise.all(overlayLayers.map(this.parseLayerForTemplate_));
        overlayLayersPromise.then(parsedOverlayLayers => success({
          layers: overlayLayers,
          overlayLayers: parsedOverlayLayers,
          translations: {
            layers: getValue('layers'),
            add_service: getValue('add_service'),
            show_hide: getValue('show_hide'),
            zoom: getValue('zoom'),
            info_metadata: getValue('info_metadata'),
            change_style: getValue('change_style'),
            remove_layer: getValue('remove_layer'),
            drag_drop: getValue('drag_drop'),
          },
        }));
      }
    });
  }

  /**
   * @function
   * @public
   * @api
   */
  render(scroll) {
    this.getTemplateVariables(this.map_).then((templateVars) => {
      const html = M.template.compileSync(template, {
        vars: templateVars,
      });
      this.accessibilityTab(html);

      this.template_.innerHTML = html.innerHTML;
      const layerList = this.template_.querySelector('.m-layerswitcher-container .m-layers');
      const layers = templateVars.layers;
      if (layerList !== null) {
        Sortable.create(layerList, {
          animation: 150,
          ghostClass: 'm-layerswitcher-gray-shadow',
          filter: '.m-opacity-container',
          preventOnFilter: false,
          onEnd: (evt) => {
            const from = evt.from;
            let maxZIndex = Math.max(...(layers.map((l) => {
              return l.getZIndex();
            })));
            from.querySelectorAll('li.m-layer div.m-visible-control span').forEach((elem) => {
              const name = elem.getAttribute('data-layer-name');
              const url = elem.getAttribute('data-layer-url');
              const filtered = layers.filter((layer) => {
                return layer.name === name && layer.url === url;
              });

              if (filtered.length > 0) {
                filtered[0].setZIndex(maxZIndex);
                maxZIndex -= 1;
              }
            });
          },
        });

        if (scroll !== undefined) {
          document.querySelector('.m-panel.m-plugin-layerswitcher.opened ul.m-layers').scrollTop = scroll;
        }
      }
    });
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api
   */
  activate() {
    super.activate();
  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api
   */
  deactivate() {
    super.deactivate();
  }
  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api
   */
  getActivationButton(html) {
    return html.querySelector('.m-layerswitcher button');
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

  /**
   *
   *
   * @private
   * @function
   */
  parseLayerForTemplate_(layer) {
    let ogcapiFeaturesStyles;
    const layerTitle = layer.legend || layer.name;
    const hasMetadata = !M.utils.isNullOrEmpty(layer.capabilitiesMetadata) &&
      !M.utils.isNullOrEmpty(layer.capabilitiesMetadata.abstract);

    if (layer.type === 'OGCAPIFeatures') {
      if (!M.utils.isNullOrEmpty(layer.otherStyles)) {
        ogcapiFeaturesStyles = layer.otherStyles.length > 1;
      }
    }

    return new Promise((success, fail) => {
      const layerVarTemplate = {
        visible: (layer.isVisible() === true),
        id: layer.name,
        title: layerTitle,
        outOfRange: !layer.inRange(),
        opacity: layer.getOpacity(),
        metadata: hasMetadata,
        type: layer.type,
        tag: layer.type === 'OGCAPIFeatures' ? 'Features' : layer.type,
        hasStyles: hasMetadata && layer.capabilitiesMetadata.style.length > 1,
        hasOgcapiFeaturesStyles: ogcapiFeaturesStyles,
        url: layer.url,
      };

      const legendUrl = layer.getLegendURL();
      if (legendUrl instanceof Promise) {
        legendUrl.then((url) => {
          layerVarTemplate.legend = url;
          success(layerVarTemplate);
        });
      } else {
        layerVarTemplate.legend = layer.type !== 'KML' ? legendUrl : null;
        success(layerVarTemplate);
      }
    });
  }


  accessibilityTab(html) {
    html.querySelectorAll('[tabindex="0"]').forEach(el => el.setAttribute('tabindex', this.order));
  }
}
