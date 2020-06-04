/**
 * @module M/control/LyrCompareControl
 */

import CurtainImplControl from 'impl/curtaincontrol';
import template from 'templates/lyrcompare';
import { getValue as getValueTranslate } from './i18n/language'; //e2m: Multilanguage support. Alias -> getValue is too generic

//e2m: Eliminate duplicated values in array
Array.prototype.unique = function(a) {
  return function() { return this.filter(a) }
}(function(a, b, c) {
  return c.indexOf(a, b + 1) < 0
});

export default class LyrCompareControl extends M.Control {
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
    if (M.utils.isUndefined(CurtainImplControl)) {
      M.exception('La implementación usada no puede crear controles CurtainControl');
    }
    // 2. implementation of this control
    const impl = new CurtainImplControl();
    super(impl, 'Curtain'); //e2m?


    /**
     * All layers
     * @public
     * @public {Array}
     */
    this.layers = values.layers;

    /**
     * Nivel de opacidad
     * @private
     * @type {Number}
     */
    this.opacityVal = values.opacityVal;

    /**
     * Layer selected A
     * @public
     * @type {M.layer}
     */
    this.layerSelectedA = null;

    /**
     * Layer selected B
     * @public
     * @type {M.layer}
     */
    this.layerSelectedB = null;

    /**
     * Layer selected C
     * @public
     * @type {M.layer}
     */
    this.layerSelectedC = null;

    /**
     * Layer selected D
     * @public
     * @type {M.layer}
     */
    this.layerSelectedD = null;

    /**
     * Template
     * @public
     * @type { HTMLElement }
     */
    this.template = null;

    /**
     * Static Division selected
     * @private
     * @type {Number}
     */
    this.staticDivision = values.staticDivision;

    /**
     * Opacity Value
     * @private
     * @type {Number}
     */
    this.opacityVal = values.opacityVal;

    /**
     * Comparison mode
     * @private
     * @type {Number}
     */
    this.comparisonMode = values.comparisonMode;

    /**
     * Layer A default
     * @private
     * @type {Number}
     */
    this.defaultLyrA = values.defaultLyrA;

    /**
     * Layer B default
     * @private
     * @type {Number}
     */
    this.defaultLyrB = values.defaultLyrB;

    /**
     * Layer C default
     * @private
     * @type {Number}
     */
    this.defaultLyrC = values.defaultLyrC;

    /**
     * Layer D default
     * @private
     * @type {Number}
     */
    this.defaultLyrD = values.defaultLyrD;


  }



  //e2m: Launched by map.addPlugin
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
      let capas = this.layers.map(function(layer) {
        return layer instanceof Object ? { name: layer.name, legend: layer.legend } : { name: layer, legend: layer };
      });

      //e2m: adding language dictionary
      let options = '';
      if (capas.length > 1) {
        options = {
          jsonp: true,
          vars: {
            options: capas,
            comparisonMode: this.comparisonMode,
            translations: {
              tooltip: getValueTranslate('tooltip'),
              tooltip_vcurtain: getValueTranslate('tooltip_vcurtain'),
              tooltip_hcurtain: getValueTranslate('tooltip_hcurtain'),
              tooltip_multicurtain: getValueTranslate('tooltip_multicurtain'),
              opacity: getValueTranslate('opacity'),
              static: getValueTranslate('static'),
              dinamic: getValueTranslate('dinamic'),
              layer: getValueTranslate('layer'),
              opacity_tooltip: getValueTranslate('opacity_tooltip'),
              static_tooltip: getValueTranslate('static_tooltip'),
              dinamic_tooltip: getValueTranslate('dinamic_tooltip'),
              lyrLeftSelect_tooltip: getValueTranslate('lyrLeftSelect_tooltip'),
              lyrRightSelect_tooltip: getValueTranslate('lyrRightSelect_tooltip')
            }
          }
        };
      }



      //e2m: config a helper in Handlebars for embedding conditionals in template
      Handlebars.registerHelper('ifCond', function(v1, v2, options) {
        if (v1 === v2) {
          return options.fn(this);
        }
        return options.inverse(this);
      });


      //e2m: populate template with default options
      this.template = M.template.compileSync(template, options);


      //e2m: setting opacity control
      this.template.querySelector('#input-transparent-opacity').value = this.opacityVal;
      this.template.querySelector('#input-transparent-opacity').addEventListener('input', (evt) => {
        this.opacityVal = Number(evt.target.value);
        this.getImpl().setOpacity(this.opacityVal);
      });

      // e2m: setting static division selector
      if (this.staticDivision === 1) {
        this.template.querySelector('#div-m-lyrcompare-transparent-static-true').checked = true;
      } else {
        this.template.querySelector('#div-m-lyrcompare-transparent-static-false').checked = true;
      }

      this.template.querySelector('#div-m-lyrcompare-transparent-static-false').addEventListener('change', (evt) => {
        this.staticDivision = Number(evt.target.value);
        this.getImpl().setStaticDivision(this.staticDivision);
      });

      this.template.querySelector('#div-m-lyrcompare-transparent-static-true').addEventListener('change', (evt) => {
        this.staticDivision = Number(evt.target.value);
        this.getImpl().setStaticDivision(this.staticDivision);
      });


      //e2m: refresh template components
      this.updateControls();


      //Si no hay capas a las que aplicar la transparencia, el plugin no funciona e informa
      if (this.layers.length == 0) {
        M.dialog.error(getValueTranslate('no_layers_plugin'));
      } else {

        //e2m: Toogle activate/desactivate vcurtain, hcurtain, multicurtain ---> comparisonMode = 1, 2, 3
        this.template.querySelectorAll('button[id^="m-lyrcompare-"]')
          .forEach((button, i) => {
            button.addEventListener('click', evt => {
              if (this.comparisonMode === 0) {
                this.comparisonMode = i + 1;
                this.activateCurtain();
                return;
              } else if (this.comparisonMode === i + 1) {
                this.comparisonMode = 0;
                this.deactivateCurtain();
                return;
              } else {
                //Cambiamos de modo de visualización sin apagar/encender la interacción
                this.comparisonMode = i + 1;
                this.updateControls();
                this.getImpl().setComparisonMode(this.comparisonMode);
              }
            })
          });


        //e2m: having options 4 plugin.
        if (options !== '') {
          this.template.querySelectorAll('select[id^="m-lyrcompare-"]').disabled = true;
          this.template.querySelector('input').disabled = true;

          //e2m: creamos los eventos para manejar el cambio de selección
          this.template.querySelectorAll('select[id^="m-lyrcompare-"]').forEach(item => {
            item.addEventListener('change', evt => {
              const layer = this.layers.filter(function(layer) {
                return layer.name === evt.target.value
              });
              let lstLayers = [];
              if (item.id === "m-lyrcompare-lyrA") {
                lstLayers = [layer[0].name, this.layerSelectedB.name, this.layerSelectedC.name, this.layerSelectedD.name];
              } else if (item.id === "m-lyrcompare-lyrB") {
                lstLayers = [this.layerSelectedA.name, layer[0].name, this.layerSelectedC.name, this.layerSelectedD.name];
              } else if (item.id === "m-lyrcompare-lyrC") {
                lstLayers = [this.layerSelectedA.name, this.layerSelectedB.name, layer[0].name, this.layerSelectedD.name];
              } else if (item.id === "m-lyrcompare-lyrD") {
                lstLayers = [this.layerSelectedA.name, this.layerSelectedB.name, this.layerSelectedC.name, layer[0].name];
              }

              //e2m: de esta forma pasamos los parámetros en forma de array
              if (this.checkLayersAreDifferent(...lstLayers) === false) {
                M.dialog.info(getValueTranslate('advice_sameLayer'));
                if (item.id === "m-lyrcompare-lyrA") {
                  this.template.querySelector('#' + item.id).value = this.layerSelectedA.name
                } else if (item.id === "m-lyrcompare-lyrB") {
                  this.template.querySelector('#' + item.id).value = this.layerSelectedB.name
                } else if (item.id === "m-lyrcompare-lyrC") {
                  this.template.querySelector('#' + item.id).value = this.layerSelectedC.name
                } else if (item.id === "m-lyrcompare-lyrD") {
                  this.template.querySelector('#' + item.id).value = this.layerSelectedD.name
                }
                return false;
              }

              if (item.id === "m-lyrcompare-lyrA") {
                if (layer[0].name === this.layerSelectedC.name) {
                  this.layerSelectedC.setVisible(false);
                  this.layerSelectedC = this.layerSelectedA;
                  this.template.querySelector('#m-lyrcompare-lyrC').value = this.layerSelectedA.name
                }
                if (layer[0].name === this.layerSelectedD.name) {
                  this.layerSelectedD.setVisible(false);
                  this.layerSelectedD = this.layerSelectedA;
                  this.template.querySelector('#m-lyrcompare-lyrD').value = this.layerSelectedA.name
                }
              } else if (item.id === "m-lyrcompare-lyrB") {
                if (layer[0].name === this.layerSelectedC.name) {
                  this.layerSelectedC.setVisible(false);
                  this.layerSelectedC = this.layerSelectedB;
                  this.template.querySelector('#m-lyrcompare-lyrC').value = this.layerSelectedB.name
                }
                if (layer[0].name === this.layerSelectedD.name) {
                  this.layerSelectedD.setVisible(false);
                  this.layerSelectedD = this.layerSelectedB;
                  this.template.querySelector('#m-lyrcompare-lyrD').value = this.layerSelectedB.name
                }
              }


              if (item.id === "m-lyrcompare-lyrA") {
                this.layerSelectedA.setVisible(false);
                this.layerSelectedA = layer[0];
              } else if (item.id === "m-lyrcompare-lyrB") {
                this.layerSelectedB.setVisible(false);
                this.layerSelectedB = layer[0];
              } else if (item.id === "m-lyrcompare-lyrC") {
                this.layerSelectedC.setVisible(false);
                this.layerSelectedC = layer[0];
              } else if (item.id === "m-lyrcompare-lyrD") {
                this.layerSelectedD.setVisible(false);
                this.layerSelectedD = layer[0];
              }
              this.removeEffectsComparison(); //e2m: we have to eliminate previous interactions. No -> interactions overflow -> Game over
              this.getImpl().effectSelectedCurtain(this.layerSelectedA, this.layerSelectedB, this.layerSelectedC, this.layerSelectedD, this.opacityVal, this.staticDivision, this.comparisonMode);

            });
          });

        }
      }

      /**
       * e2m: manejamos el evento que se lanza cuando se añade el control al mapa 
       * En este momento sí podríamos acceder al mapa -> this.getImpl().olMap
       */
      this.on(M.evt.ADDED_TO_MAP, () => {

        //this.comparisonMode = 1;         
        //this.activateCurtain();
        //setTimeout(this.activateCurtain(),10000);
      });

      success(this.template);

    });

  }



  /**
   * This function checks selected layers are diferent
   *
   * @public
   * @function
   * @api stable
   * @param {string, string, string. string}
   * @return {Boolean}
   */
  checkLayersAreDifferent(lyerA, lyerB, lyerC, lyerD) {
    if ((this.comparisonMode === 1) || (this.comparisonMode === 2)) {
      if (lyerA === lyerB) {
        return false
      }
    } else {
      let compLyers = [lyerA, lyerB, lyerC, lyerD];
      if (compLyers.length !== compLyers.unique().length) {
        return false
      }
    }
    return true;
  }

  /**
   * Activate Select/Input
   *
   * @public
   * @function
   * @api stable
   */
  activateCurtain() {

    //e2m: por defecto se eligen las dos primeras capas
    if (this.layerSelectedA === null) {
      this.layerSelectedA = this.layers[this.defaultLyrA];
      this.template.querySelector('#m-lyrcompare-lyrA').selectedIndex = this.defaultLyrA;
    }
    if (this.layerSelectedB === null) {
      this.layerSelectedB = this.layers[this.defaultLyrB];
      this.template.querySelector('#m-lyrcompare-lyrB').selectedIndex = this.defaultLyrB;
    }
    if (this.layerSelectedC === null) {
      this.layerSelectedC = this.layers[this.defaultLyrC];
      this.template.querySelector('#m-lyrcompare-lyrC').selectedIndex = this.defaultLyrC;
    }
    if (this.layerSelectedD === null) {
      this.layerSelectedD = this.layers[this.defaultLyrD];
      this.template.querySelector('#m-lyrcompare-lyrD').selectedIndex = this.defaultLyrD;
    }

    this.getImpl().effectSelectedCurtain(this.layerSelectedA, this.layerSelectedB, this.layerSelectedC, this.layerSelectedD, this.opacityVal, this.staticDivision, this.comparisonMode);
    this.updateControls();
  }

  /**
   * Deactivate Select/Input
   *
   * @public
   * @function
   * @api stable
   */
  deactivateCurtain() {

    this.layerSelectedA.setVisible(false);
    this.layerSelectedB.setVisible(false);
    this.layerSelectedC.setVisible(false);
    this.layerSelectedD.setVisible(false);

    this.removeEffectsComparison();
    this.updateControls();
  }


  /**
   * This function is called to remove the effects
   *
   * @public
   * @function
   * @api stable
   */
  removeEffectsComparison() {
    this.getImpl().removeEffectsCurtain();
  }

  /**
   * This procedure updates texts in controls
   * 
   */
  updateControls() {

    this.template.querySelector('#m-lyrcompare-vcurtain').classList.remove('buttom-pressed-vcurtain');
    this.template.querySelector('#m-lyrcompare-hcurtain').classList.remove('buttom-pressed-hcurtain');
    this.template.querySelector('#m-lyrcompare-multicurtain').classList.remove('buttom-pressed-multicurtain');
    this.template.querySelectorAll('select[id^="m-lyrcompare-"]').disabled = true;

    if (this.comparisonMode === 1) {
      this.template.querySelector('#m-lyrcompare-vcurtain').classList.add('buttom-pressed-vcurtain'); //Añadimos un clase para mostrar el botón de activación VCurtain pulsado
    } else if (this.comparisonMode === 2) {
      this.template.querySelector('#m-lyrcompare-hcurtain').classList.add('buttom-pressed-hcurtain'); //Añadimos un clase para mostrar el botón de activación HCurtain pulsado
    } else if (this.comparisonMode === 3) {
      this.template.querySelector('#m-lyrcompare-multicurtain').classList.add('buttom-pressed-multicurtain'); //Añadimos un clase para mostrar el botón de activación MultiCurtain pulsado
    }

    this.template.querySelector('#m-lyrcompare-lyrA-cont').style.display = 'none';
    this.template.querySelector('#m-lyrcompare-lyrB-cont').style.display = 'none';
    this.template.querySelector('#m-lyrcompare-lyrC-cont').style.display = 'none';
    this.template.querySelector('#m-lyrcompare-lyrD-cont').style.display = 'none';
    if (this.comparisonMode == 0) {
      this.template.querySelector('#m-lyrcompare-lyrA-lbl').innerHTML = "";
      this.template.querySelector('#m-lyrcompare-lyrB-lbl').innerHTML = "";
      this.template.querySelectorAll('select[id^="m-lyrcompare-"]').forEach(item => {
        item.disabled = true;
      });
      this.template.querySelector('input').disabled = true; //Deshabilita el range del radio
      return;
    } else if (this.comparisonMode == 1) {
      this.template.querySelector('#m-lyrcompare-lyrA-lbl').innerHTML = "👈";
      this.template.querySelector('#m-lyrcompare-lyrB-lbl').innerHTML = "👉";
      this.template.querySelector('#m-lyrcompare-lyrA-cont').style.display = 'block';
      this.template.querySelector('#m-lyrcompare-lyrB-cont').style.display = 'block';
      this.template.querySelector('#m-lyrcompare-lyrA').disabled = false;
      this.template.querySelector('#m-lyrcompare-lyrB').disabled = false;
    } else if (this.comparisonMode == 2) {
      this.template.querySelector('#m-lyrcompare-lyrA-lbl').innerHTML = "👆";
      this.template.querySelector('#m-lyrcompare-lyrB-lbl').innerHTML = "👇";
      this.template.querySelector('#m-lyrcompare-lyrA-cont').style.display = 'block';
      this.template.querySelector('#m-lyrcompare-lyrB-cont').style.display = 'block';
      this.template.querySelector('#m-lyrcompare-lyrA').disabled = false;
      this.template.querySelector('#m-lyrcompare-lyrB').disabled = false;
    } else if (this.comparisonMode == 3) {
      this.template.querySelectorAll('select[id^="m-lyrcompare-"]').forEach(item => {
        item.disabled = false;
      });
      this.template.querySelector('#m-lyrcompare-lyrA-lbl').innerHTML = "A";
      this.template.querySelector('#m-lyrcompare-lyrB-lbl').innerHTML = "B";
      this.template.querySelector('#m-lyrcompare-lyrC-lbl').innerHTML = "C";
      this.template.querySelector('#m-lyrcompare-lyrD-lbl').innerHTML = "D";
      this.template.querySelector('#m-lyrcompare-lyrA-cont').style.display = 'block';
      this.template.querySelector('#m-lyrcompare-lyrB-cont').style.display = 'block';
      this.template.querySelector('#m-lyrcompare-lyrC-cont').style.display = 'block';
      this.template.querySelector('#m-lyrcompare-lyrD-cont').style.display = 'block';
    }
    this.template.querySelector('input').disabled = false; //Habilita el range del radio

  }

  /**
   * This function remove the Curtain layers
   *
   * @public
   * @function
   * @api stable
   */
  removeCurtainLayers(layers) {
    layers.forEach(layer => {
      if (!(layer instanceof Object)) {
        if (layer.indexOf('*') >= 0) {
          const urlLayer = layer.split('*');
          let name = urlLayer[3]
          const layerByUrl = this.map.getLayers().filter(l => name.includes(l.name))[this.map.getLayers().filter(l => name.includes(l.name)).length-1];
          this.map.removeLayers(layerByUrl);
          
        } else {
          const layerByName = this.map.getLayers().filter(l => layer.includes(l.name))[this.map.getLayers().filter(l => layer.includes(l.name)).length-1];
          this.map.removeLayers(layerByName);
        }
      } else if (layer instanceof Object) {
        const layerByObject = this.map.getLayers().filter(l => layer.name.includes(l.name))[this.map.getLayers().filter(l => layer.name.includes(l.name)).length-1];
        this.map.removeLayers(layerByObject);
      }
    });
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
  transformToLayers(layers) {
    const transform = layers.map(function(layer) {
      let newLayer = null;
      if (!(layer instanceof Object)) {
        if (layer.indexOf('*') >= 0) {
          const urlLayer = layer.split('*');
          if (urlLayer[0].toUpperCase() == 'WMS') {
            newLayer = new M.layer.WMS({
              url: urlLayer[2],
              name: urlLayer[3]
            });
            this.map.addLayers(newLayer);
          } else if (urlLayer[0].toUpperCase() == 'WMTS') {
            newLayer = new M.layer.WMTS({
              url: urlLayer[2],
              name: urlLayer[3]
            });
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
        newLayer.displayInLayerSwitcher = false;
        newLayer.setVisible(false);
        return newLayer
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
    return control instanceof LyrCompareControl;
  }
}
