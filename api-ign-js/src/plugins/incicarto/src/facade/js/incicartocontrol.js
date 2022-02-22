/**
 * @module M/control/IncicartoControl
 */

import Sortable from 'sortablejs';
import IncicartoImplControl from 'impl/incicartocontrol';
import template from 'templates/incicarto';
import modaladvance from 'templates/modaladvance';
import modalsimple from 'templates/modalsimple';
import layersTemplate from 'templates/layers';
import drawingTemplate from 'templates/drawing';
import downloadingTemplate from 'templates/downloading';
import uploadingTemplate from 'templates/uploading';
import changeNameTemplate from 'templates/changename';
import addWFSTemplate from 'templates/addwfs';
import selectWFSTemplate from 'templates/selectwfs';
import shpWrite from 'shp-write';
import tokml from 'tokml';
import togpx from 'togpx';
import * as shp from 'shpjs';
import { getValue } from './i18n/language';
import { timesSeries } from 'async';

const formatNumber = (x) => {
  const num = Math.round(x * 100) / 100;
  return num.toString().replace('.', ',').replace(/\B(?=(\d{3})+(?!\d))/g, '.');
};

const POINTS = [1, 15];
const LINES = [10, 15];
const LINE_POINTS = [1, 15, 20, 15];

export default class IncicartoControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(options) {
    if (M.utils.isUndefined(IncicartoImplControl)) {
      M.exception(getValue('exception.impl'));
    }

    const impl = new IncicartoImplControl();
    super(impl, 'Incicarto');

    // facade control goes to impl as reference param
    impl.facadeControl = this;

    /**
     * Selected Mapea feature
     * @private
     * @type {M.feature}
     */
    this.feature = undefined;

    /**
     * Feature that is drawn on selection layer around this.feature
     * to emphasize it.
     * @private
     * @type {M.feature}
     */
    this.emphasis = undefined;

    /**
     * Current geometry type selected for drawing.
     * @private
     * @type {String}
     */
    this.geometry = undefined; // Point, LineString, Polygon

    /**
     * Template that expands drawing tools with color and thickness options.
     * @private
     * @type {String}
     */
    this.drawingTools = undefined;

    /**
     * Template with uploading format options.
     * @private
     * @type {String}
     */
    this.uploadingTemplate = undefined;

    /**
     * Current color for drawing features.
     * @private
     * @type {String}
     */
    this.currentColor = undefined;

    /**
     * Current line thickness (or circle radius) for drawing features.
     * @private
     * @type {Number}
     */
    this.currentThickness = undefined;

    /**
     * Current line dash for drawing linestring features.
     * @private
     * @type {Number}
     */
    this.currentLineDash = undefined;

    /**
     * SRS of the input coordinates.
     * @private
     * @type {String}
     */
    this.srs = 'EPSG:4258';

    /**
     * Saves drawing layer ( __ draw__) from Mapea.
     * @private
     * @type {*} - Mapea layer
     */
    this.drawLayer = undefined;

    /**
     * File to upload.
     * @private
     * @type {*}
     */
    this.file_ = null;

    /**
     * Mapea layer where a square will be drawn around selected feature.
     * @private
     * @type {*}
     */
    this.selectionLayer = new M.layer.Vector({
      extract: false,
      name: 'selectLayer',
      source: this.getImpl().newVectorSource(true),
    });

    this.html = null;

    this.isEditionActive = false;

    this.isDrawingActive = false;

    this.isDownloadActive = false;

    this.pluginOpened = false;

    this.wfszoom = options.wfszoom;

    this.precharged = options.precharged;

    this.interfazmode = options.interfazmode;

    this.buzones = options.buzones;

    this.errThemes = options.errThemes;
    this.errTypes = options.errTypes;
    this.errProducts = options.errProducts;

    this.themes = options.themes;
    this.errors = options.errors;
    this.products = options.products;
    this.geometryIncidence = null;
    this.geometryIncidenceX = 0;
    this.geometryIncidenceY = 0;

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

      const optionsTemplate =  {
        jsonp: true,
        vars: {
          translations: {
            add_point_layer: getValue('add_point_layer'),
            add_line_layer: getValue('add_line_layer'),
            add_poly_layer: getValue('add_poly_layer'),
            add_wfs_layer: getValue('add_wfs_layer'),
            load_layer: getValue('load_layer'),
          },
          themes:[],
          errors:{},
          products:{},
        },
      };

      if (this.themes.length >= 1) {
        optionsTemplate.vars.themes = this.themes;
      }
      if (this.errors.length >= 1) {
        optionsTemplate.vars.errors = this.errors;
      }
      if (this.products.length >= 1) {
        optionsTemplate.vars.products = this.products;
      }

      const html = M.template.compileSync(template,optionsTemplate);
      this.html = html;
      this.renderLayers();
      success(html);
      this.addEvents(html);
      this.createDrawingTemplate();
      this.createUploadingTemplate();
      this.map.addLayers(this.selectionLayer);
    });
  }

  toogleActivate() {
    if (this.pluginOpened) {
      this.pluginOpened = false;
    } else {
      this.pluginOpened = true;
    }
  }

  renderLayers() {
    const filtered = this.map.getLayers().filter((layer) => {
      return ['kml', 'geojson', 'wfs', 'vector'].indexOf(layer.type.toLowerCase()) > -1 &&
        layer.name !== undefined && layer.name !== 'selectLayer' && layer.name !== '__draw__' && layer.name !== 'coordinateresult' &&
        layer.name !== 'searchresult' && layer.name.indexOf('Coordenadas centro ') === -1 && layer.name !== 'infocoordinatesLayerFeatures';
    });

    const layers = [];
    filtered.forEach((layer) => {
      if (!(layer.type.toLowerCase() === 'kml' && layer.name.toLowerCase() === 'attributions')) {
        const newLayer = layer;
        const geometry = !M.utils.isNullOrEmpty(layer.geometry) ?
          layer.geometry : layer.getGeometryType();
        if (!M.utils.isNullOrEmpty(geometry) && geometry.toLowerCase().indexOf('point') > -1) {
          newLayer.point = true;
        } else if (!M.utils.isNullOrEmpty(geometry) && geometry.toLowerCase().indexOf('polygon') > -1) {
          newLayer.polygon = true;
        } else if (!M.utils.isNullOrEmpty(geometry) && geometry.toLowerCase().indexOf('line') > -1) {
          newLayer.line = true;
        }

        if (newLayer.point || newLayer.polygon || newLayer.line) {
          if (newLayer.legend === undefined) {
            newLayer.legend = newLayer.name;
          }

          newLayer.visible = layer.isVisible();
          layers.push(newLayer);
        }
      }
    });

    const html = M.template.compileSync(layersTemplate, {
      jsonp: true,
      vars: {
        layers,
        translations: {
          point_layer: getValue('point_layer'),
          line_layer: getValue('line_layer'),
          poly_layer: getValue('poly_layer'),
          show_hide: getValue('show_hide'),
          add_geom: getValue('add_geom'),
          edit_geom: getValue('edit_geom'),
          edit_geom_line: getValue('edit_geom_line'),
          layer_zoom: getValue('layer_zoom'),
          download_layer: getValue('download_layer'),
          notify_err: getValue('notify_err'),
          delete_layer: getValue('delete_layer'),
          change_name: getValue('change_name'),
          reload_from_view: getValue('reload_from_view'),
        },
      },
    });

    const container = this.html.querySelector('.m-incicarto-layers-container');
    container.innerHTML = '';
    if (layers.length > 0) {
      container.appendChild(html);
      html.addEventListener('click', this.clickLayer.bind(this), false);
      const layerList = this.html.querySelector('#m-incicarto-list');
      Sortable.create(layerList, {
        animation: 150,
        ghostClass: 'm-incicarto-gray-shadow',
        onEnd: (evt) => {
          const from = evt.from;
          let maxZIndex = Math.max(...(layers.map((l) => {
            return l.getZIndex();
          })));
          from.querySelectorAll('li.m-incicarto-layer').forEach((elem) => {
            const name = elem.getAttribute('name');
            const url = elem.getAttribute('url');
            const filtered2 = layers.filter((layer) => {
              return layer.name === name && (layer.url === url || url === '');
            });

            if (filtered2.length > 0) {
              filtered2[0].setZIndex(maxZIndex);
              maxZIndex -= 1;
            }
          });
        },
      });
    }
  }

  /**
   * Creates drawing options template.
   * @public
   * @function
   * @api
   */
  createDrawingTemplate() {
    console.log("createDrawingTemplate");
    this.drawingTools = M.template.compileSync(drawingTemplate, {
      jsonp: true,
      vars: {
        translations: {
          color: getValue('color'),
          thickness: getValue('thickness'),
          line: getValue('line'),
          delete_geom: getValue('delete_geom'),
          query_profile: getValue('query_profile'),
          collapse: getValue('collapse'),
        },
      },
    });
    this.currentColor = this.drawingTools.querySelector('#colorSelector').value;
    this.currentThickness = this.drawingTools.querySelector('#thicknessSelector').value;
    this.drawingTools.querySelector('.collapsor').addEventListener('click', e => this.toogleCollapse(e));
    this.drawingTools.querySelector('#colorSelector').addEventListener('change', e => this.styleChange(e));
    this.drawingTools.querySelector('#thicknessSelector').addEventListener('change', e => this.styleChange(e));
    this.drawingTools.querySelector('button.m-incicarto-layer-delete-feature').addEventListener('click', () => this.deleteSingleFeature());
    this.drawingTools.querySelector('button.m-incicarto-layer-profile').addEventListener('click', () => this.getProfile());
    this.drawingTools.querySelector('button').style.display = 'none';
    this.drawingTools.querySelector('div.stroke-options').addEventListener('click', (e) => {
      const evt = (e || window.event);
      const selector = this.drawingTools.querySelector('div.stroke-options');
      if (evt.target.classList.contains('stroke-continuous')) {
        selector.querySelectorAll('div').forEach((elem) => {
          elem.classList.remove('active');
        });

        selector.querySelector('div.stroke-continuous').classList.add('active');
        this.currentLineDash = undefined;
      } else if (evt.target.classList.contains('stroke-dots-lines')) {
        selector.querySelectorAll('div').forEach((elem) => {
          elem.classList.remove('active');
        });

        if (evt.target.classList.contains('active')) {
          selector.querySelector('div.stroke-continuous').classList.add('active');
          this.currentLineDash = undefined;
        } else {
          selector.querySelector('div.stroke-dots-lines').classList.add('active');
          this.currentLineDash = LINE_POINTS;
        }
      } else if (evt.target.classList.contains('stroke-lines')) {
        selector.querySelectorAll('div').forEach((elem) => {
          elem.classList.remove('active');
        });

        if (evt.target.classList.contains('active')) {
          selector.querySelector('div.stroke-continuous').classList.add('active');
          this.currentLineDash = undefined;
        } else {
          selector.querySelector('div.stroke-lines').classList.add('active');
          this.currentLineDash = LINES;
        }
      } else if (evt.target.classList.contains('stroke-dots')) {
        selector.querySelectorAll('div').forEach((elem) => {
          elem.classList.remove('active');
        });

        if (evt.target.classList.contains('active')) {
          selector.querySelector('div.stroke-continuous').classList.add('active');
          this.currentLineDash = undefined;
        } else {
          selector.querySelector('div.stroke-dots').classList.add('active');
          this.currentLineDash = POINTS;
        }
      }

      this.styleChange(e);
    });
  }

  toogleCollapse(e) {
    const elem = document.querySelector('#drawingtools .drawingToolsContainer');
    if (elem !== null) {
      if (elem.style.display !== 'none') {
        elem.style.display = 'none';
        const cond = this.drawLayer.getGeometryType() !== null && this.drawLayer.getGeometryType().toLowerCase() === 'linestring';
        if (cond || (this.drawLayer.geometry !== undefined && this.drawLayer.geometry !== '' && this.drawLayer.geometry.toLowerCase() === 'linestring')) {
          document.querySelector('#drawingtools .collapsor').innerHTML = `${getValue('symbology_profile')}&nbsp;&nbsp;<span class="icon-show"></span>`;
        } else {
          document.querySelector('#drawingtools .collapsor').innerHTML = `${getValue('symbology')}&nbsp;&nbsp;<span class="icon-show"></span>`;
        }
      } else {
        elem.style.display = 'block';
        document.querySelector('#drawingtools .collapsor').innerHTML = `${getValue('collapse')}&nbsp;&nbsp;<span class="icon-hide"></span>`;
      }
    }
  }

  /**
   * Creates upload options template.
   *
   * @public
   * @function
   * @api
   */
  createUploadingTemplate() {
    const accept = '.kml, .zip, .gpx, .geojson, .gml';
    this.uploadingTemplate = M.template.compileSync(uploadingTemplate, {
      jsonp: true,
      vars: {
        accept,
        translations: {
          accepted: getValue('accepted'),
          select_file: getValue('select_file'),
        },
      },
    });
    const inputFile = this.uploadingTemplate.querySelector('#incicarto-uploading>input');
    inputFile.addEventListener('change', evt => this.changeFile(evt, inputFile.files[0]));
  }

  /**
   * Adds event listeners to geometry buttons.
   * @public
   * @function
   * @api
   * @param {String} html - Geometry buttons template.
   */
  addEvents(html) {

    // e2m: este botón es un botón de test para verificar los formularios modales sin crear
    html.querySelector('#incicarto-test-modal-simple').addEventListener('click', ()=>{
       this.activateModalSimple();
    });
    html.querySelector('#incicarto-test-modal-advance').addEventListener('click', ()=>{
      this.activateModalAdvanced();
   });

    document.querySelector('.m-incicarto > button.m-panel-btn').addEventListener('click', this.toogleActivate.bind(this));
    html.querySelector('#incicarto-add-point').addEventListener('click', this.addNewLayer.bind(this, 'Point'));
    html.querySelector('#incicarto-add-line').addEventListener('click', this.addNewLayer.bind(this, 'LineString'));
    html.querySelector('#incicarto-add-poly').addEventListener('click', this.addNewLayer.bind(this, 'Polygon'));
    //html.querySelector('#incicarto-add-wfs').addEventListener('click', this.openAddWFS.bind(this));
    html.querySelector('#incicarto-upload').addEventListener('click', () => this.openUploadOptions());
    this.addDragDropEvents();
  }

  /**
   * Genera la versión avanzada del formulario de Incidencias con conexióna INCIGEO
   */
  activateModalAdvanced() {

    let optionsModal = {
      jsonp: true,
      parseToHtml: false, // La compilación de la plantilla devuelve una cadena cuando parseToHtml = false
      vars: {
        translations: {
          headtext1: 'Descripción de la incidencia',
          headtext2: 'Enviar por correo electrónico',
          headtext3: 'Notificar por INCIGEO',
          btntext1: 'Enviar e-mail',
          btntext2: 'Alta de incidencia',
        },
        mails:{},
        themes:{},
        errors:{},
        products:{},
      },
    };

    if (this.buzones.length >= 1) {
      optionsModal.vars.mails = this.buzones;
    }
    if (this.themes.length >= 1) {
      optionsModal.vars.themes = this.themes;
    }

    if (this.errors.length >= 1) {
      optionsModal.vars.errors = this.errors;
    }

    if (this.products.length >= 1) {
      optionsModal.vars.products = this.products;
    }

    const dialog = M.template.compileSync(modaladvance, optionsModal);
    M.dialog.info(dialog,"Enviar notificación de incidencia en cartografía");
    
    setTimeout(() => {

      document.querySelector("#m-plugin-incicarto-send-email").addEventListener('click',(e)=>{
        let destinataryContainer = document.querySelector("#email-to");
        let destinatary = destinataryContainer.options[destinataryContainer.selectedIndex].value;
        let mailto_composed = this.composeMailtoSend(destinatary)
        if (mailto_composed===false){
          console.log("El mail no ha sido validado");
          return;
        }
        console.log(`Envío de correo electrónico ${destinatary}`);
        window.open(mailto_composed,'emailWindow');
        // document.querySelector('div.m-mapea-container div.m-dialog').remove(); // Así cerramos a lo loco
        document.querySelector("#m-plugin-incicarto-send-email").disabled = true;
        this.showMessageInModalAdvanced("El correo con la incidencia se ha generado correctamente. Utilice su cliente habitual para enviarlo.","okmessage");
        document.querySelector("#m-plugin-incicarto-send-email").disabled=true;
      });

      document.querySelector("#m-plugin-incicarto-connect-incicarto").addEventListener('click',(e)=>{
        

        this.composeIncidencia4INCIGEO();
        document.querySelector("#m-plugin-incicarto-connect-incicarto").disabled = true;
      });

      // Para configurar la apariencia del botón Cerrar del modal
      const button = document.querySelector('div.m-dialog.info div.m-button > button');
      button.innerHTML = getValue('close');
      button.style.width = '75px';
      button.style.backgroundColor = '#71a7d3';
      const titleModal = document.querySelector('div.m-dialog.info div.m-title');
      titleModal.style.backgroundColor = '#71a7d3';
    }, 10);
    
  }

  /**
   * Genera la versión sencilla del formulario de Incidencias
   */
  activateModalSimple() {

    let optionsModal = {
      jsonp: true,
      parseToHtml: false, // La compilación de la plantilla devuelve una cadena cuando parseToHtml = false
      vars: {
        translations: {
          headtext1: 'Descripción de la incidencia',
          btntext1: 'Enviar e-mail',
        },
        themes:{},
        errors:{},
        products:{},
      },
    };

    if (this.themes.length >= 1) {
      optionsModal.vars.themes = this.themes;
    }
    const dialog = M.template.compileSync(modalsimple, optionsModal);
    M.dialog.info(dialog,"Enviar notificación de incidencia en cartografía");
    
    setTimeout(() => {

      document.querySelector("#m-plugin-incicarto-simple-send-email").addEventListener('click',(e)=>{
        let mailto_composed = this.composeSimpleMailtoSend()
        if (mailto_composed===false){
          console.log("El mail no ha sido validado");
          return;
        }
        window.open(mailto_composed,'emailWindow');
        // document.querySelector('div.m-mapea-container div.m-dialog').remove(); // Así cerramos a lo loco
        document.querySelector("#m-plugin-incicarto-simple-send-email").disabled = true;
        this.showMessageInModalAdvanced("El correo con la incidencia se ha generado correctamente. Utilice su cliente habitual para enviarlo.","okmessage");
      });

      document.getElementById('fileUpload').onchange = function () {
        
        let fileName = 'Adjuntar fichero &hellip;';
        if( this.files ){
          if(this.files.length > 1 ){
            fileName = ( this.getAttribute( 'data-multiple-caption' ) || '' ).replace( '{count}', this.files.length );
          }else if (this.files.length === 1){
            fileName = this.value;
          }
        }
        console.log(this.files);
        document.getElementById('infoUpload').innerHTML=fileName;
      };

       
      // Para configurar la apariencia del botón Cerrar del modal
      const button = document.querySelector('div.m-dialog.info div.m-button > button');
      button.innerHTML = getValue('close');
      button.style.width = '75px';
      button.style.backgroundColor = '#71a7d3';
      const titleModal = document.querySelector('div.m-dialog.info div.m-title');
      titleModal.style.backgroundColor = '#71a7d3';
    }, 10);
    
  }

/**
 * 
 * @param {*} messageText 
 * @param {String} classHTML Nombre de la clase para asignar estilo: okmessage, nakmessage 
 */
  showMessageInModalAdvanced(messageText,classHTML){
    this.resetMessageInModalAdvanced();
    document.querySelector("#result-notification").innerHTML = messageText;
    document.querySelector("#result-notification").classList.add(classHTML);
  }

/**
 * Limpia el cuadro para mensajes en el modal
 */
  resetMessageInModalAdvanced(){
    document.querySelector("#result-notification").innerHTML = "";
    document.querySelector("#result-notification").classList.remove("okmessage");
    document.querySelector("#result-notification").classList.remove("nakmessage");
  }

  /**
   * Valida los datos marcados por el usuario
   * 
   * @returns 
   */
  validateIncidenciaMessageInModalAdvanced(){

    const themeMetadataContainer = document.querySelector("#theme-select");
    const errorMetadataContainer = document.querySelector("#error-select");
    const productMetadataContainer = document.querySelector("#product-select");

      if (this.errThemes.mandatory===true && themeMetadataContainer.selectedIndex===0){
        this.showMessageInModalAdvanced("Clasifique el error con un tema","nakmessage");
        return false;
      }else if (this.errTypes.mandatory===true && errorMetadataContainer.selectedIndex===0){
        this.showMessageInModalAdvanced("Clasifique el error con un tipo","nakmessage");
        return false;
      }else if (this.errProducts.mandatory===true && productMetadataContainer.selectedIndex===0){
        this.showMessageInModalAdvanced("Clasifique el error con un producto","nakmessage");
        return false;
      }

      return true;

  }

  /**
   * Compone el mensaje para el correo enviado por el interfaz Modal Advanced
   * 
   * @param {*} destinatary 
   * @returns 
   */
  composeMailtoSend(destinatary) {

    let themeMetadataContainer = document.querySelector("#theme-select");
    let errorMetadataContainer = document.querySelector("#error-select");
    let productMetadataContainer = document.querySelector("#product-select");


    if (this.validateIncidenciaMessageInModalAdvanced()===false){
      console.log("Validación errónea");
      return false;
    };

    let theme = themeMetadataContainer.options[themeMetadataContainer.selectedIndex].value;
    let error = errorMetadataContainer.options[errorMetadataContainer.selectedIndex].value;
    let product = productMetadataContainer.options[productMetadataContainer.selectedIndex].value;
    let errDescription = document.querySelector("#err-description").value;

    let email_subject = 'Metadatos de la incidencia';
    let email_body = {
      "description": errDescription,
      "theme": theme,
      "error": error,
      "product": product,
      "geometry": this.geometryIncidence,
    };
           
    return 'mailto:' + destinatary + '?subject=' + email_subject + '&body=' + JSON.stringify(email_body, null, '\t');

  }

  /**
   * Compone el mensaje para el correo enviado por el interfaz Modal Simple
   * 
   * @returns 
   */
  composeSimpleMailtoSend() {

    const themeMetadataContainer = document.querySelector("#theme-select");
    if (this.errThemes.mandatory===true && themeMetadataContainer.selectedIndex===-1){
      console.log(`Validación errónea: ${themeMetadataContainer.selectedIndex}`);
      return false;
    }

    let theme = themeMetadataContainer.options[themeMetadataContainer.selectedIndex].value;
    let destinatary = this.themes.find(item => item.idTheme == theme).emailTheme;
    let errDescription = document.querySelector("#err-description").value;
    let email_subject = 'Metadatos de la incidencia';

    const { x, y } = this.map_.getCenter();
    const { code, units } = this.map_.getProjection();
    let shareURL = `?center=${x},${y},zoom=${this.map_.getZoom()}`;
    shareURL = shareURL.concat(`,projection=${code}*${units}`);
    
    let propiedades = {
      "descripción": errDescription,
      "theme": theme,
      "destinatary": destinatary,
      "URL": window.location.href,
      "paramsURL": encodeURI(shareURL),
    }

    // e2m: así sacamos la capas
    console.log(this.map_.getLayers());

    if (this.geometryIncidenceJSON.features.length>0){
      this.geometryIncidenceJSON.features[0].properties=propiedades;
    }
    console.log(`mailto: ${destinatary}`);
    console.log(`subject: ${email_subject}`);
    console.log(JSON.stringify(this.geometryIncidenceJSON));

    return 'mailto:' + destinatary + '?subject=' + email_subject + '&body=' + JSON.stringify(this.geometryIncidenceJSON);
  }

  /**
   * Compone el protocolo de comunicación con el SOAP de INCIGEO
   * 
   */
  composeIncidencia4INCIGEO(){

    const urlINCIGEOToken = "https://incigeo.ign.es/incigeo_pre/webservice.aspx";
    const urlINCIGEOCreateError = "https://incigeo.ign.es/incigeo_pre/webservice.aspx";
    const loginUser = "pruebas_inserciones";  //usr_signa
    const loginPwd = "pruebas";               //pr_signa


    console.log("Proceso de alta en INCIGEO");

    const soapCreateError = (tokenAccess) => {
  
      const codeViaEntrada = "WEBAPP";    // Directo, IDV
      const procedenciaCd = "USUARIO_EXTERNO";  // SIGNA  , INCICARTO
      
      const prioridad = "1" //Opciones 1: normal, 99: urgente.

      let themeMetadataContainer = document.querySelector("#theme-select");
      let errorMetadataContainer = document.querySelector("#error-select");
      let productMetadataContainer = document.querySelector("#product-select");
      let themeError = themeMetadataContainer.options[themeMetadataContainer.selectedIndex].text;
      let typeError = errorMetadataContainer.options[errorMetadataContainer.selectedIndex].text;
      let productError = productMetadataContainer.options[productMetadataContainer.selectedIndex].text;

      let cooX = this.geometryIncidenceX;
      let cooY = this.geometryIncidenceY;
      let descriptionIncidencia = document.querySelector("#err-description").value;
      let emailUser = document.querySelector("#email-notify").value;
      let descriptionErr = "Descripción del error";
      let urlVisualizador = "https://iberpix.cnig.es/iberpix/visor/";
    
      let strNewErrorMessage3 = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.b2tconcept.com/webservices/">
                      <soapenv:Header/>
                      <soapenv:Body>
                        <web:CreateErrorsIGN>
                          <web:token>${tokenAccess}</web:token>
                          <web:codeViaEntrada>${codeViaEntrada}</web:codeViaEntrada>
                          <web:procedenciaCd>${procedenciaCd}</web:procedenciaCd>
                          <web:emailDs>${emailUser}</web:emailDs>
                          <web:ordenPrioridadNm >${prioridad}</web:ordenPrioridadNm>
                          <web:descInciDs>${descriptionIncidencia}</web:descInciDs>
                          <web:arrayErrors>
                            <web:WS_ERROR_DATA>
                            <web:desc>${descriptionErr}</web:desc><!-- Mandatory -->
                            <web:x>${cooX}</web:x><!-- Mandatory -->
                            <web:y>${cooY}</web:y><!-- Mandatory -->
                            <web:theme>${themeError}</web:theme><!--- Control list -->
                            <web:type>${typeError}</web:type><!--- Control list -->
                            <web:prodDetectCd>${productError}</web:prodDetectCd><!--- Control list -->
                            <web:urlDs>${urlVisualizador}</web:urlDs>
                              <web:fileExtCd></web:fileExtCd>
                              <web:fileBase64Ds></web:fileBase64Ds>
                              </web:WS_ERROR_DATA>
                          </web:arrayErrors>
                        </web:CreateErrorsIGN>
                      </soapenv:Body>
                    </soapenv:Envelope>`;
    
    
      const parserRequest = new DOMParser();
      const xmlDOMRequest = parserRequest.parseFromString(strNewErrorMessage3, "text/xml");
      console.log(xmlDOMRequest);
    
    
    
      function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
          console.log("1");
          xhr.open(method, url, false);
        } else if (typeof XDomainRequest != "undefined") {
          console.log("2");
          xhr = new XDomainRequest();
          xhr.open(method, url);
        } else {
          console.log("CORS not supported");
          alert("CORS not supported");
          xhr = null;
        }
        return xhr;
      }
      
      var xhr = createCORSRequest("POST", urlINCIGEOCreateError);
      if (!xhr) {
        console.log("XHR issue");
        return;
      }
    
      xhr.onload = function () {
        var results = xhr.responseText;
        const parserResponse = new DOMParser();
        const xmlDOMResponse = parserResponse.parseFromString(results, "text/xml");
        console.log(xmlDOMResponse);
        const returnCD = xmlDOMResponse.getElementsByTagName("web:RETURN_CD")[0].childNodes[0].nodeValue;
        const returnDS = xmlDOMResponse.getElementsByTagName("web:RETURN_DS")[0].childNodes[0].nodeValue;
        if (returnCD==='0'){
          let codeInc = xmlDOMResponse.getElementsByTagName("web:codeInc")[0].childNodes[0].nodeValue;
          //document.querySelector("#result-notification").innerHTML =`<small>${returnDS}. Incidencia ${codeInc}</small>`;
          document.querySelector("#m-plugin-incicarto-connect-incicarto").disabled=true;
          document.querySelector("#result-notification").innerHTML = `${returnDS}. Incidencia ${codeInc}.`;
          document.querySelector("#result-notification").classList.remove("okmessage");
          document.querySelector("#result-notification").classList.remove("nakmessage");
          document.querySelector("#result-notification").classList.add("okmessage");
        }else{
          document.querySelector("#result-notification").innerHTML = `<small>${returnDS}. Error: ${returnCD}.</small>`;
          document.querySelector("#result-notification").classList.remove("okmessage");
          document.querySelector("#result-notification").classList.remove("nakmessage");
          document.querySelector("#result-notification").classList.add("nakmessage");
        }
        //console.info(returnCD); // Devuelve cero si se ha creado
        //console.info(returnDS); // Descripción literal del código devuelto "La operación se ha realizado correctamente"
        //console.info(codeInc);  // Devuelve código de incidencia para seguimiento
    }
    
      xhr.setRequestHeader('Content-Type', 'text/xml');
      xhr.send(strNewErrorMessage3);
    
    }

    const soapTokenRequest = () => {

      var strTokenRequest = `<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.b2tconcept.com/webservices/">
                   <soapenv:Header/>
                    <soapenv:Body>
                      <web:DoLogin>
                        <web:loginDs>${loginUser}</web:loginDs>
                        <web:pwdCd>${loginPwd}</web:pwdCd>
                      </web:DoLogin>
                    </soapenv:Body>
                   </soapenv:Envelope>`;
    
      function createCORSRequest(method, url) {
        var xhr = new XMLHttpRequest();
        if ("withCredentials" in xhr) {
          xhr.open(method, url, false);
        } else if (typeof XDomainRequest != "undefined") {
          xhr = new XDomainRequest();
          xhr.open(method, url);
        } else {
          console.log("CORS not supported");
          alert("CORS not supported");
          xhr = null;
        }
        return xhr;
      }
      var xhr = createCORSRequest("POST", urlINCIGEOToken);
      if (!xhr) {
        console.log("XHR issue");
        return;
      }
    
      xhr.onload = function () {
        var results = xhr.responseText;
        const parser = new DOMParser();
        const xmlDOM = parser.parseFromString(results, "text/xml");
        const value = xmlDOM.getElementsByTagName("web:TOKEN_CD")[0].childNodes[0].nodeValue;
        console.log(xmlDOM);
        console.log(value);
        console.log(results);
        soapCreateError(value);
      }
    
      xhr.setRequestHeader('Content-Type', 'text/xml');
      xhr.send(strTokenRequest);
    }

    // Si no hacemos esto, no da tiempo a que salga el mensaje
    setTimeout(() => {
      soapTokenRequest();
    }, 250);
    
    this.showMessageInModalAdvanced("Conectando con INCIGEO para enviar incidencia","okmessage");
    
  }

  openAddWFS() {
    const addWFS = M.template.compileSync(addWFSTemplate, {
      jsonp: true,
      parseToHtml: false,
      vars: {
        hasPrecharged: this.precharged.length > 0,
        precharged: this.precharged,
        translations: {
          url_service: getValue('url_service'),
          query: getValue('query'),
          clean: getValue('clean'),
          availables: getValue('availables'),
          loaded_services: getValue('loaded_services'),
        },
      },
    });

    M.dialog.info(addWFS, getValue('add_wfs_layer'));
    setTimeout(() => {
      if (document.querySelector('#m-incicarto-addwfs-list-btn') !== null) {
        document.querySelector('#m-incicarto-addwfs-list-btn').addEventListener('click', e => this.showSuggestions(e));
      }

      document.querySelector('#m-incicarto-addwfs-search-input').addEventListener('keyup', (e) => {
        const url = document.querySelector('#m-incicarto-addwfs-search-input').value.trim();
        document.querySelector('#m-incicarto-addwfs-search-input').value = url;
      });

      document.querySelector('#m-incicarto-addwfs-search-btn').addEventListener('click', e => this.readWFSCapabilities(e));
      document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
      const button = document.querySelector('div.m-dialog.info div.m-button > button');
      button.innerHTML = getValue('close');
      button.style.width = '75px';
      button.style.backgroundColor = '#71a7d3';
      document.querySelectorAll('#m-incicarto-addwfs-suggestions .m-incicarto-addwfs-suggestion').forEach((elem) => {
        elem.addEventListener('click', e => this.loadSuggestion(e));
      });
    }, 10);
  }

  showSuggestions() {
    document.querySelector('#m-incicarto-addwfs-results').innerHTML = '';
    document.querySelector('#m-incicarto-addwfs-suggestions').style.display = 'block';
  }

  loadSuggestion(evt) {
    const url = evt.target.getAttribute('data-link');
    document.querySelector('div.m-dialog #m-incicarto-addwfs-search-input').value = url;
    this.readWFSCapabilities(evt);
  }

  /**
   * This function reads WFS service capabilities
   *
   * @function
   * @private
   * @param {Event} evt - Click event
   */
  readWFSCapabilities(evt) {
    evt.preventDefault();
    document.querySelector('#m-incicarto-addwfs-suggestions').style.display = 'none';
    let url = document.querySelector('div.m-dialog #m-incicarto-addwfs-search-input').value.trim();
    const auxurl = document.querySelector('div.m-dialog #m-incicarto-addwfs-search-input').value.trim();
    if (!M.utils.isNullOrEmpty(url)) {
      if (M.utils.isUrl(url)) {
        url += url.endsWith('?') ? '' : '?';
        url += 'service=WFS&request=GetCapabilities';
        M.remote.get(url).then((response) => {
          try {
            const services = [];
            const prenode = response.text.split('<FeatureTypeList>')[1].split('</FeatureTypeList>')[0];
            if (prenode.indexOf('<FeatureType>') > -1) {
              const nodes = prenode.split('<FeatureType>');
              nodes.forEach((node) => {
                if (node.indexOf('</Name>') > -1) {
                  services.push({
                    name: node.split('</Name>')[0].split('>')[1].trim(),
                    title: node.split('</Title>')[0].split('<Title>')[1].trim(),
                  });
                }
              });
            } else if (prenode.indexOf('<FeatureType') > -1) {
              const nodes = prenode.split('<FeatureType');
              nodes.forEach((node) => {
                if (node.indexOf('</Name>') > -1) {
                  services.push({
                    name: node.split('</Name>')[0].split('<Name>')[1].trim(),
                    title: node.split('</Title>')[0].split('<Title>')[1].trim(),
                  });
                }
              });
            }

            const capabilities = {};
            let hasCapabilities = false;
            try {
              capabilities.title = response.text.split('<ows:Title>')[1].split('</ows:Title>')[0];
              hasCapabilities = true;
            } catch (err) {
              hasCapabilities = hasCapabilities || false;
            }

            try {
              capabilities.abstract = response.text.split('<ows:Abstract>')[1].split('</ows:Abstract>')[0];
              hasCapabilities = true;
            } catch (err) {
              hasCapabilities = hasCapabilities || false;
            }

            try {
              capabilities.accessConstraints = response.text.split('<ows:AccessConstraints>')[1].split('</ows:AccessConstraints>')[0];
              hasCapabilities = true;
            } catch (err) {
              hasCapabilities = hasCapabilities || false;
            }

            document.querySelector('div.m-dialog #m-incicarto-addwfs-search-input').value = auxurl;
            this.showResults(services, capabilities, hasCapabilities);
          } catch (err) {
            M.dialog.error(getValue('exception.capabilities'));
          }
        });
      } else {
        M.dialog.error(getValue('exception.valid_url'));
      }
    } else {
      M.dialog.error(getValue('exception.empty'));
    }
  }

  showResults(services, capabilities, hasCapabilities) {
    const selectWFS = M.template.compileSync(selectWFSTemplate, {
      jsonp: true,
      vars: {
        services,
        capabilities,
        hasCapabilities,
        translations: {
          select_service: getValue('select_service'),
          select: getValue('select'),
          show_service_info: getValue('show_service_info'),
          title: getValue('title'),
          abstract: getValue('abstract'),
          responsible: getValue('responsible'),
          access_constraints: getValue('access_constraints'),
        },
      },
    });

    document.querySelector('#m-incicarto-addwfs-results').innerHTML = '';
    document.querySelector('#m-incicarto-addwfs-results').appendChild(selectWFS);
    const selector = '#m-incicarto-select-wfs .m-incicarto-common-btn';
    document.querySelector(selector).addEventListener('click', e => this.openWFSFilters(e, services));
    const elem = document.querySelector('#m-incicarto-select-wfs .m-incicarto-wfs-show-capabilities');
    if (elem !== null) {
      elem.addEventListener('click', () => {
        const block = document.querySelector('#m-incicarto-select-wfs .m-incicarto-wfs-capabilities-container');
        if (block.style.display !== 'block') {
          block.style.display = 'block';
          elem.innerHTML = `<span class="icon-hide"></span>&nbsp;${getValue('hide_service_info')}`;
        } else {
          block.style.display = 'none';
          elem.innerHTML = `<span class="icon-show"></span>&nbsp;${getValue('show_service_info')}`;
        }
      });
    }
  }

  openWFSFilters(evt, services) {
    evt.preventDefault();
    const selected = document.querySelector('#m-incicarto-wfs-select').value;
    let url = document.querySelector('div.m-dialog #m-incicarto-addwfs-search-input').value.trim();
    url += url.endsWith('?') ? '' : '?';
    document.querySelector('div.m-mapea-container div.m-dialog').remove();
    let legend = selected;
    const filtered = services.filter((s) => {
      return s.name === selected;
    });

    if (filtered.length > 0) {
      legend = filtered[0].title;
    }

    this.getImpl().addWFSLayer(url, selected, legend);
  }

  addDragDropEvents() {
    document.addEventListener('dragover', (e) => {
      e.preventDefault();
    }, false);

    document.addEventListener('dragleave', (e) => {
      e.preventDefault();
    }, false);

    document.addEventListener('drop', (e) => {
      e.stopPropagation();
      e.preventDefault();
      const files = e.dataTransfer.files;
      this.changeFile(e, files[0]);
    }, false);
  }

  addNewLayer(geom) {
    const layerName = `incidencia_${new Date().getTime()}`;
    const layer = new M.layer.Vector({ name: layerName, legend: layerName, extract: false });
    layer.geometry = geom;
    this.map.addLayers(layer);
    setTimeout(() => {
      document.querySelector(`li[name="${layerName}"] span.m-incicarto-layer-add`).click();
    }, 100);
  }



  
  /**
   * Changes style of current feature.
   * @public
   * @function
   * @api
   * @param {Event} e - input on.change
   */
  styleChange(e) {
    if (this.feature) {
      this.currentColor = document.querySelector('#colorSelector').value;
      this.currentThickness = document.querySelector('#thicknessSelector').value;

      switch (this.feature.getGeometry().type) {
        case 'Point':
        case 'MultiPoint':
          const newPointStyle = {
            radius: this.currentThickness,
            fill: {
              color: this.currentColor,
            },
            stroke: {
              color: 'white',
              width: 2,
            },
          };

          if (this.feature.getStyle().getOptions().label !== undefined) {
            newPointStyle.label = this.feature.getStyle().getOptions().label;
          }

          if (this.feature !== undefined) {
            this.feature.setStyle(new M.style.Point(newPointStyle));
            this.style = this.feature.getStyle();
          }
          break;
        case 'LineString':
        case 'MultiLineString':
          const newLineStyle = new M.style.Line({
            stroke: {
              color: this.currentColor,
              width: this.currentThickness,
              linedash: this.currentLineDash,
            },
          });
          if (this.feature !== undefined) {
            this.feature.setStyle(newLineStyle);
            this.style = this.feature.getStyle();
          }
          break;
        case 'Polygon':
        case 'MultiPolygon':
          const newPolygonStyle = new M.style.Polygon({
            fill: {
              color: this.currentColor,
              opacity: 0.2,
            },
            stroke: {
              color: this.currentColor,
              width: this.currentThickness,
            },
          });
          if (this.feature !== undefined) {
            this.feature.setStyle(newPolygonStyle);
            this.style = this.feature.getStyle();
          }
          break;
        default:
          break;
      }
    } else if (document.querySelector('#colorSelector') !== null) {
      this.currentColor = document.querySelector('#colorSelector').value;
      this.currentThickness = document.querySelector('#thicknessSelector').value;
    }
  }

  /**
   * Sets style for a point, line or polygon feature
   * @public
   * @function
   * @api
   * @param {*} feature
   * @param {*} geometryType - Point / LineString / Polygon
   */
  setFeatureStyle(feature, geometryType) {
    switch (geometryType) {
      case 'Point':
      case 'MultiPoint':
        feature.setStyle(new M.style.Point({
          radius: this.currentThickness,
          fill: {
            color: this.currentColor,
          },
          stroke: {
            color: 'white',
            width: 2,
          },
        }));
        break;
      case 'LineString':
      case 'MultiLineString':
        feature.setStyle(new M.style.Line({
          stroke: {
            color: this.currentColor,
            width: this.currentThickness,
            linedash: this.currentLineDash,
          },
        }));
        break;
      case 'Polygon':
      case 'MultiPolygon':
        feature.setStyle(new M.style.Polygon({
          fill: {
            color: this.currentColor,
            opacity: 0.2,
          },
          stroke: {
            color: this.currentColor,
            width: Number.parseInt(this.currentThickness, 10),
          },
        }));
        break;
      default:
        throw new Error(getValue('exception.unknown_geom'));
    }
  }


  /**
     * Lanza el proceso de notificación por e-mail
     * @public
     * @function
     * @api
     */
  openNotifyOptions(layer) {

    const geojsonLayer = this.toGeoJSON(layer);
    let arrayContent;

    arrayContent = JSON.stringify(geojsonLayer);

    if (geojsonLayer.features.length > 0){
      this.geometryIncidence = arrayContent;
      this.geometryIncidenceJSON = geojsonLayer;
      if (this.interfazmode==="simple"){
        this.activateModalSimple();
      }else{
        this.getCentroid4INCIGEO(geojsonLayer);
        this.activateModalAdvanced();
      }
    }else{
      M.dialog.error("No hay geometrías trazadas en la incidencia");
    }
  }

  /**
   * Lanza el proceso de notificación por e-mail preguntando formatos y permitiendo elegir el tipo de notificación: simple o compleja
   * @public
   * @function
   * @api
   */
   openNotifyOptionsTemplate(layer) {
    const selector = `.m-incicarto #m-incicarto-list li[name="${layer.name}"] .m-incicarto-layer-actions-container`;
    if (this.isDownloadActive) {
      document.querySelector(selector).innerHTML = '';
      this.isDownloadActive = false;
    } else {
      const html = M.template.compileSync(downloadingTemplate, {
        jsonp: true,
        vars: {
          translations: {
            //download: getValue('download'),
            simpleText: 'Incidencia Simple',
            complexText: 'Incidencia Compleja',
          },
        },
      });
      document.querySelector(selector).appendChild(html);
      //html.querySelector('button').addEventListener('click', this.downloadLayer.bind(this, layer));
      html.querySelector('#sendSimpleInci').addEventListener('click', this.sendLayerSimpleIncidence.bind(this, layer));
      html.querySelector('#sendComplexInci').addEventListener('click', this.sendLayerComplexIncidence.bind(this, layer));
      html.querySelector('#sendSimpleInci').style.display = 'block';
      html.querySelector('#sendComplexInci').style.display = 'block';
      this.isDownloadActive = true;
    }
  }

  


  /**
   * Opens upload template
   * @public
   * @function
   * @api
   */
  openUploadOptions() {
    if (document.querySelector('#incicarto-uploading') !== null) {
      document.querySelector('.m-incicarto-general-container').innerHTML = '';
    } else {
      document.querySelector('.m-incicarto-general-container').appendChild(this.uploadingTemplate);
    }
  }

  /**
   * Parses geojsonLayer removing last item on every coordinate (NaN)
   * before converting the layer to kml.
   * @public
   * @function
   * @api
   * @param {*} geojsonLayer - geojson layer with drawn features
   */
  fixGeojsonKmlBug(geojsonLayer) {
    const newGeojsonLayer = geojsonLayer;
    const features = newGeojsonLayer.features;
    features.forEach((feature) => {
      switch (feature.geometry.type) {
        case 'Point':
          if (Number.isNaN(feature.geometry.coordinates[feature.geometry.coordinates.length - 1])) {
            feature.geometry.coordinates.pop();
          }
          break;
        case 'LineString':
          if (Number
            .isNaN(feature.geometry.coordinates[0][feature.geometry.coordinates[0].length - 1])) {
            feature.geometry.coordinates.map((line) => { return line.pop(); });
          }
          break;
        case 'Poylgon':
        case 'MultiPolygon':
          feature.geometry.coordinates.forEach((coord) => {
            if (feature.geometry.type === 'Polygon' &&
              Number.isNaN(coord[0][coord[0].length - 1])) {
              coord.map((c) => {
                c.pop();
                return c;
              });
            } else if (feature.geometry.type === 'MultiPolygon' &&
              Number.isNaN(coord[0][0][coord[0][0].length - 1])) {
              coord.forEach((coordsArray) => {
                coordsArray.map((c) => {
                  c.pop();
                  return c;
                });
              });
            }
          });
          break;
        default:
      }
    });

    newGeojsonLayer.features = features;
    return newGeojsonLayer;
  }

  /**
   * Parses geojson before shp download.
   * Changes geometry type to simple when necessary and removes one pair of brackets.
   * @public
   * @function
   * @api
   * @param {*} geojsonLayer - geojson layer with drawn and uploaded features
   */
  parseGeojsonForShp(geojsonLayer) {
    const newGeoJson = geojsonLayer;
    const newFeatures = [];

    geojsonLayer.features.forEach((originalFeature) => {
      const featureType = originalFeature.geometry.type;

      if (featureType.match(/^Multi/)) {
        const features = originalFeature.geometry.coordinates
          .map((simpleFeatureCoordinates, idx) => {
            const newFeature = {
              type: 'Feature',
              id: `${originalFeature.id}${idx}`,
              geometry: {
                type: '',
                coordinates: simpleFeatureCoordinates,
              },
              properties: {},
            };
            switch (featureType) {
              case 'MultiPoint':
                newFeature.geometry.type = 'Point';
                break;
              case 'MultiLineString':
                newFeature.geometry.type = 'LineString';
                break;
              case 'MultiPolygon':
                newFeature.geometry.type = 'Polygon';
                break;
              default:
            }
            return newFeature;
          });
        newFeatures.push(...features);
      } else {
        newFeatures.push(originalFeature);
      }
    });

    newGeoJson.features = newFeatures;
    for (let i = 0; i < newGeoJson.features.length; i += 1) {
      delete newGeoJson.features[i].id;
    }
    return newGeoJson;
  }

  /**
   * Creates vector layer copy of __draw__ layer excluding text features.
   * @public
   * @function
   * @api
   * @returns {M.layer.Vector}
   */
  toGeoJSON(layer) {
    const code = this.map.getProjection().code;
    const featuresAsJSON = layer.getFeatures().map(feature => feature.getGeoJSON());
    return { type: 'FeatureCollection', features: this.geojsonTo4326(featuresAsJSON, code) };
  }

  /**
   * Downloads selected layer as GeoJSON, kml, gpx or shp.
   * @public
   * @function
   * @api
   */
  downloadLayer(layer) {
    const fileName = layer.legend || layer.name;
    const selector = `.m-incicarto #m-incicarto-list li[name="${layer.name}"] .m-incicarto-layer-actions-container`;
    const downloadFormat = document.querySelector(selector).querySelector('select').value;
    const geojsonLayer = this.toGeoJSON(layer);
    let arrayContent;
    let mimeType;
    let extensionFormat;

    switch (downloadFormat) {
      case 'geojson':
        arrayContent = JSON.stringify(geojsonLayer);
        mimeType = 'json';
        extensionFormat = 'geojson';
        break;
      case 'kml':
        const fixedGeojsonLayer = this.fixGeojsonKmlBug(geojsonLayer);
        arrayContent = tokml(fixedGeojsonLayer);
        mimeType = 'xml';
        extensionFormat = 'kml';
        break;
      case 'gpx':
        arrayContent = togpx(geojsonLayer);
        mimeType = 'xml';
        extensionFormat = 'gpx';
        break;
      case 'shp':
        const json = this.parseGeojsonForShp(geojsonLayer);
        const options = {
          folder: fileName,
          types: {
            point: 'points',
            polygon: 'polygons',
            line: 'lines',
          },
        };
        shpWrite.download(json, options);
        break;
      default:
        M.dialog.error(getValue('exception.format_not_selected'));
        break;
    }
    console.log(arrayContent);

    if (downloadFormat !== 'shp') {
      const url = window.URL.createObjectURL(new window.Blob([arrayContent], {
        type: `application/${mimeType}`,
      }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${fileName}.${extensionFormat}`);
      document.body.appendChild(link);
      link.click();
    }

    document.querySelector(selector).innerHTML = '';
  }

  /**
   * Downloads selected layer as GeoJSON, kml, gpx or shp.
   * @public
   * @function
   * @api
   */
   sendLayerSimpleIncidence(layer) {
    const fileName = layer.legend || layer.name;
    const selector = `.m-incicarto #m-incicarto-list li[name="${layer.name}"] .m-incicarto-layer-actions-container`;
    const downloadFormat = document.querySelector(selector).querySelector('select').value;
    const geojsonLayer = this.toGeoJSON(layer);
    let arrayContent;
    let mimeType;
    let extensionFormat;

    switch (downloadFormat) {
      case 'geojson':
        arrayContent = JSON.stringify(geojsonLayer);
        mimeType = 'json';
        extensionFormat = 'geojson';
        break;
      case 'kml':
        const fixedGeojsonLayer = this.fixGeojsonKmlBug(geojsonLayer);
        arrayContent = tokml(fixedGeojsonLayer);
        mimeType = 'xml';
        extensionFormat = 'kml';
        break;
      case 'gpx':
        arrayContent = togpx(geojsonLayer);
        mimeType = 'xml';
        extensionFormat = 'gpx';
        break;
      case 'shp':
        const json = this.parseGeojsonForShp(geojsonLayer);
        const options = {
          folder: fileName,
          types: {
            point: 'points',
            polygon: 'polygons',
            line: 'lines',
          },
        };
        shpWrite.download(json, options);
        break;
      default:
        M.dialog.error(getValue('exception.format_not_selected'));
        break;
    }

   
    if (geojsonLayer.features.length > 0){
      this.geometryIncidence = arrayContent;
      this.geometryIncidenceJSON = geojsonLayer;
      this.getCentroid4INCIGEO(geojsonLayer);
      this.activateModalSimple();
    }else{
      M.dialog.error("No hay geometrías trazadas en la incidencia");
    }

    document.querySelector(selector).innerHTML = '';
  }

  /**
   * Downloads selected layer as GeoJSON, kml, gpx or shp.
   * @public
   * @function
   * @api
   */
   sendLayerComplexIncidence(layer) {
    const fileName = layer.legend || layer.name;
    const selector = `.m-incicarto #m-incicarto-list li[name="${layer.name}"] .m-incicarto-layer-actions-container`;
    const downloadFormat = document.querySelector(selector).querySelector('select').value;
    const geojsonLayer = this.toGeoJSON(layer);
    let arrayContent;
    let mimeType;
    let extensionFormat;

    switch (downloadFormat) {
      case 'geojson':
        arrayContent = JSON.stringify(geojsonLayer);
        mimeType = 'json';
        extensionFormat = 'geojson';
        break;
      case 'kml':
        const fixedGeojsonLayer = this.fixGeojsonKmlBug(geojsonLayer);
        arrayContent = tokml(fixedGeojsonLayer);
        mimeType = 'xml';
        extensionFormat = 'kml';
        break;
      case 'gpx':
        arrayContent = togpx(geojsonLayer);
        mimeType = 'xml';
        extensionFormat = 'gpx';
        break;
      case 'shp':
        const json = this.parseGeojsonForShp(geojsonLayer);
        const options = {
          folder: fileName,
          types: {
            point: 'points',
            polygon: 'polygons',
            line: 'lines',
          },
        };
        shpWrite.download(json, options);
        break;
      default:
        M.dialog.error(getValue('exception.format_not_selected'));
        break;
    }


    if (geojsonLayer.features.length > 0){
      this.geometryIncidence = arrayContent;
      this.getCentroid4INCIGEO(geojsonLayer);
      this.activateModalAdvanced();
    }else{
      M.dialog.error("No hay geometrías trazadas en la incidencia");
    }

    document.querySelector(selector).innerHTML = '';
  }

  getCentroid4INCIGEO(geojsonLayer) {

    if (geojsonLayer.features.length > 0) {
      //layer.getFeatures().map(feature => {
      //  console.log(feature.getGeoJSON());
      //});
      console.log(JSON.stringify(geojsonLayer));
      console.log(geojsonLayer.features[0].geometry.coordinates); // Si es puntual esto es un array de 2
      console.log(geojsonLayer.features[0].geometry.coordinates[0]);  // Si es puntual esto deveulve la X
      console.log(geojsonLayer.features[0].geometry.coordinates.length);

      if (geojsonLayer.features[0].geometry.coordinates.length === 2) {
        // Punto 2D
        this.geometryIncidenceX = geojsonLayer.features[0].geometry.coordinates[0];
        this.geometryIncidenceY = geojsonLayer.features[0].geometry.coordinates[1];
       }else if (geojsonLayer.features[0].geometry.coordinates.length === 3) {
        // Punto 3D
        this.geometryIncidenceX = geojsonLayer.features[0].geometry.coordinates[0];
        this.geometryIncidenceY = geojsonLayer.features[0].geometry.coordinates[1];
      } else {
        if (geojsonLayer.features[0].geometry.coordinates[0].length===2){
            // Línea
            this.geometryIncidenceX = geojsonLayer.features[0].geometry.coordinates[0][0];
            this.geometryIncidenceY = geojsonLayer.features[0].geometry.coordinates[0][1];
        }else{
          // Polígono
            this.geometryIncidenceX = geojsonLayer.features[0].geometry.coordinates[0][0][0];
            this.geometryIncidenceY = geojsonLayer.features[0].geometry.coordinates[0][0][1];
        }
      }
      console.log(`X:${this.geometryIncidenceX}`);
      console.log(`Y:${this.geometryIncidenceY}`);

    }

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
    return control instanceof IncicartoControl;
  }

  /* Layer upload */

  /**
   * Changes selected file.
   * @public
   * @function
   * @api
   * @param {Event} evt - file input change event
   * @param {File} file - selected file on file input
   */
  changeFile(evt, file) {
    this.file_ = file;
    if (!M.utils.isNullOrEmpty(file)) {
      if (file.size > 20971520) {
        M.dialog.info(getValue('exception.size'));
        this.file_ = null;
      } else {
        this.loadLayer();
      }
    }
  }

  /**
   * Loads vector layer on map.
   * @public
   * @function
   * @api
   */
  loadLayer() {
    // eslint-disable-next-line no-bitwise
    const fileExt = this.file_.name.slice((this.file_.name.lastIndexOf('.') - 1 >>> 0) + 2).toLowerCase();
    const fileName = this.file_.name.split('.').slice(0, -1).join('.');
    const fileReader = new window.FileReader();
    fileReader.addEventListener('load', (e) => {
      try {
        let features = [];
        if (fileExt === 'zip') {
          // In case of shp group, this unites features
          const geojsonArray = [].concat(shp.parseZip(fileReader.result));
          features = this.getImpl().loadAllInGeoJSONLayer(geojsonArray, fileName);
        } else if (fileExt === 'kml') {
          features = this.getImpl().loadKMLLayer(fileReader.result, fileName, false);
        } else if (fileExt === 'gpx') {
          features = this.getImpl().loadGPXLayer(fileReader.result, fileName);
        } else if (fileExt === 'geojson') {
          features = this.getImpl().loadGeoJSONLayer(fileReader.result, fileName);
        } else if (fileExt === 'gml') {
          features = this.getImpl().loadGMLLayer(fileReader.result, fileName);
        } else {
          M.dialog.error(getValue('exception.load'));
          return;
        }

        if (features.length === 0) {
          M.dialog.info(getValue('exception.no_geoms'));
        } else {
          this.getImpl().centerFeatures(features, fileExt === 'gpx');
        }
      } catch (error) {
        M.dialog.error(getValue('exception.load_correct'));
      }
    });

    if (fileExt === 'zip') {
      fileReader.readAsArrayBuffer(this.file_);
    } else if (fileExt === 'kml' || fileExt === 'gpx' || fileExt === 'geojson' || fileExt === 'gml') {
      fileReader.readAsText(this.file_);
    } else {
      M.dialog.error(getValue('exception.extension'));
    }
  }

  /**
   * Creates GeoJSON feature from a previous feature and a new set of coordinates.
   * @public
   * @function
   * @api
   * @param {GeoJSON Feature} previousFeature
   * @param {Array} coordinates
   */
  createGeoJSONFeature(previousFeature, coordinates) {
    return {
      ...previousFeature,
      geometry: {
        type: previousFeature.geometry.type,
        coordinates,
      },
    };
  }

  /**
   * Converts features coordinates on geojson format to 4326.
   * @public
   * @function
   */
  geojsonTo4326(featuresAsJSON, codeProjection) {
    const jsonResult = [];
    featuresAsJSON.forEach((featureAsJSON) => {
      const coordinates = featureAsJSON.geometry.coordinates;
      let newCoordinates = [];
      switch (featureAsJSON.geometry.type) {
        case 'Point':
          newCoordinates = this.getImpl().getTransformedCoordinates(codeProjection, coordinates);
          break;
        case 'MultiPoint':
          for (let i = 0; i < coordinates.length; i += 1) {
            const newDot = this
              .getImpl().getTransformedCoordinates(codeProjection, coordinates[i]);
            newCoordinates.push(newDot);
          }
          break;
        case 'LineString':
          for (let i = 0; i < coordinates.length; i += 1) {
            const newDot = this.getImpl().getTransformedCoordinates(
              codeProjection,
              coordinates[i],
            );
            newCoordinates.push(newDot);
          }
          break;
        case 'MultiLineString':
          for (let i = 0; i < coordinates.length; i += 1) {
            const newLine = [];
            for (let j = 0; j < coordinates[i].length; j += 1) {
              const newDot = this
                .getImpl().getTransformedCoordinates(codeProjection, coordinates[i][j]);
              newLine.push(newDot);
            }
            newCoordinates.push(newLine);
          }
          break;
        case 'Polygon':
          for (let i = 0; i < coordinates.length; i += 1) {
            const newPoly = [];
            for (let j = 0; j < coordinates[i].length; j += 1) {
              const newDot = this
                .getImpl().getTransformedCoordinates(codeProjection, coordinates[i][j]);
              newPoly.push(newDot);
            }
            newCoordinates.push(newPoly);
          }
          break;
        case 'MultiPolygon':
          for (let i = 0; i < coordinates.length; i += 1) {
            const newPolygon = [];
            for (let j = 0; j < coordinates[i].length; j += 1) {
              const newPolygonLine = [];
              for (let k = 0; k < coordinates[i][j].length; k += 1) {
                const newDot = this
                  .getImpl().getTransformedCoordinates(codeProjection, coordinates[i][j][k]);
                newPolygonLine.push(newDot);
              }
              newPolygon.push(newPolygonLine);
            }
            newCoordinates.push(newPolygon);
          }
          break;
        default:
      }
      const jsonFeature = this.createGeoJSONFeature(featureAsJSON, newCoordinates);
      jsonResult.push(jsonFeature);
    });
    return jsonResult;
  }

  /**
   * Modifies drawing tools, updates inputs, emphasizes selection
   * and shows feature info on select.
   * @public
   * @function
   * @api
   * @param {Event}
   */
  onSelect(e) {
    if (this.style !== undefined && this.feature !== undefined) {
      this.feature.setStyle(this.style);
    }
    this.style = undefined;
    const MFeatures = this.drawLayer.getFeatures();
    const olFeature = e.target.getFeatures().getArray()[0];
    this.feature = MFeatures.filter(f => f.getImpl().getOLFeature() === olFeature)[0] || undefined;
    this.geometry = this.feature.getGeometry().type;
    const selector = `#m-incicarto-list li[name="${this.drawLayer.name}"] div.m-incicarto-layer-actions-container`;
    document.querySelector(selector).appendChild(this.drawingTools);
    document.querySelector('div.m-incicarto-layer-actions-container #drawingtools button').style.display = 'block';
    if (document.querySelector('.ol-profil.ol-unselectable.ol-control') !== null) {
      document.querySelector('.ol-profil.ol-unselectable.ol-control').remove();
    }

    this.emphasizeSelectedFeature();
    this.showFeatureInfo();
  }

  /**
   * Emphasizes selection and shows feature info after feature is modified.
   * @public
   * @function
   * @api
   */
  onModify() {
    this.emphasizeSelectedFeature();
    this.showFeatureInfo();
    if (document.querySelector('.ol-profil.ol-unselectable.ol-control') !== null) {
      document.querySelector('.ol-profil.ol-unselectable.ol-control').remove();
    }
  }

  /**
   * Controls clicks events of each layer
   * @public
   * @function
   * @api stable
   */
  clickLayer(evtParameter) {
    const evt = (evtParameter || window.event);
    const layerName = evt.target.getAttribute('data-layer-name');
    const layerURL = evt.target.getAttribute('data-layer-url');
    let render = false;
    if (!M.utils.isNullOrEmpty(layerName)) {
      evt.stopPropagation();
      const layer = this.map.getLayers().filter(l => l.name === layerName && (l.url === layerURL || layerURL === ''))[0];
      if (evt.target.classList.contains('m-incicarto-layer-legend-change')) {
        const changeName = M.template.compileSync(changeNameTemplate, {
          jsonp: true,
          parseToHtml: false,
          vars: {
            name: layer.legend || layer.name,
            translations: {
              change: getValue('change'),
            },
          },
        });

        M.dialog.info(changeName, getValue('change_name'));
        setTimeout(() => {
          const selector = 'div.m-mapea-container div.m-dialog #m-layer-change-name button';
          document.querySelector(selector).addEventListener('click', this.changeLayerLegend.bind(this, layer));
          document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
          const button = document.querySelector('div.m-dialog.info div.m-button > button');
          button.innerHTML = getValue('close');
          button.style.width = '75px';
          button.style.backgroundColor = '#71a7d3';
        }, 10);
      } else if (evt.target.classList.contains('m-incicarto-layer-add')) {
        this.isDownloadActive = false;
        this.openDrawOptions(layer);
      } else if (evt.target.classList.contains('m-incicarto-layer-edit')) {
        this.isDownloadActive = false;
        this.openEditOptions(layer);
      } else if (evt.target.classList.contains('m-incicarto-layer-zoom')) {
        this.isDownloadActive = false;
        this.resetInteractions();
        if (layer.type === 'WFS' || (layer.type === 'Vector' && layer.getFeatures().length > 0)) {
          const extent = layer.getMaxExtent();
          this.map.setBbox(extent);
        } else if (layer.type === 'KML') {
          const extent = layer.getImpl().getExtent();
          this.map.setBbox(extent);
        } else if (layer.type === 'GeoJSON') {
          const extent = this.getImpl().getGeoJSONExtent(layer);
          this.map.setBbox(extent);
        } else {
          M.dialog.info(getValue('exception.not_extent'), getValue('info'));
        }
      } else if (evt.target.classList.contains('m-incicarto-layer-reload')) {
        this.getImpl().reloadFeaturesUpdatables(layer.name, layer.url);
      } else if (evt.target.classList.contains('m-incicarto-layer-toogle')) {
        this.isDownloadActive = false;
        this.resetInteractions();
        layer.setVisible(!layer.visible);
        layer.visible = !layer.visible;
        render = true;
      } else if (evt.target.classList.contains('m-incicarto-layer-download')) {
        this.resetInteractions();
        if (this.interfazmode==="both"){
          this.openNotifyOptionsTemplate(layer);
        }else{
          this.openNotifyOptions(layer);
        }
      } else if (evt.target.classList.contains('m-incicarto-layer-delete')) {
        this.isDownloadActive = false;
        this.resetInteractions();
        this.map.removeLayers(layer);
        render = true;
      }
    }

    if (render) {
      this.renderLayers();
    }
  }

  resetInteractions() {
    this.deactivateDrawing();
    this.deactivateSelection();
    this.isDrawingActive = false;
    this.isEditionActive = false;
    this.drawLayer = undefined;
  }

  changeLayerLegend(layer) {
    const selector = 'div.m-mapea-container div.m-dialog #m-layer-change-name input';
    const newValue = document.querySelector(selector).value.trim();
    if (newValue.length > 0) {
      layer.setLegend(newValue);
      this.renderLayers();
      document.querySelector('div.m-mapea-container div.m-dialog').remove();
    }
  }

  invokeEscKey() {
    try {
      document.dispatchEvent(new window.KeyboardEvent('keyup', {
        key: 'Escape',
        keyCode: 27,
        code: '',
        which: 69,
        shiftKey: false,
        ctrlKey: false,
        metaKey: false,
      }));
    } catch (err) {
      /* eslint-disable no-console */
      console.error(err);
    }
  }

  openDrawOptions(layer) {

    this.isEditionActive = false;
    this.deactivateSelection();
    this.deactivateDrawing();
    if (document.querySelector('.ol-profil.ol-unselectable.ol-control') !== null) {
      document.querySelector('.ol-profil.ol-unselectable.ol-control').remove();
    }
    
    const cond = this.drawLayer !== undefined && layer.name !== this.drawLayer.name;
    if (cond || !this.isDrawingActive) {
      
      this.invokeEscKey();
      this.drawLayer = layer;
      this.isDrawingActive = true;
      console.log(this.drawingTools);
      this.drawingTools.querySelector('button.m-incicarto-layer-profile').style.display = 'none';
      this.drawingTools.querySelector('button.m-incicarto-layer-delete-feature').style.display = 'none';
      const selector = `#m-incicarto-list li[name="${layer.name}"] div.m-incicarto-layer-actions-container`;
      const selector2 = `#m-incicarto-list li[name="${layer.name}"] div.m-incicarto-layer-actions .m-incicarto-layer-add`;
      document.querySelector(selector).appendChild(this.drawingTools);
      document.querySelector(selector2).classList.add('active-tool');
      this.getImpl().addDrawInteraction(layer);
      if (document.querySelector('#drawingtools #featureInfo') !== null) {
        document.querySelector('#drawingtools #featureInfo').style.display = 'none';
      }

      const elem = document.querySelector('#drawingtools .drawingToolsContainer');
      if (elem.style.display === 'none') {
        const cond2 = this.drawLayer.getGeometryType() !== null && this.drawLayer.getGeometryType().toLowerCase() === 'linestring';
        if (cond2 || (this.drawLayer.geometry !== undefined && this.drawLayer.geometry !== '' && this.drawLayer.geometry.toLowerCase() === 'linestring')) {
          document.querySelector('#drawingtools .collapsor').innerHTML = `${getValue('symbology_profile')}&nbsp;&nbsp;<span class="icon-show"></span>`;
        } else {
          document.querySelector('#drawingtools .collapsor').innerHTML = `${getValue('symbology')}&nbsp;&nbsp;<span class="icon-show"></span>`;
        }
      }
    } else {
      this.isDrawingActive = false;
      this.drawLayer = undefined;
    }
  }

  openEditOptions(layer) {
    this.isDrawingActive = false;
    this.deactivateSelection();
    this.deactivateDrawing();
    if (document.querySelector('.ol-profil.ol-unselectable.ol-control') !== null) {
      document.querySelector('.ol-profil.ol-unselectable.ol-control').remove();
    }

    const cond = this.drawLayer !== undefined && layer.name !== this.drawLayer.name;
    if (cond || !this.isEditionActive) {
      this.invokeEscKey();
      if (layer.getFeatures().length > 0) {
        this.drawLayer = layer;
        this.isEditionActive = true;
        this.getImpl().activateSelection(layer);
        const selector = `#m-incicarto-list li[name="${layer.name}"] div.m-incicarto-layer-actions .m-incicarto-layer-edit`;
        document.querySelector(selector).classList.add('active-tool');
      } else {
        M.dialog.error(getValue('exception.no_features'), getValue('warning'));
      }
    } else {
      this.isEditionActive = false;
      this.drawLayer = undefined;
    }
  }

  /**
   * Checks if any drawing button is active and deactivates it,
   * deleting drawing interaction.
   * @public
   * @function
   * @api
   */
  deactivateDrawing() {
    const selector = '.m-incicarto #m-incicarto-list div.m-incicarto-layer-actions-container';
    const selector2 = '#m-incicarto-list div.m-incicarto-layer-actions span';
    document.querySelectorAll(selector).forEach((elem) => {
      /* eslint-disable no-param-reassign */
      elem.innerHTML = '';
    });

    document.querySelectorAll(selector2).forEach((elem) => {
      /* eslint-disable no-param-reassign */
      elem.classList.remove('active-tool');
    });

    this.feature = undefined;
    this.emphasizeSelectedFeature();
    this.getImpl().removeDrawInteraction();
  }

  /**
   * Deletes selected geometry.
   * @public
   * @function
   * @api
   */
  deleteSingleFeature() {
    this.drawLayer.removeFeatures([this.feature]);
    this.feature = undefined;
    this.geometry = undefined;
    this.selectionLayer.removeFeatures([this.emphasis]);
    if (this.isEditionActive) {
      this.isEditionActive = false;
      this.openEditOptions(this.drawLayer);
    }
  }

  /**
   * After draw interaction event is over,
   * updates feature style, inputs, adds feature to draw layer,
   * shows feature info and emphasizes it.
   * @public
   * @function
   * @api
   * @param {Event} event - 'drawend' triggering event
   */
  onDraw(event) {
    this.feature = event.feature;
    this.feature.setId(`${this.drawLayer.name}.${new Date().getTime()}`);
    this.feature = M.impl.Feature.olFeature2Facade(this.feature);
    this.geometry = this.feature.getGeometry().type;
    this.setFeatureStyle(this.feature, this.geometry);
    document.querySelector('.m-incicarto #drawingtools button').style.display = 'block';
    this.drawLayer.addFeatures(this.feature);
    this.emphasizeSelectedFeature();
    this.showFeatureInfo();
    this.getImpl().calculateElevations(this.feature);
  }

  /**
   * Clears selection layer.
   * Draws square around feature and adds it to selection layer.
   * For points:
   *    If feature doesn't have style, sets new style.
   * @public
   * @function
   * @api
   */
  emphasizeSelectedFeature() {
    this.emphasis = null;
    this.selectionLayer.removeFeatures(this.selectionLayer.getFeatures());

    if (this.feature) {
      if ((this.geometry === 'Point' || this.geometry === 'MultiPoint')) {
        this.emphasis = this.getImpl().getMapeaFeatureClone();
        this.emphasis.setStyle(new M.style.Point({
          radius: 20,
          stroke: {
            color: '#FF0000',
            width: 2,
          },
        }));
      } else {
        // eslint-disable-next-line no-underscore-dangle
        const extent = this.getImpl().getFeatureExtent();
        this.emphasis = M.impl.Feature.olFeature2Facade(this.getImpl().newPolygonFeature(extent));
        this.emphasis.setStyle(new M.style.Line({
          stroke: {
            color: '#FF0000',
            width: 2,
          },
        }));
      }
      this.selectionLayer.addFeatures([this.emphasis]);
    }
  }

  /**
   * On select, shows feature info.
   * @public
   * @function
   * @api
   */
  showFeatureInfo() {
    const infoContainer = document.querySelector('#drawingtools #featureInfo');
    document.querySelector('#drawingtools button.m-incicarto-layer-profile').style.display = 'none';
    if (infoContainer !== null) {
      infoContainer.style.display = 'block';
      infoContainer.innerHTML = '';
    }

    switch (this.geometry) {
      case 'Point':
      case 'MultiPoint':
        const x = this.getImpl().getFeatureCoordinates()[0];
        const y = this.getImpl().getFeatureCoordinates()[1];
        if (infoContainer !== null) {
          document.querySelector('#drawingtools div.stroke-container').style.display = 'none';
          let html = `<table class="m-incicarto-results-table"><tbody><tr><td><b>${getValue('coordinates')}</b></td>`;
          html += `<td><b>X:</b> ${Math.round(x * 1000) / 1000}</td><td><b>Y:</b> ${Math.round(y * 1000) / 1000}</td>`;
          html += '</tr></tbody></table>';
          infoContainer.innerHTML = html;
          if (this.feature.getStyle() !== undefined && this.feature.getStyle() !== null) {
            const style = this.feature.getStyle().getOptions();
            this.currentColor = style.fill.color;
            document.querySelector('#colorSelector').value = style.fill.color;
            this.currentThickness = style.radius || 6;
            document.querySelector('#thicknessSelector').value = style.radius || 6;
          }
        }
        break;
      case 'LineString':
      case 'MultiLineString':
        const lineLength = this.getImpl().getFeatureLength();
        const m = formatNumber(lineLength);
        // const km = formatNumber(lineLength / 1000);
        if (infoContainer !== null) {
          document.querySelector('#drawingtools div.stroke-container').style.display = 'block';
          const id = `m-incicarto-3d-measure-${this.drawLayer.name.replaceAll(' ', '')}`;
          const attr = this.feature.getAttributes()['3dLength'];
          let html = `<table class="m-incicarto-results-table"><tbody><tr><td><b>${getValue('length')}</b></td>`;
          if (attr !== undefined && attr.length > 0) {
            html += `<td><b>2D: </b>${m}m</td><td><b>3D: </b><span>${attr}m</span></td>`;
          } else {
            html += `<td><b>2D: </b>${m}m</td><td><b>3D: </b><span class="m-incicarto-3d-measure" id="${id}">${getValue('calculate')}</span></td>`;
          }

          html += '</tr></tbody></table>';
          infoContainer.innerHTML = html;
          if (this.feature.getStyle() !== undefined && this.feature.getStyle() !== null) {
            const stroke = this.feature.getStyle().getOptions().stroke;
            this.currentColor = stroke.color;
            document.querySelector('#colorSelector').value = stroke.color;
            this.currentThickness = stroke.width || 6;
            document.querySelector('#thicknessSelector').value = stroke.width || 6;
            this.currentLineDash = stroke.linedash;
            const selector = this.drawingTools.querySelector('div.stroke-options');
            selector.querySelectorAll('div').forEach((elem) => {
              elem.classList.remove('active');
            });

            if (stroke.linedash !== undefined && stroke.linedash.length > 2) {
              selector.querySelector('div.stroke-dots-lines').classList.add('active');
            } else if (stroke.linedash !== undefined && stroke.linedash[0] > 2) {
              selector.querySelector('div.stroke-lines').classList.add('active');
            } else if (stroke.linedash !== undefined && stroke.linedash[0] < 2) {
              selector.querySelector('div.stroke-dots').classList.add('active');
            } else {
              selector.querySelector('div.stroke-continuous').classList.add('active');
            }
          }

          if (this.geometry === 'LineString') {
            document.querySelector('#drawingtools button.m-incicarto-layer-profile').style.display = 'block';
            const elem = document.getElementById(id);
            if (elem !== null) {
              elem.addEventListener('click', () => {
                elem.classList.remove('m-incicarto-3d-measure');
                elem.innerHTML = getValue('calculating');
                this.getImpl().get3DLength(id);
              });
            }
          }
        }
        break;
      case 'Polygon':
      case 'MultiPolygon':
        const area = this.getImpl().getFeatureArea();
        const m2 = formatNumber(area);
        const km2 = formatNumber(area / 1000000);
        // const ha = formatNumber(area / 10000);
        if (infoContainer !== null) {
          document.querySelector('#drawingtools div.stroke-container').style.display = 'none';
          let html = `<table class="m-incicarto-results-table"><tbody><tr><td><b>${getValue('area')}</b></td>`;
          html += `<td>${m2}m${'2'.sup()}</td><td>${km2}km${'2'.sup()}</td>`;
          html += '</tbody></table>';
          infoContainer.innerHTML = html;
          if (this.feature.getStyle() !== undefined && this.feature.getStyle() !== null) {
            const style = this.feature.getStyle().getOptions();
            this.currentColor = style.fill.color;
            document.querySelector('#colorSelector').value = style.fill.color;
            this.currentThickness = style.stroke.width || 6;
            document.querySelector('#thicknessSelector').value = style.stroke.width || 6;
          }
        }
        break;
      default:
        if (document.querySelector('#drawingtools #featureInfo') !== null) {
          document.querySelector('#drawingtools div.stroke-container').style.display = 'none';
          document.querySelector('#drawingtools #featureInfo').style.display = 'none';
        }
        break;
    }
  }

  /**
   * Deactivates selection mode.
   * @public
   * @function
   * @api
   */
  deactivateSelection() {
    const selector = '.m-incicarto #m-incicarto-list div.m-incicarto-layer-actions-container';
    const selector2 = '#m-incicarto-list div.m-incicarto-layer-actions span';
    document.querySelectorAll(selector).forEach((elem) => {
      /* eslint-disable no-param-reassign */
      elem.innerHTML = '';
    });

    document.querySelectorAll(selector2).forEach((elem) => {
      /* eslint-disable no-param-reassign */
      elem.classList.remove('active-tool');
    });
    this.getImpl().removeSelectInteraction();

    if (this.style !== undefined && this.feature !== undefined) {
      this.feature.setStyle(this.style);
    }
    this.style = undefined;
    this.feature = undefined;
    this.geometry = undefined;
    this.emphasizeSelectedFeature();
    this.getImpl().removeEditInteraction();
  }

  getProfile() {
    if (document.querySelector('.ol-profil.ol-unselectable.ol-control') !== null) {
      document.querySelector('.ol-profil.ol-unselectable.ol-control').remove();
    }

    this.getImpl().calculateProfile(this.feature);
    this.drawingTools.querySelector('.collapsor').click();
    const content = `<div class="m-incicarto-loading"><p>${getValue('generating_profile')}...</p><span class="icon-spinner" /></div>`;
    document.querySelector('.m-incicarto .m-incicarto-loading-container').innerHTML = content;
  }
}
