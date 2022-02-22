/**
 * @module M/control/LyrdropdownControl
 */

import LyrdropdownImplControl from 'impl/lyrdropdowncontrol';
import template from 'templates/lyrdropdown';
import { getValue } from './i18n/language'; //e2m: Multilanguage support. Alias -> getValue is too generic

export default class LyrdropdownControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(values) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(LyrdropdownImplControl)) {
      M.exception(getValue('exception'));
    }

    // 2. implementation of this control
    const impl = new LyrdropdownImplControl();
    super(impl, 'Lyrdropdown');

    //Getting Plugin Parameters

    /**
     * Position plugin
     * @public
     * @type {String}
     */
    this.pluginOnLeft = values.pluginOnLeft;

    /**
     * All layers
     * @public
     * @public {Array}
     */
    this.layers = values.layers;

    /**
     * Collapsible
     * @public
     * @public {boolean}
     */
    this.collapsible = values.collapsible;

    /**
     * Collapsed
     * @public
     * @public {boolean}
     */
    this.collapsed = values.collapsed;

    /**
     * layerSelected
     * @public
     * @type { M.layer }
     */
    this.layerSelected = null;

    /**
     * Template
     * @public
     * @type { HTMLElement }
     */
    this.template = null;
  }

  /**
   * This function creates the view
   *
   * @public
   * @function
   * @param {M.Map} map to add the control
   * @api stable
   */
  createView(map) {
    this.map = map;
    return new Promise((success, fail) => {
      //e2m: Transform stringLyr definition to apicnigLyr
      this.layers = this.transformToLayers(this.layers);
      //e2m: getting layers array with name and legend for plugin
      let capas = this.layers.map((layer) => {
        return layer instanceof Object ? {  name: layer.name, legend: layer.legend } : { name: layer, legend: layer };
      });
      //e2m: adding language dictionary
      let options = '';
      if (capas.length > 1) {
        options = {
          jsonp: true,
          vars: {
            options: capas,
            translations: {
              tooltip: getValue('tooltip'),
              nolayertext: getValue('nolayertext'),
            } ,
          },
        };
      }

      //e2m: config a helper in Handlebars for embedding conditionals in template
      Handlebars.registerHelper('ifCond', (v1, v2, options) => {
        return v1 === v2 ? options.fn(this) : options.inverse(this);
      });

      this.template = M.template.compileSync(template, options);
      //Si no hay capas a las que aplicar la transparencia, el plugin no funciona e informa
      if (this.layers.length === 0) {
        M.dialog.error(getValue('no_layers_plugin'));
      } else {
        //M.dialog.info(getValue('title'));
        this.activate();
      }

      //Events on template component
      this.template.querySelector('#m-lyrdropdown-selector').addEventListener('change', (evt) => {
        console.log("Entro:" + evt.target.value);
        const layerSel = this.map.getLayers().filter((layer) => {
          return layer.name === evt.target.value;
        });
        // Get selected layer from layer array
        console.log(this.layerSelected);
        this.layerSelected.setVisible(false);
        this.removeEffects();
        if (layerSel.length === 0){
          /**
           * Se ha seleccionado la opción de eliminar capa
           */
          //this.getImpl().removeLayer(layer.getImpl().getOL3Layer());
          return; // No layer option is selected
        }

        this.layerSelected = layerSel[0];
        this.getImpl().setLayer(this.layerSelected);
      });

      // Añadir código dependiente del DOM
      success(this.template);
    });
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
   if (this.layerSelected === null) this.layerSelected = this.layers[0];
   let names = this.layers.map((layer) => {
     return layer instanceof Object ? { name: layer.name } : { name: layer };
   });

   if (names.length >= 1) {
     this.template.querySelector('#m-lyrdropdown-selector').disabled = false;
   }
  }

  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {

    if (this.layerSelected === null) this.layerSelected = this.layers[0];
    let names = this.layers.map((layer) => {
      return layer instanceof Object ? { name: layer.name } : { name: layer };
    });

    try {
      this.removeEffects();
      this.layerSelected.setVisible(false);
      if (names.length >= 1) {
        this.template.querySelector('#m-lyrdropdown-selector').disabled = true;
      }
    } catch (error) {
      console.error(error);
    }

  }

  /**
   * This function gets activation button
   *
   * @public
   * @function
   * @param {HTML} html of control
   * @api stable
   */
  getActivationButton(html) {
    return html.querySelector('.m-lyrdropdown button');
  }

  /**
   * This function is called to remove the effects
   *
   * @public
   * @function
   * @api stable
   */
  removeEffects() {
    console.log('removeEffects');
    this.getImpl().removeEffects();
  }

  /**
   * Transform StringLayers to Mapea M.Layer
   *
   * WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*EPSG:25830*PNOA
   * WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo
   *
   * @public
   * @function
   * @api stable
   * @param {string}
   * @return
   */
 /**
   * Transform StringLayers to Mapea M.Layer
   * Entra tantas veces como mapas lienzo activos haya.
   * @public
   * @function
   * @api stable
   * @param {string}
   * @return
   */
  transformToLayers(layers) {

    const transform = layers.map((layer) => {
      let newLayer = null;
      if (!(layer instanceof Object)) {
        if (layer.indexOf('*') >= 0) {
          const urlLayer = layer.split('*');
          if (urlLayer[0].toUpperCase() === 'WMS') {
            newLayer = new M.layer.WMS({
              url: urlLayer[2],
              name: urlLayer[3],
              legend: urlLayer[1],
            });

            if (this.map.getLayers().filter(l => newLayer.name.includes(l.name)).length > 0) {
              newLayer = this.map.getLayers().filter(l => newLayer.name.includes(l.name))[0];
              newLayer.legend = urlLayer[1] || newLayer.name;
            } else {
              this.map.addLayers(newLayer);
            }
          } else if (urlLayer[0].toUpperCase() === 'WMTS') {

            /*newLayer = new M.layer.WMTS({
              url: urlLayer[2] + '?',
              name: urlLayer[3],
              legend: urlLayer[1],
              matrixSet: urlLayer[4],
              transparent: true,              // Es una capa Overlay -> zIndex > 0
              displayInLayerSwitcher: false,  // No aparece en el TOC
              queryable: false,               // No GetFeatureInfo
              visibility: false,              // Visible a false por defecto
              format: urlLayer[5],
            }), this.map.addWMTS(newLayer);*/

            newLayer = new M.layer.WMTS({
              url: urlLayer[2],
              name: urlLayer[3],
              legend: urlLayer[1],
              matrixSet: urlLayer[4],
              transparent: true,              // Es una capa Overlay -> zIndex > 0
              displayInLayerSwitcher: false,  // No aparece en el TOC
              queryable: false,               // No GetFeatureInfo
              visibility: false,              // Visible a false por defecto
              format: urlLayer[5],
            });
            this.map.addWMTS(newLayer);
            //this.map.addLayers(newLayer);
          }
        } else {
          const layerByName = this.map.getLayers().filter(l => layer.includes(l.name))[0];
          newLayer = this.isValidLayer(layerByName) ? layerByName : null;
        }
      } else if (layer instanceof Object) {
        const layerByObject = this.map.getLayers().filter(l => layer.name.includes(l.name))[0];
        newLayer = this.isValidLayer(layerByObject) ? layerByObject : null;
      }

      if (newLayer !== null) {
        if (newLayer.getImpl().getOL3Layer() === null) {
          setTimeout(() => {
            if (newLayer.type === 'WMS' || newLayer.type === 'WMTS') {
              newLayer.load = true;
            } else if (newLayer.type === 'WMTS') {
              newLayer.facadeLayer_.load = true;
            }
          }, 1000);
        } else {
          newLayer.load = true;
        }

        newLayer.displayInLayerSwitcher = false;
        newLayer.setVisible(false);
        return newLayer;
      } else {
        this.layers.remove(layer);
      }
    }, this);

    return (transform[0] === undefined) ? [] : transform;
  }
 

  /**
   * This function transform string to M.Layer
   *
   * @public
   * @function
   * @api stable
   * @param {string}
   * @return {Boolean}
   */
  isValidLayer(layer) {
    return layer.type === 'WMTS' || layer.type === 'WMS';
  }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof LyrdropdownControl;
  }
}
