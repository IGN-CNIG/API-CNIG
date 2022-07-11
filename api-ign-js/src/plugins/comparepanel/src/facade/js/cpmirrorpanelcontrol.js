/**
 * @module M/control/CompareMirrorpanel
 */

import MirrorpanelImplControl from 'impl/cpmirrorpanel';
import template from 'templates/cpmirrorpanel';
import { getValue } from './i18n/language';
import Lyrdropdown from './lyrdropdown';  //e2m: reference LayerDropDown control

export default class CompareMirrorpanel extends M.Control {
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
    if (M.utils.isUndefined(MirrorpanelImplControl)) {
      M.exception(getValue('exception'));
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
    this.showCursors = values.showCursors;

    /**
     * Defining mirror maps variables
     */
    this.mapL = { A: null, B: null, C: null, D: null }
    this.lyrCursor = { A: null, B: null, C: null, D: null }
    this.featureLyrCursor = { A: null, B: null, C: null, D: null }
    this.oldClass = '';
    this.reverseLayout = values.reverseLayout;
    this.enabledPlugins = values.enabledPlugins;
    this.backImgLayersConfig = values.backImgLayersConfig;
    /**
     * Defining cursor style
     */
    this.styleCursor = new M.style.Point({
      icon: {
        form: M.style.form.CIRCLE,
        fontsize: 0.5,
        radius: 5,
        rotation: 0,
        rotate: false,
        offset: [0, 0],
        color: 'black',
        fill: 'red',
        gradientcolor: '#088A85',
        opacity: 0.8,
      },
    });

    /**
     * Default layers for mirror maps
     * @public
     * @public {Array}
     */
    this.defaultBaseLyrs = values.defaultBaseLyrs;

    /**
     * Nivel mínimo en el que empiezan a cargarse las capas
     * @public
     * @type { integer }
     */
     this.lyrsMirrorMinZindex = values.lyrsMirrorMinZindex
     
    /**
     * All layers
     * @public
     * @public {Array}
     */
    this.mirrorLayers = values.mirrorLayers;

    /**
     * Define the control for managing layers
     *
     */

    this.lyDropControlA = new Lyrdropdown({
      position: 'TL',
      collapsible: false, // El botón para desplegar/replegar el plugin no aparece (false) o sí aparece(true)
      collapsed: true,    // El panel del plugin se muestra desplegado (false) o replegado (true)
      layers: this.defaultBaseLyrs,
      lyrsMirrorMinZindex: this.lyrsMirrorMinZindex,
    });
    

    this.lyDropControlB = new Lyrdropdown({
      position: 'TL',
      collapsible: false,
      collapsed: true,
      layers: this.defaultBaseLyrs,
      lyrsMirrorMinZindex: this.lyrsMirrorMinZindex,
    });
    

    this.lyDropControlC = new Lyrdropdown({
      position: 'TL',
      collapsible: false,
      collapsed: true,
      layers: this.defaultBaseLyrs,
      lyrsMirrorMinZindex: this.lyrsMirrorMinZindex,
    });

    this.lyDropControlD = new Lyrdropdown({
      position: 'TL',
      collapsible: false,
      collapsed: true,
      layers: this.defaultBaseLyrs,
      lyrsMirrorMinZindex: this.lyrsMirrorMinZindex,
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
    if (!M.template.compileSync) {
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

    this.mapL['A'] = map;
    if (this.mirrorLayers.length > 0) {
      this.mapL['A'].addLayers(this.mirrorLayers);
      this.mapL['A'].getLayers().forEach((l) => {
        if (l.zindex_ !== 0) { l.setVisible(false); }
      });

      this.mapL['A'].addLayers(this.defaultBaseLyrs[0]);
    }

    if (this.showCursors) {
      this.addLayerCursor('A');
    }

    return new Promise((success, fail) => {
      let templateOptions = '';
      templateOptions = {
        jsonp: true,
        vars: {
          translations: {
            titleMirrorpanel: getValue('titleMirrorpanel'),
            modViz0: getValue('modViz0'),
            modViz1: getValue('modViz1'),
            modViz2: getValue('modViz2'),
            modViz3: getValue('modViz3'),
            modViz4: getValue('modViz4'),
            modViz5: getValue('modViz5'),
            modViz6: getValue('modViz6'),
            modViz7: getValue('modViz7'),
            modViz8: getValue('modViz8'),
            modViz9: getValue('modViz9'),
          },
        },
      };

      this.template = M.template.compileSync(template, templateOptions);

      // Button's click events
      this.template.querySelectorAll('button[id^="set-mirror-"]').forEach((button, modeViz) => {
        button.addEventListener('click', evt => {
          this.manageVisionPanelByCSSGrid(modeViz);
        })
      });

      success(this.template);
      // Apply default vision
      this.manageVisionPanelByCSSGrid(this.modeViz);
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
    this.manageVisionPanelByCSSGrid(0);
  }

  /**
   * Initial configurations for applying CSS grid.
   *
   */
  createMapContainers() {
    const bigContainer = document.createElement('div');
    bigContainer.id = 'lienzo';
    bigContainer.classList.add('mirrorpanel-grid');

    const mapjsA = document.getElementById('mapjs') || document.getElementById('map');
    this.oldClass = mapjsA.classList.toString();
    mapjsA.parentElement.insertBefore(bigContainer, mapjsA);
    mapjsA.classList.add('mirror1');
    bigContainer.appendChild(mapjsA);

    const mapjsB = document.createElement('div');
    mapjsB.id = 'mapjsB';
    mapjsB.classList.add('mirror2');
    bigContainer.appendChild(mapjsB);

    const mapjsC = document.createElement('div');
    mapjsC.id = 'mapjsC';
    mapjsC.classList.add('mirror3');
    bigContainer.appendChild(mapjsC);

    const mapjsD = document.createElement('div');
    mapjsD.id = 'mapjsD';
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
    let map0 = document.getElementById('mapjs') || document.getElementById('map');
    map0.style.display = 'none';
    document.getElementById('mapjsB').style.display = 'none';
    document.getElementById('mapjsC').style.display = 'none';
    document.getElementById('mapjsD').style.display = 'none';
    document.getElementById('lienzo').classList.remove('reverseMirror');
    this.template.querySelector('#set-mirror-' + oldModeViz).classList.remove('buttom-pressed');
    for (let i = 0; i < 10; i++) {
      document.getElementById('lienzo').classList.remove('modeViz' + i);
    }

    document.getElementById('lienzo').classList.add('modeViz' + modeViz);
    if (this.reverseLayout) document.getElementById('lienzo').classList.add('reverseMirror');
    //Create map objects by modeviz
    if ([1, 2].includes(modeViz)) {
      if (this.mapL['B'] === null) {
        this.createMapObjects('B');//Create MapB
      }
    }

    if ([3, 7, 8, 9].includes(modeViz)) {
      if (this.mapL['B'] === null) {
        this.createMapObjects('B');//Create MapB
      }

      if (this.mapL['C'] === null) {
        this.createMapObjects('C');//Create MapC
      }
    }

    if ([4, 5, 6].includes(modeViz)) {
      if (this.mapL['B'] === null) {
        this.createMapObjects('B');//Create MapB
      }

      if (this.mapL['C'] === null) {
        this.createMapObjects('C');//Create MapC
      }

      if (this.mapL['D'] === null) {
        this.createMapObjects('D');//Create MapD
      }
    }

    if (modeViz === 0) {
      const toDelete = this.map_.getPlugins().filter((p) => {
        return p.name === 'lyrdropdown';
      });

      if (toDelete.length > 0) {
        this.lyDropControlA.deactivate(); /** Se quedaba enganchada la última capa. Ahora parece que va al introducir esta línea */
        this.map_.removePlugins(toDelete);
      }


    } else {
      //Añado aquí el DropDownLayer del mapa principal
      this.lyDropControlA = new Lyrdropdown({
        position: 'TL',
        collapsible: false,
        collapsed: true,
        layers: this.defaultBaseLyrs,
        lyrsMirrorMinZindex: this.lyrsMirrorMinZindex,
      });

      this.mapL['A'].addPlugin(this.lyDropControlA);
    }

    this.modeViz = modeViz;
    this.template.querySelector('#set-mirror-' + modeViz).classList.add('buttom-pressed');
    this.map_.refresh();
    if (this.mapL['B'] !== null) { this.mapL['B'].refresh(); }
    if (this.mapL['C'] !== null) { this.mapL['C'].refresh(); }
    if (this.mapL['D'] !== null) { this.mapL['D'].refresh(); }

    // e2m: esta manera de cerrar el panel provocaba que se lanzara el evento deactivateAndActivateMirrorPanel
    //document.querySelector('#m-cp-mirrorpanel > button').click();
    // e2m: de esta manera se oculta el panel y no se lanza el evento, pero es un poco raro
    document.querySelector('#m-cp-mirrorpanel-btn').classList.remove('active');
    document.querySelector('.m-panel-controls .cp-mirrorpanel').classList.remove('hide-panel');

    
  }

  /**
   * Create mirror map object synchro with the main map
   */
  createMapObjects(mapLyr) {
    let pluginFullTOC4map = null;
    let pluginBackImgLayer4map = null;
    let pluginVector = null;

    this.mapL[mapLyr] = M.map({
      container: 'mapjs' + mapLyr,
      center: this.map_.getCenter(),
      projection: this.map_.getProjection().code + '*' + this.map_.getProjection().units,
      zoom: this.map_.getZoom(),
    });

    this.mapL[mapLyr].getMapImpl().setView(this.map_.getMapImpl().getView());

    if (this.enabledPlugins) {
      const listaCtrls = this.map_.getControls();
      const listaPlugs = this.map_.getPlugins();

      listaCtrls.forEach((itemCtrl) => {
        if (itemCtrl.name === 'backgroundlayers'){
          this.mapL[mapLyr].addControls(['backgroundlayers']);
        }

      });

      listaPlugs.forEach((itemPlug) => {
        if (itemPlug.metadata_) {
          //FullTOC
          if (itemPlug.metadata_.name === "FullTOC") {
            pluginFullTOC4map = new M.plugin.FullTOC({
              position: itemPlug.position,
              collapsed: itemPlug.collapsed,
              collapsible: itemPlug.collapsible,
              http: itemPlug.http,
              https: itemPlug.https,
              precharged: itemPlug.precharged
            });
          }
          //Vector
          if (itemPlug.metadata_.name === "Vectors") {
            pluginVector = new M.plugin.Vectors({
              position: itemPlug.position,
              collapsed: itemPlug.collapsed,
              collapsible: itemPlug.collapsible,              
            });
          }
          if (itemPlug.metadata_.name === "backimglayer") {
            pluginBackImgLayer4map = new M.plugin.BackImgLayer({
              //layerId: itemPlug.layerId,
              layerId: mapLyr === 'A' ? 0 : mapLyr === 'B' ? 1 : mapLyr == 'C' ? 2 : 3,
              layerVisibility:  itemPlug.layerVisibility,
              columnsNumber: itemPlug.columnsNumber,
              layerOpts: itemPlug.layerOpts
            });
            //pluginBackImgLayer4map = new M.plugin.BackImgLayer(this.backImgLayersConfig);
          }

        }
      });
    }

    
    if (this.lyDropControl !== null){
      if (mapLyr === 'B'){
        this.mapL[mapLyr].addPlugin(this.lyDropControlB);
      }

      if (mapLyr === 'C'){
        this.mapL[mapLyr].addPlugin(this.lyDropControlC);
      }

      if (mapLyr === 'D'){
        this.mapL[mapLyr].addPlugin(this.lyDropControlD);
      }
    }

    // Añadimos plugins secundarios
    if (pluginFullTOC4map !== null) {
      this.mapL[mapLyr].addPlugin(pluginFullTOC4map);
    } 

    if (pluginVector !== null) {
      this.mapL[mapLyr].addPlugin(pluginVector);
    } 

    if (pluginBackImgLayer4map !== null) {
      this.mapL[mapLyr].addPlugin(pluginBackImgLayer4map);
    } 


    if (this.showCursors) { this.addLayerCursor(mapLyr); }
    this.mapL[mapLyr].refresh();
  }

  /**
   * Adding a layer for cursor on Map
   */
  addLayerCursor(mapLyr) {
    // Cursor Layer
    this.lyrCursor[mapLyr] = new M.layer.Vector({
      name: 'Coordenadas centro ' + mapLyr,
    }, { displayInLayerSwitcher: false });

    this.featureLyrCursor[mapLyr] = new M.Feature('Center' + mapLyr, {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Point',
        coordinates: this.mapL[mapLyr].getCenter(),
      },
    });

    this.lyrCursor[mapLyr].addFeatures([this.featureLyrCursor[mapLyr]]);
    this.lyrCursor[mapLyr].setStyle(this.styleCursor);
    this.lyrCursor[mapLyr].setZIndex(5000);
    this.mapL[mapLyr].addLayers(this.lyrCursor[mapLyr]);
    this.mapL[mapLyr].getMapImpl().on('pointermove', (event) => {
      this.lyrCursor[mapLyr].setVisible(false);
      Object.keys(this.featureLyrCursor).forEach(k => {
        if (k != mapLyr) {
          if (this.featureLyrCursor[k] !== null) {
            this.lyrCursor[k].setVisible(true);
            this.featureLyrCursor[k].setGeometry({
              type: 'Point',
              coordinates: event.coordinate,
            });
          }
        }
      });
    });
  }


  
  manageLyrAvailable(lyrList){
    
    if (this.lyDropControlA.control_!== null){
      this.lyDropControlA.setDisabledLyrs(lyrList);
    }
    if (this.lyDropControlB.control_!== null){
      this.lyDropControlB.setDisabledLyrs(lyrList);
    }  
    if (this.lyDropControlC.control_!== null){
      this.lyDropControlC.setDisabledLyrs(lyrList);
    }
    if (this.lyDropControlD.control_!== null){
      this.lyDropControlD.setDisabledLyrs(lyrList);
    }     
  }

  /**
   * This function is called to remove the effects
   *
   * @public
   * @function
   * @api stable
   */
  removeMaps() {
    this.mapL['B'] = null;
    this.mapL['C'] = null;
    this.mapL['D'] = null;
  }

  destroyMapsContainer() {
    this.manageVisionPanelByCSSGrid(0);
    // Remove mirrors containers
    document.getElementById('mapjsB').remove();
    document.getElementById('mapjsC').remove();
    document.getElementById('mapjsD').remove();
    // Take the main map out of the container
    const lienzo = document.getElementById('lienzo');
    const mapjsA = document.querySelector('.mirror1');
    lienzo.parentElement.insertBefore(mapjsA, lienzo);
    mapjsA.style.display = 'block';
    mapjsA.classList.remove('mirror1');
    mapjsA.classList = this.oldClass;
    // Load the main container
    document.getElementById('lienzo').remove();
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
    return control instanceof CompareMirrorpanel;
  }
}
