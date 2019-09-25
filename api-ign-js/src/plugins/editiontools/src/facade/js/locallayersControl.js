import * as shp from 'shpjs';
import LocalLayersImplControl from 'impl/locallayersControl';
import locallayershtml from '../../templates/locallayers.html';
import locallayersformhtml from '../../templates/locallayersform';

export default class LocalLayersControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(plugin) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(LocalLayersImplControl)) {
      M.exception('La implementación usada no puede crear controles LocalLayersControl');
    }
    // 2. implementation of this control
    const impl = new LocalLayersImplControl();
    super(impl, 'LocalLayers');
    this.plugin = plugin;
    this.centerview_ = true;
    this.file_ = null;
    this.inputName_ = null;
    this.loadBtn_ = null;
    this.inputCenter_ = null;
    this.inputStyle_ = null;
    this.extractstyleContainer_ = null;
    this.accept_ = '.kml, .zip, .gpx, .geojson';
  }

  /**
   *
   *
   * @param {any} html
   * @memberof LocalLayersControl
   */
  addEvents() {
    const inputFile = document.querySelector('.form div.file > input');
    const dialog = document.querySelector('.m-dialog');
    this.loadBtn_ = document.querySelector('button.load');
    this.inputName_ = document.querySelector('.form div.name > input');
    this.inputCenter_ = document.querySelector('.form div.centerview > input');
    this.inputStyle_ = document.querySelector('.form div.extractstyle > input');
    dialog.querySelector('div.m-title').style.backgroundColor = '#d5006e';
    dialog.querySelector('div.m-button>button').style.backgroundColor = '#d5006e';

    inputFile.addEventListener('change', evt => this.changeFile(evt, inputFile.files[0]));
    this.loadBtn_.addEventListener('click', evt => this.loadLayer());
    this.inputName_.addEventListener('input', evt => this.changeName(evt));
    this.loadBtn_.disabled = true;
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
    return M.template.compileSync(locallayershtml, { jsonp: true });
  }

  activate() {
    super.activate();
    this.addPanelMapea();
  }

  deactivate() {
    super.deactivate();
  }

  addPanelMapea() {
    M.dialog.info(locallayersformhtml, 'AÑADIR CAPA');
    this.addEvents();
  }
  /**
   * This function returns the HTML button
   *
   * @public
   * @function
   * @param {HTMLElement} element - HTML control
   * @return {HTMLElement} return HTML button
   * @api stable
   * @export
   */
  getActivationButton(element) {
    return element.querySelector('button#m-button-locallayers');
  }
  /**
   *
   *
   * @param {any} file
   * @memberof LocalLayersControl
   */
  changeFile(evt, file) {
    this.file_ = file;
    // Desactivo la escritura y vacio el nombre, además de desactivar el boton
    this.inputName_.value = '';
    this.inputName_.disabled = true;
    this.loadBtn_.disabled = true;
    if (!M.utils.isNullOrEmpty(file)) {
      if (file.size > 20971520) {
        M.dialog.info('El fichero seleccionado sobrepasa el máximo de 20 MB permitido');
        this.file_ = null;
      } else {
        // Elimino la extensión y la pongo como nombre de capa
        this.inputName_.value = file.name.replace(/\.[^/.]+$/, '');
        // Activo la escritura en el input y el boton de carga
        this.inputName_.disabled = false;
        this.loadBtn_.disabled = false;
      }
    }
  }

  /**
   *
   *
   * @param {any} evt
   * @memberof LocalLayersControl
   */
  changeName(ev) {
    const evt = (ev || window.event);
    const itemTarget = evt.target;
    this.loadBtn_.disabled = (itemTarget.value.trim() == '');
  }

  /**
   *
   *
   * @memberof LocalLayersControl
   */
  loadLayer() {
    if (this.inputName_.value !== '') {
      // Consigo la extensión del fichero
      const fileExt = this.file_.name.slice((this.file_.name.lastIndexOf('.') - 1 >>> 0) + 2);
      const fileReader = new FileReader();
      fileReader.addEventListener('load', (e) => {
        try {
          let features = [];
          if (fileExt === 'zip') {
            // Por si se trata de un conjunto de shapes, recojo el geojson en un array y junto las features
            const geojsonArray = [].concat(shp.parseZip(fileReader.result));
            geojsonArray.forEach((geojson) => {
              const localFeatures = this.getImpl().loadGeoJSONLayer(this.plugin.map_.getLayers().length, geojson);
              if (localFeatures) {
                features = features.concat(localFeatures);
              }
            });
          } else if (fileExt === 'kml') {
            // Si se pudiese hacer por url sin usar el proxy que machaca el blob
            /* let url = URL.createObjectURL(new Blob([fileReader.result], {
              type: 'text/plain'
            }));
            features = this.getImpl().loadKMLLayer(this.inputName_.value, url); */
            features = this.getImpl().loadKMLLayer(this.plugin.map_.getLayers().length, fileReader.result, false);
          } else if (fileExt === 'gpx') {
            features = this.getImpl().loadGPXLayer(this.plugin.map_.getLayers().length, fileReader.result);
          } else if (fileExt === 'geojson') {
            features = this.getImpl().loadGeoJSONLayer(this.plugin.map_.getLayers().length, fileReader.result);
          } else { // No debería entrar aquí nunca
            M.dialog.error('Error al cargar el fichero');
            return;
          }
          if (!features.length) {
            M.dialog.info('No se han detectado geometrías en este fichero');
          } else {
            this.getImpl().centerFeatures(features);
          }
        } catch (error) {
          M.dialog.error('Error al cargar el fichero. Compruebe que se trata del fichero correcto');
        }
      });
      if ((this.accept_.indexOf('.zip') > -1 && fileExt === 'zip')) {
        fileReader.readAsArrayBuffer(this.file_);
      } else if ((this.accept_.indexOf('.kml') > -1 && fileExt === 'kml') || (this.accept_.indexOf('.gpx') > -1 && fileExt === 'gpx') || (this.accept_.indexOf('.geojson') > -1 && fileExt === 'geojson')) {
        fileReader.readAsText(this.file_);
      } else {
        M.dialog.error('No se ha insertado una extensión de archivo permitida. Las permitidas son: ' + this.accept_);
      }
    } else {
      this.inputName_.style.border = '2px solid #ff0000';
    }
  }
  equals(obj) {
    const equals = (obj instanceof LocalLayersControl);
    return equals;
  }
}
