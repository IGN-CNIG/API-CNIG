/**
 * @module M/control/ComparatorsControl
 */

import template from '../../templates/comparators';
import ComparatorsImpl from '../../impl/ol/js/comparators';
import { getValue } from './i18n/language';
import MirrorpanelControl from './mirrorpanelcontrol';
import LyrCompareControl from './lyrcomparecontrol';
import TransparencyControl from './transparencycontrol';
import { transformToStringLayers, checkLayers, getNameString } from './utils';

export default class ComparatorsControl extends M.Control {
  /**
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api
   */
  constructor(isDraggable, order, options) {
    if (M.utils.isUndefined(ComparatorsImpl)) {
      M.exception(getValue('exception.impl'));
    }

    const impl = new ComparatorsImpl();
    super(impl, 'Comparators');

    /**
     * Option to allow the plugin to be draggable or not
     * @private
     * @type {Boolean}
     */
    this.isDraggable_ = isDraggable || false;

    /**
     * Order of plugin
     * @public
     * @type {Number}
     */
    this.order = order;

    /**
     * Plugin parameters
     * @public
     * @type {Object}
     */
    this.options = options;

    this.layersPlugin = this.options.listLayers || [
      'WMS*Huellas Sentinel2*https://wms-satelites-historicos.idee.es/satelites-historicos*teselas_sentinel2_espanna*true',
      'WMS*Invierno 2022 falso color natural*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2022invierno_432-1184*true',
      'WMS*Invierno 2022 falso color infrarrojo*https://wms-satelites-historicos.idee.es/satelites-historicos*SENTINEL.2022invierno_843*true',
      'WMS*Filomena*https://wms-satelites-historicos.idee.es/satelites-historicos*Filomena*true',
    ];

    this.layersDrop = [];

    this.defaultCompareMode = this.options.defaultCompareMode || false;

    this.lyrsMirrorMinZindex = this.options.lyrsMirrorMinZindex || 50;

    this.mirrorpanelParams = this.options.mirrorpanelParams || false;
    if (this.mirrorpanelParams) {
      this.mirrorpanelParams.enabledKeyFunctions = this.options.enabledKeyFunctions || false;
      this.mirrorpanelParams.tooltip = (this.mirrorpanelParams.tooltip) ? this.mirrorpanelParams.tooltip : getValue('tooltipMirrorpanel');
    }

    this.lyrcompareParams = this.options.lyrcompareParams || false;
    if (this.lyrcompareParams) {
      this.lyrcompareParams.tooltip = (this.lyrcompareParams.tooltip) ? this.lyrcompareParams.tooltip : getValue('tooltipLyr');
    }

    this.transparencyParams = this.options.transparencyParams;
    if (this.transparencyParams) {
      this.transparencyParams.enabledKeyFunctions = this.options.enabledKeyFunctions || false;
      this.transparencyParams.tooltip = (this.transparencyParams.tooltip) ? this.transparencyParams.tooltip : getValue('tooltipTransparency');
    }

    this.layersExternalPlugins = [];

    this.control = null;
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
    this.layersPlugin = [];

    if (this.options.listLayers) {
      this.layersPlugin = this.options.listLayers
        .map(l => ((l instanceof Object) ? transformToStringLayers(l, this.map_) : l));
    }

    if (this.mirrorpanelParams.enabledDisplayInLayerSwitcher) {
      this.layersPlugin = this.layersPlugin.concat(this.map_
        .getLayers()
        .filter(l => l.displayInLayerSwitcher && (l.type === 'WMS' || l.type === 'WMTS'))
        .map(l => transformToStringLayers(l, this.map_)));

      this.addLayersEventMap_();
      this.removeLayersEventMap_();
    }

    // Gestor de los diferentes controles
    this.controls = [
      {
        id: 'mirrorpanel',
        buttonsID: 'mirrorpanel-btn',
        controlParam: [
          this.mirrorpanelParams,
          this.layersPlugin,
          this.map_,
          this.defaultCompareMode,
        ],
        controlCreate: param => new MirrorpanelControl(...param),
        control: null,
        active: false,
      },
      {
        id: 'lyrcompare',
        buttonsID: 'lyrcompare-btn',
        controlParam: [
          this.lyrcompareParams,
          this.layersPlugin,
          this.map_,
        ],
        controlCreate: param => new LyrCompareControl(...param),
        control: null,
        active: false,
      },
      {
        id: 'transparency',
        buttonsID: 'transparency-btn',
        controlParam: [
          this.transparencyParams,
          this.layersPlugin,
          this.map_,
        ],
        controlCreate: param => new TransparencyControl(...param),
        control: null,
        active: false,
      },
    ];


    return new Promise((success, fail) => {
      this.html = M.template.compileSync(template, {
        vars: {
          mirrorpanelParams: this.mirrorpanelParams,
          lyrcompareParams: this.lyrcompareParams,
          transparencyParams: this.transparencyParams,
          translations: {
            headertitle: getValue('tooltip'),
            mirrorpanelParams_tooltip: this.mirrorpanelParams.tooltip,
            lyrcompareParams_tooltip: this.lyrcompareParams.tooltip,
            transparencyParams_tooltip: this.transparencyParams.tooltip,
          },
        },
      });

      this.controls.forEach(({ buttonsID, controlParam }) => {
        if (controlParam[0]) {
          this.html.querySelector(`#${buttonsID}`).addEventListener('click', ({ target }) => this.event_(target));
          this.html.querySelector(`#${buttonsID}`).addEventListener('keydown', ({ key, target }) => (key === 'Enter') && this.event_(target));
        }
      });

      if (this.isDraggable_) {
        M.utils.draggabillyPlugin(this.getPanel(), '#m-comparators-title');
      }

      this.accessibilityTab_(this.html);


      setTimeout(() => {
        this.defaultCompareMode_();
      }, 500);

      success(this.html);
    });
  }

  /**
   * Este método se encarga de gestionar y activar los controles
   * @param {Node} target
   * @param {M.Control} control
   * @private
   * @function
   * @api stable
   */
  event_(target) {
    this.controls.forEach((c) => {
      const controlObjet = c;
      controlObjet.active = (target.id === controlObjet.buttonsID) ? !controlObjet.active : false;
    });
    this.eventActive_();
  }

  eventActive_() {
    this.removeLayers_();
    this.controls.forEach((c) => {
      if (c.controlParam[0]) {
        if (c.active) {
          this.html.querySelector(`#${c.buttonsID}`).classList.add('activatedComparators');

          const control = c.controlCreate(c.controlParam);
          // eslint-disable-next-line no-param-reassign
          c.control = control;
          this.control = control;
          control.active(this.html);
        } else {
          this.html.querySelector(`#${c.buttonsID}`).classList.remove('activatedComparators');
          if (c.control) c.control.deactivate();
          // eslint-disable-next-line no-param-reassign
          c.control = null;
        }
      }
    });
  }

  // Añadir las capas que se van añadiendo
  addLayersEventMap_() {
    this.map_.on(M.evt.ADDED_WMTS, (layer) => {
      const [activeLayerComparators, otherLayers] = checkLayers(layer, this.layersPlugin);

      if (activeLayerComparators) { activeLayerComparators.setZIndex(this.lyrsMirrorMinZindex); }
      if (otherLayers.length === 0) return;

      otherLayers.forEach((l) => {
        if (l.displayInLayerSwitcher) {
          this.layersExternalPlugins.push(l);
          ['mapLASelect', 'mapLBSelect', 'mapLCSelect', 'mapLDSelect'].forEach((id) => {
            const select = document.querySelector(`#${id}`);
            select.innerHTML += `<option disabled="true" id="l_${l.name}" value="layersExternalPlugins">${l.legend}</option>`;
          });
        }
      });
    });

    this.map_.on(M.evt.ADDED_WMS, (layer) => {
      const [activeLayerComparators, otherLayers] = checkLayers(layer, this.layersPlugin);

      if (activeLayerComparators) { activeLayerComparators.setZIndex(this.lyrsMirrorMinZindex); }
      if (otherLayers.length === 0) return;

      otherLayers.forEach((l) => {
        if (l.displayInLayerSwitcher) {
          this.layersExternalPlugins.push(l);
          ['mapLASelect', 'mapLBSelect', 'mapLCSelect', 'mapLDSelect'].forEach((id) => {
            const select = document.querySelector(`#${id}`);
            select.innerHTML += `<option disabled="true" id="l_${l.name}" value="layersExternalPlugins">${l.legend}</option>`;
          });
        }
      });
    });
  }

  // Eliminar las capas que se fueron añadiendo
  removeLayersEventMap_() {
    this.map_.on(M.evt.REMOVED_LAYER, (layer) => {
      const checkNewLayer = checkLayers(layer, this.layersPlugin);
      if (checkNewLayer.length === 0) return;
      layer.forEach((capa) => {
        document.querySelectorAll(`#l_${capa.name}`).forEach((el) => {
          el.parentNode.removeChild(el);
        });
      });
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
    return control instanceof ComparatorsControl;
  }

  /**
   * This function deactivates the activated control
   * before activating another
   *
   * @public
   * @function
   * @param {Node} html
   * @param {String} control
   * @api
   */
  deactive(html, control) {
    const active = html.querySelectorAll('#m-comparators-previews .activated')[0];
    if (active && !active.id.includes(control)) {
      if (active.id === 'm-comparators-zoomextent') {
        this.zoomextentControl.deactive();
      }
      active.classList.remove('activated');
      const container = document.querySelector('#div-contenedor-comparators');
      if (container && container.children.length > 2) {
        container.removeChild(container.children[2]);
      }
    }
  }

  /**
   * This function changes number of tabindex
   *
   * @public
   * @function
   * @param {Node} html
   * @api
   */
  accessibilityTab_(html) {
    html.querySelectorAll('[tabindex="0"]').forEach(el => el.setAttribute('tabindex', this.order));
  }

  defaultCompareViz_() {
    if (!this.controls[0].active || !this.options.defaultCompareViz) return;
    const { defaultCompareViz } = this.options;
    this.options.modeViz = defaultCompareViz;
  }

  /**
   * This function destroys controls inside this control
   *
   * @public
   * @function
   * @api
   */
  deactivate() {
    this.controls.forEach((c) => {
      if (c.control) { c.control.destroy(); }
    });

    this.order = null;
    this.isDraggable_ = null;
    this.options = null;
    this.layersDrop = null;
    this.defaultCompareMode = null;
    this.lyrsMirrorMinZindex = null;
    this.mirrorpanelParams = null;
    this.lyrcompareParams = null;
    this.transparencyParams = null;
    this.layersExternalPlugins = null;
    this.html = null;
    this.map_ = null;
    this.controls = null;
  }

  removeLayers_() {
    this.layersPlugin.forEach((l) => {
      const layerName = getNameString(l);
      const filter = this.map_.getLayers().filter(({ name }) => name === layerName);
      this.map_.removeLayers(filter);
    });
  }

  defaultCompareMode_() {
    if (!this.options.defaultCompareMode || this.options.defaultCompareMode === 'none') return;
    // mirror - curtain - spyeye - none
    const dic = {
      mirror: 'mirrorpanel',
      curtain: 'lyrcompare',
      spyeye: 'transparency',
    };

    this.controls.forEach((c) => {
      const controlObjet = c;
      controlObjet.active = (dic[this.options.defaultCompareMode] === controlObjet.id)
        ? !controlObjet.active : false;
    });

    this.eventActive_();
  }
}
