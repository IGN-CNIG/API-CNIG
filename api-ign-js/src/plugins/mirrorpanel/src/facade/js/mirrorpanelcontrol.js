/**
 * @module M/control/MirrorpanelControl
 */

import MirrorpanelImplControl from 'impl/mirrorpanelcontrol';
import template from 'templates/mirrorpanel';
import { getValue as getValueTranslate } from './i18n/language'; //e2m: Multilanguage support. Alias -> getValue is too generic

function clone(obj) {
  if (null == obj || "object" != typeof obj) return obj;
  var copy = obj.constructor();
  for (var attr in obj) {
    if (obj.hasOwnProperty(attr)) copy[attr] = obj[attr];
  }
  return copy;
}

export default class MirrorpanelControl extends M.Control {
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
    //Al constructor llegan los parámetros de creación del plugin


    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(MirrorpanelImplControl)) {
      M.exception('La implementación usada no puede crear controles MirrorpanelControl');
    }
    // 2. implementation of this control
    const impl = new MirrorpanelImplControl();
    super(impl, 'Mirrorpanel');



    /**
     * Template
     * @public
     * @type { HTMLElement }
     */
    this.template = null;

    /**
     * Visual mode
     * @private
     * @type {Number}
     */
    this.modeViz = values.modeViz;

    /**
     * Mirror maps with plugins
     * @private
     * @type {boolean}
     */
    this.enabledPlugins = values.enabledPlugins;

    /**
     * Mirror maps with plugins
     * @private
     * @type {boolean}
     */
    this.showCursors = values.showCursors;

    /**
     * Template
     * @public
     * @type { M.Map }
     */
    this.mapB = null;

    /**
     * Template
     * @public
     * @type { M.Map }
     */
    this.mapC = null;

    /**
     * Template
     * @public
     * @type { M.Map }
     */
    this.mapD = null;

    this.lyrCursorA = null;
    this.lyrCursorB = null;
    this.lyrCursorC = null;
    this.lyrCursorD = null;

    this.featureLyrCursorA = null;
    this.featureLyrCursorB = null;
    this.featureLyrCursorC = null;
    this.featureLyrCursorD = null;

    /**
     * Defining cursor style
     */
    this.styleCursor = new M.style.Point({
      icon: {
        form: M.style.form.CIRCLE,
        fontsize: 0.5,
        radius: 5,                    // Tamaño
        rotation: 0,                  // Giro del icono en radianes
        rotate: false,                // Activar rotacion con dispositivo
        offset: [0, 0],               // Desplazamiento en pixeles en los ejes x,y
        color: 'black',
        fill: 'red',
        gradientcolor: '#088A85',     // Color del borde
        opacity: 0.8                  // Transparencia. 0(transparente)|1(opaco)
      }
    });

    /**
     * Default layers for mirror maps
     * @public
     * @public {Array}
     */
    this.defaultBaseLyrs = values.defaultBaseLyrs;

    /**
     * All layers
     * @public
     * @public {Array}
     */
    this.mirrorLayers = values.mirrorLayers;

    /**
     * BackImgLayers' Parameters
     * @public
     * @public {Object}
     */
    this.backImgLayersParams = values.backImgLayersParams;

    // captura de customevent lanzado desde impl con coords
    window.addEventListener('mapclicked', (e) => {
      this.map_.addLabel('Hola Mundo!', e.detail);
    });


    this.createMapContainers();
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
    if (!M.template.compileSync) { // JGL: retrocompatibilidad Mapea4
      M.template.compileSync = (string, options) => {
        let templateCompiled;
        let templateVars = {};
        let parseToHtml;
        if (!M.utils.isUndefined(options)) {
          templateVars = M.utils.extends(templateVars, options.vars);
          parseToHtml = options.parseToHtml;
        }
        const templateFn = Handlebars.compile(string);
        const htmlText = templateFn(templateVars);
        if (parseToHtml !== false) {
          templateCompiled = M.utils.stringToHtml(htmlText);
        } else {
          templateCompiled = htmlText;
        }
        return templateCompiled;
      };
    }

    this.map = map;

    if (this.showCursors) { this.addLayerCursorA(); }

    return new Promise((success, fail) => {

      //const html = M.template.compileSync(template);//Lo comento porque guardo el template en la propiedad de la clase
      // Añadir código dependiente del DOM

      let templateOptions = '';
      templateOptions = {
        jsonp: true,
        vars: {
          translations: {
            title: getValueTranslate('title'),
            modViz0: getValueTranslate('modViz0'),
            modViz1: getValueTranslate('modViz1'),
            modViz2: getValueTranslate('modViz2'),
            modViz3: getValueTranslate('modViz3'),
            modViz4: getValueTranslate('modViz4'),
            modViz5: getValueTranslate('modViz5'),
            modViz6: getValueTranslate('modViz6'),
            modViz7: getValueTranslate('modViz7'),
            modViz8: getValueTranslate('modViz8'),
            modViz9: getValueTranslate('modViz9')
          }
        }
      };

      this.template = M.template.compileSync(template, templateOptions);

      //Defino los evenyos para los clics de botón
      this.template.querySelectorAll('button[id^="set-mirror-"]')
        .forEach((button, modeViz) => {
          button.addEventListener('click', evt => {
            this.manageVisionPanelByCSSGrid(modeViz);
          })
        });

      //Lanzo el modo de visualización por defecto
      this.manageVisionPanelByCSSGrid(this.modeViz);  //metido aquí

      success(this.template);//Devuelvo el Template creado
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
    // calls super to manage de/activation
    super.activate();
  }
  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    // calls super to manage de/activation
    super.deactivate();
  }

  /**
   * Initial configurations for applying CSS grid.ç
   * 
   */
  createMapContainers() {
    const bigContainer = document.createElement('div');
    bigContainer.id = "lienzo";
    bigContainer.classList.add('mirrorpanel-grid');
    const mapjsA = document.getElementById("mapjs");
    document.body.insertBefore(bigContainer, mapjsA);
    mapjsA.classList.add('mirror1');
    bigContainer.appendChild(mapjsA);

    const mapjsB = document.createElement('div');
    mapjsB.id = "mapjsB";
    mapjsB.classList.add('mirror2');
    bigContainer.appendChild(mapjsB);

    const mapjsC = document.createElement('div');
    mapjsC.id = "mapjsC";
    mapjsC.classList.add('mirror3');
    bigContainer.appendChild(mapjsC);

    const mapjsD = document.createElement('div');
    mapjsD.id = "mapjsD";
    mapjsD.classList.add('mirror4');
    bigContainer.appendChild(mapjsD);
  }

  /**
   * This function shows/hides panel for differents viz options.
   * The mirror maps are launched from here
   * 
   */
  manageVisionPanelByCSSGrid(modeViz) {

    let oldModeViz = this.modeViz;
    document.getElementById('mapjs').style.display = 'none';
    document.getElementById('mapjsB').style.display = 'none';
    document.getElementById('mapjsC').style.display = 'none';
    document.getElementById('mapjsD').style.display = 'none';
    this.template.querySelector('#set-mirror-' + oldModeViz).classList.remove('buttom-pressed');

    for (let i = 0; i < 10; i++) {
      document.getElementById('lienzo').classList.remove('modeViz' + i);
    }
    document.getElementById('lienzo').classList.add('modeViz' + modeViz);

    //Create map objects by modeviz
    if ([1, 2].includes(modeViz)) {
      if (this.mapB == null) {
        this.createMapBObjects();//Create MapB
      }
    }
    if ([3, 7, 8, 9].includes(modeViz)) {
      if (this.mapB == null) {
        this.createMapBObjects();//Create MapB
      }
      if (this.mapC == null) {
        this.createMapCObjects();//Create MapC
      }
    }
    if ([4, 5, 6].includes(modeViz)) {
      if (this.mapB == null) {
        this.createMapBObjects();//Create MapB
      }
      if (this.mapC == null) {
        this.createMapCObjects();//Create MapC
      }
      if (this.mapD == null) {
        this.createMapDObjects();//Create MapD
      }
    }

    this.modeViz = modeViz;
    this.template.querySelector('#set-mirror-' + modeViz).classList.add('buttom-pressed');
    this.map_.refresh();
    if (this.mapB !== null) { this.mapB.refresh(); }
    if (this.mapC !== null) { this.mapC.refresh(); }
    if (this.mapD !== null) { this.mapD.refresh(); }
  }

  /**
   * Adding a layer for cursor on MapA
   */
  addLayerCursorA() {

    //Definimos la capa de cursor
    this.lyrCursorA = new M.layer.Vector({
      name: 'Coordenadas centro A',
    }, { displayInLayerSwitcher: false });

    this.featureLyrCursorA = new M.Feature('CenterA', {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: this.map.getCenter(),
      },
    });

    this.lyrCursorA.addFeatures([this.featureLyrCursorA]);
    this.lyrCursorA.setStyle(this.styleCursor);
    this.lyrCursorA.setZIndex(5000);
    this.map.addLayers(this.lyrCursorA);

    //Como Mapea no tiene sacado el evento PointerMove, los sacamos de la implementación
    this.map.getMapImpl().on('pointermove', (event) => {

      this.lyrCursorA.setVisible(false);

      if (this.featureLyrCursorB !== null) {
        this.lyrCursorB.setVisible(true);
        this.featureLyrCursorB.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

      if (this.featureLyrCursorC !== null) {
        this.lyrCursorC.setVisible(true);
        this.featureLyrCursorC.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

      if (this.featureLyrCursorD !== null) {
        this.lyrCursorD.setVisible(true);
        this.featureLyrCursorD.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

    });

  }

  /**
   * Create MapB object synchro with MapA
   */
  createMapBObjects() {

    let plugin4mapB = null;
    let mpBILmapB = null;


    if (this.enabledPlugins) {
      //Get main map plugins
      const listaPlugs = this.map_.getPlugins();

      listaPlugs.forEach((itemPlug) => {
        if (itemPlug.metadata_) {
          if (itemPlug.metadata_.name === "FullTOC") {
            //FullTOC
            plugin4mapB = clone(itemPlug); //Clone main-map plugin in a new object
          }
          if (itemPlug.metadata_.name === "backimglayer") {
            //BackImgLayer
            mpBILmapB = new M.plugin.BackImgLayer(this.backImgLayersParams);
            mpBILmapB.layerId = 1;
          }
        }
      });

    }
    this.mapB = M.map({
      container: 'mapjsB',
      layers: ((this.defaultBaseLyrs.length >= 1) && (mpBILmapB == null)) ? [this.defaultBaseLyrs[0]] : [],
      center: this.map_.getCenter(),
      projection: this.map_.getProjection().code + '*' + this.map_.getProjection().units,
      zoom: this.map_.getZoom(),
    });

    this.mapB.getMapImpl().setView(this.map_.getMapImpl().getView());

    if (plugin4mapB !== null) {
      this.mapB.addPlugin(plugin4mapB);
    }

    if (mpBILmapB !== null) {
      this.mapB.addPlugin(mpBILmapB);
    }


    //Plugins enabled
    if (this.enabledPlugins) {
      //Si hay array de capas para añadir
      if (this.mirrorLayers.length > 0) {
        this.mapB.addLayers(this.mirrorLayers);//Las añado
        //Pongo invisibles las capas que acabo de pasr como parámetro
        for (let i = this.mapB.getLayers().length - 1; i >= this.mapB.getLayers().length - this.mirrorLayers.length - 1; i--) {
          this.mapB.getLayers()[i].setVisible(false);
        }
      }
    }

    if (this.showCursors) { this.addLayerCursorB(); }

    this.mapB.refresh();

  }

  /**
   * Adding a layer for cursor on MapB
   */
  addLayerCursorB() {

    //Definimos la capa de cursor
    this.lyrCursorB = new M.layer.Vector({
      name: 'Coordenadas centro B',
    }, { displayInLayerSwitcher: false });

    this.featureLyrCursorB = new M.Feature('CenterB', {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: this.mapB.getCenter(),
      },
    });

    this.lyrCursorB.addFeatures([this.featureLyrCursorB]);
    this.lyrCursorB.setStyle(this.styleCursor);
    this.lyrCursorB.setZIndex(5000);
    this.mapB.addLayers(this.lyrCursorB);

    //Como Mapea no tiene sacado el evento PointerMove, los sacamos de la implementación
    this.mapB.getMapImpl().on('pointermove', (event) => {

      this.lyrCursorB.setVisible(false);

      if (this.featureLyrCursorA !== null) {
        this.lyrCursorA.setVisible(true);
        this.featureLyrCursorA.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

      if (this.featureLyrCursorC !== null) {
        this.lyrCursorC.setVisible(true);
        this.featureLyrCursorC.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

      if (this.featureLyrCursorD !== null) {
        this.lyrCursorD.setVisible(true);
        this.featureLyrCursorD.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

    });


  }


  /**
   * Create MapC object synchro with MapA
   */
  createMapCObjects() {

    let plugin4mapC = null;
    let mpBILmapC = null;


    if (this.enabledPlugins) {
      //Get main map plugins
      const listaPlugs = this.map_.getPlugins();

      listaPlugs.forEach((itemPlug) => {
        if (itemPlug.metadata_) {
          if (itemPlug.metadata_.name === "FullTOC") {
            //FullTOC
            plugin4mapC = clone(itemPlug); //Clone main-map plugin in a new object
          }
          if (itemPlug.metadata_.name === "backimglayer") {
            //BackImgLayer
            mpBILmapC = new M.plugin.BackImgLayer(this.backImgLayersParams);
            mpBILmapC.layerId = 2
          }
        }
      });

    }
    this.mapC = M.map({
      container: 'mapjsC',
      layers: ((this.defaultBaseLyrs.length >= 2) && (mpBILmapC == null)) ? [this.defaultBaseLyrs[1]] : [],
      center: this.map_.getCenter(),
      projection: this.map_.getProjection().code + '*' + this.map_.getProjection().units,
      zoom: this.map_.getZoom(),
    });

    this.mapC.getMapImpl().setView(this.map_.getMapImpl().getView());

    if (plugin4mapC !== null) {
      this.mapC.addPlugin(plugin4mapC);
    }

    if (mpBILmapC !== null) {
      this.mapC.addPlugin(mpBILmapC);
    }


    //Plugins enabled
    if (this.enabledPlugins) {
      //Si hay array de capas para añadir
      if (this.mirrorLayers.length > 0) {
        this.mapC.addLayers(this.mirrorLayers);//Las añado
        //Pongo invisibles las capas que acabo de pasr como parámetro
        for (let i = this.mapC.getLayers().length - 1; i >= this.mapC.getLayers().length - this.mirrorLayers.length - 1; i--) {
          this.mapC.getLayers()[i].setVisible(false);
        }
      }
    }

    if (this.showCursors) { this.addLayerCursorC(); }

    this.mapC.refresh();

  }


  /**
   * Adding a layer for cursor on MapC
   */
  addLayerCursorC() {

    //Definimos la capa de cursor
    this.lyrCursorC = new M.layer.Vector({
      name: 'Coordenadas centro C',
    }, { displayInLayerSwitcher: false });

    this.featureLyrCursorC = new M.Feature('CenterC', {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: this.mapB.getCenter(),
      },
    });

    this.lyrCursorC.addFeatures([this.featureLyrCursorC]);
    this.lyrCursorC.setStyle(this.styleCursor);
    this.lyrCursorC.setZIndex(5000);
    this.mapC.addLayers(this.lyrCursorC);

    //Como Mapea no tiene sacado el evento PointerMove, los sacamos de la implementación
    this.mapC.getMapImpl().on('pointermove', (event) => {

      this.lyrCursorC.setVisible(false);

      if (this.featureLyrCursorA !== null) {
        this.lyrCursorA.setVisible(true);
        this.featureLyrCursorA.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

      if (this.featureLyrCursorB !== null) {
        this.lyrCursorB.setVisible(true);
        this.featureLyrCursorB.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

      if (this.featureLyrCursorD !== null) {
        this.lyrCursorD.setVisible(true);
        this.featureLyrCursorD.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

    });

  }

  /**
   * Create MapD object synchro with MapA
   */
  createMapDObjects() {

    let plugin4mapD = null;
    let mpBILmapD = null;


    if (this.enabledPlugins) {
      //Get main map plugins
      const listaPlugs = this.map_.getPlugins();

      listaPlugs.forEach((itemPlug) => {
        if (itemPlug.metadata_) {
          if (itemPlug.metadata_.name === "FullTOC") {
            //FullTOC
            plugin4mapD = clone(itemPlug); //Clone main-map plugin in a new object
          }
          if (itemPlug.metadata_.name === "backimglayer") {
            //BackImgLayer
            mpBILmapD = new M.plugin.BackImgLayer(this.backImgLayersParams);
            mpBILmapD.layerId = 3;
          }
        }
      });

    }
    this.mapD = M.map({
      container: 'mapjsD',
      layers: ((this.defaultBaseLyrs.length >= 3) && (mpBILmapD == null)) ? [this.defaultBaseLyrs[2]] : [],
      center: this.map_.getCenter(),
      projection: this.map_.getProjection().code + '*' + this.map_.getProjection().units,
      zoom: this.map_.getZoom(),
    });

    this.mapD.getMapImpl().setView(this.map_.getMapImpl().getView());

    if (plugin4mapD !== null) {
      this.mapD.addPlugin(plugin4mapD);
    }

    if (mpBILmapD !== null) {
      this.mapD.addPlugin(mpBILmapD);
    }

    //Plugins enabled
    if (this.enabledPlugins) {
      //Si hay array de capas para añadir
      if (this.mirrorLayers.length > 0) {
        this.mapD.addLayers(this.mirrorLayers);//Las añado
        //Pongo invisibles las capas que acabo de pasr como parámetro
        for (let i = this.mapD.getLayers().length - 1; i >= this.mapD.getLayers().length - this.mirrorLayers.length - 1; i--) {
          this.mapD.getLayers()[i].setVisible(false);
        }
      }
    }

    if (this.showCursors) { this.addLayerCursorD(); }

    this.mapD.refresh();

  }

  /**
   * Adding a layer for cursor on MapD
   */
  addLayerCursorD() {

    //Definimos la capa de cursor
    this.lyrCursorD = new M.layer.Vector({
      name: 'Coordenadas centro D',
    }, { displayInLayerSwitcher: false });

    this.featureLyrCursorD = new M.Feature('CenterD', {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: this.mapB.getCenter(),
      },
    });

    this.lyrCursorD.addFeatures([this.featureLyrCursorD]);
    this.lyrCursorD.setStyle(this.styleCursor);
    this.lyrCursorD.setZIndex(5000);
    this.mapD.addLayers(this.lyrCursorD);

    //Como Mapea no tiene sacado el evento PointerMove, los sacamos de la implementación
    this.mapD.getMapImpl().on('pointermove', (event) => {

      this.lyrCursorD.setVisible(false);

      if (this.featureLyrCursorA !== null) {
        this.lyrCursorA.setVisible(true);
        this.featureLyrCursorA.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

      if (this.featureLyrCursorB !== null) {
        this.lyrCursorB.setVisible(true);
        this.featureLyrCursorB.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

      if (this.featureLyrCursorC !== null) {
        this.lyrCursorC.setVisible(true);
        this.featureLyrCursorC.setGeometry({
          type: 'Point',
          coordinates: event.coordinate,
        });
      }

    });

  }


  /**
   * This function is called to remove the effects
   *
   * @public
   * @function
   * @api stable
   */
  removeMaps() {
    this.mapB = null;
    this.mapC = null;
    this.mapD = null;
  }

  destroyMapsContainer() {

    //Remove mirrors containers
    document.getElementById("mapjsB").remove();
    document.getElementById("mapjsC").remove();
    document.getElementById("mapjsD").remove();

    //Saco el mapa principal del contenedor 
    const lienzo = document.getElementById("lienzo");
    const mapjsA = document.getElementById("mapjs");
    mapjsA.style.display = "block";
    mapjsA.classList.remove('mirror1');
    document.body.insertBefore(mapjsA, lienzo);

    //Ahora me cargo el contenedor principal
    document.getElementById("lienzo").remove();
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
    return html.querySelector('.m-mirrorpanel button');
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
    return control instanceof MirrorpanelControl;
  }
}
