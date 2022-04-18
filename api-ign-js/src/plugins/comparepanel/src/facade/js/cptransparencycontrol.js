/**
 * @module M/control/TransparencyControl
 */

import TransparencyImplControl from 'impl/cptransparencycontrol';
import template from 'templates/cptransparency';
import { getValue } from './i18n/language';

export default class TransparencyControl extends M.Control {
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
    if (M.utils.isUndefined(TransparencyImplControl)) {
      M.exception(getValue('exception'));
    }

    // 2. implementation of this control
    const impl = new TransparencyImplControl();
    super(impl, 'Transparency');

    /**
     * All layers
     * @public
     * @public {Array}
     */
    this.layers = values.layers;
    /**
     * Radius selected
     * @private
     * @type {Number}
     */
    this.radius = values.radius;
    /**
     * Layer selected
     * @public
     * @type {M.layer}
     */
    this.layerSelected = null;

    /**
     * Layer selected
     * @public
     * @type {M.layer}
     */
     this.freeze = false;

    /**
     * Template
     * @public
     * @type { HTMLElement }
     */
    this.template = null;

    /**
     * Set fixed SpyEye
     * @private
     * @type {boolean}
     */
     this.freezeSpyEye = false;

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
      this.layers = this.transformToLayers(this.layers);
      
      let names = this.layers.map((layer) => {
        return layer instanceof Object ? { name: layer.name, legend: layer.legend } : { name: layer, legend: layer };
      });

      let options = {
        jsonp: true,
        vars: {
          translations: {
            transparency: getValue('transparency'),
            radius: getValue('radius'),
            layers: getValue('layers'),
          },
        },
      };

      if (names.length >= 1) {
        options.vars.options = names;
      }

      this.template = M.template.compileSync(template, options);

      // Radius
      this.template.querySelector('#input-transparent-radius').value = this.radius;
      this.template.querySelector('#input-transparent-radius').addEventListener('change', (evt) => {
        this.radius = Number(evt.target.value);
        this.getImpl().setRadius(this.radius);
      });

      if (this.layers.length === 0 || this.layers === '') {
        M.dialog.error(getValue('errorLayer'));
      } else {
        if (options !== '') {
          this.template.querySelector('select').disabled = true;
          this.template.querySelector('input').disabled = true;
          this.template.querySelector('select').addEventListener('change', (evt) => {
            
            this.layerSelected.setVisible(false);
            this.removeEffects();
            const layer = this.layers.filter((layer) => {
              return layer.name === evt.target.value;
            });

            this.layerSelected = layer[0];
            this.getImpl().effectSelected(this.layerSelected, this.radius, this.freeze);
          });
        }
      }

      success(this.template);
    });
  }

  setDefaultLayer(){

    console.log("Activación remota");
    //this.template.querySelector('select').disabled = false;
    //this.template.querySelector('input').disabled = false;
    //this.getImpl().effectSelected(this.layerSelected, this.radius);

  }


  manageLyrAvailable(lyrList){
    
    if (this.template === null){
      return;
    }

    try {
      let dropDownContainer = null;
      dropDownContainer = this.template.querySelector('#m-transparency-lyr');
      for (let  iOpt =1; iOpt < dropDownContainer.options.length; iOpt++) {
        dropDownContainer.options[iOpt].disabled = !lyrList.includes(dropDownContainer.options[iOpt].value);
      }
    } catch (error) {
      console.log(error);
    }

  }


  /**
   * Activate Select/Input
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    console.log("Activate SpyEye 2S");
    if (this.layerSelected === null) this.layerSelected = this.layers[0];
    let names = this.layers.map((layer) => {
      return layer instanceof Object ? { name: layer.name } : { name: layer };
    });
    

    if (names.length >= 1) {
      this.template.querySelector('select').disabled = false;
      this.template.querySelector('input').disabled = false;
    }

    this.getImpl().effectSelected(this.layerSelected, this.radius, this.freeze);
    console.log("Activate SpyEye 2E");
  }

  /**
   * Deactivate Select/Input
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    console.log("Deactivate SpyEye 2S");
    if (this.layerSelected === null) this.layerSelected = this.layers[0];
    let names = this.layers.map((layer) => {
      return layer instanceof Object ? { name: layer.name } : { name: layer };
    });
    this.removeEffects();
    this.layerSelected.setVisible(false);
    if (names.length >= 1) {
      this.template.querySelector('select').disabled = true;
      this.template.querySelector('input').disabled = true;
    }
    console.log("Deactivate SpyEye 2E");
  }

  /**
   * This function is called to remove the effects
   *
   * @public
   * @function
   * @api stable
   */
  removeEffects() {
    this.getImpl().removeEffects();
  }

  /**
   * This function remove the transparency layers
   *
   * @public
   * @function
   * @api stable
   */
  removeTransparencyLayers(layers) {
    layers.forEach(layer => {
      if (!(layer instanceof Object)) {
        if (layer.indexOf('*') >= 0) {
          const urlLayer = layer.split('*');
          let name = urlLayer[3]
          const layerByUrl = this.map.getLayers().filter(l => name.includes(l.name))[0];
          this.map.removeLayers(layerByUrl);
        } else {
          const layerByName = this.map.getLayers().filter(l => layer.includes(l.name))[0];
          this.map.removeLayers(layerByName);
        }
      } else if (layer instanceof Object) {
        const layerByObject = this.map.getLayers().filter(l => layer.name.includes(l.name))[0];
        this.map.removeLayers(layerByObject);
      }
    });
  }

  /**
   * This function transform string to M.Layer
   *
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
          // console.log(urlLayer);
          if (urlLayer[0].toUpperCase() === 'WMS') {
            newLayer = new M.layer.WMS({
              url: urlLayer[2],
              name: urlLayer[3],
              legend: urlLayer[1],
            });

          } else if (urlLayer[0].toUpperCase() === 'WMTS') {

            newLayer = new M.layer.WMTS({
              url: urlLayer[2] + '?',
              name: urlLayer[3],
              legend: urlLayer[1],
              matrixSet: urlLayer[4],
              transparent: true,              // Es una capa Overlay -> zIndex > 0
              displayInLayerSwitcher: false,  // No aparece en el TOC
              queryable: false,               // No GetFeatureInfo
              visibility: false,              // Visible a false por defecto
              format: urlLayer[5],
            }), this.map.addWMTS(newLayer);

          }

          if (this.map.getLayers().filter(l => newLayer.name.includes(l.name)).length > 0) {
            newLayer = this.map.getLayers().filter(l => newLayer.name.includes(l.name))[0];
            newLayer.legend = urlLayer[1] || newLayer.name;
          } else {
            this.map.addLayers(newLayer);
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
   * @return {Boolean}
   */
  equals(control) {
    return control instanceof TransparencyControl;
  }

  getLayersNames() {
    return this.layers.map(l => l.name);
  }
}
