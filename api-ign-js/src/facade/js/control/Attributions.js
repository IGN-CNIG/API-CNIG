/**
 * @module M/control/Attributions
 */
import 'assets/css/controls/attributions';
import attributionsTemplate from 'templates/attributions';
import AttributionsImpl from 'impl/control/Attributions';
import ControlBase from './Control';
import { isUndefined } from '../util/Utils';
import Exception from '../exception/exception';
import { compileSync as compileTemplate } from '../util/Template';
import { getValue } from '../i18n/language';
import { INTERSECT } from '../filter/Module';
import { isNullOrEmpty } from '../util/Utils';
import Feature from '../feature/Feature';
import GeoJSON from '../layer/GeoJSON';
import KML from '../layer/KML';
// import * as EventType from '../event/eventtype';

const MODES = {
  mapAttributions: 1, // Map attributions from vector layer
  layerAttributions: 2, // Attributions layer from its capabilities wms service
  mixed: 3, // Mixed mode ( 1 + 2)
};

/**
 * @classdesc
 * Agregar atributiones.
 * [TO-DO]
 *
 * @api
 * @extends {M.Control}
 */
class Attributions extends ControlBase {
  /**
   * Constructor principal de la clase.
   *
   * @constructor
   * @param {Object} options Opciones del control.
   * [TO-DO]
   * @api
   */
  constructor(options = {}) {
    if (isUndefined(AttributionsImpl)) {
      Exception(getValue('exception').no_impl);
    }

    if (options.mode === MODES.mapAttributions && !isNullOrEmpty(options.url)) {
      if (isNullOrEmpty(options.type)) {
        // throw new Error(getValue('exception.type'));
        console.warn(getValue('exception.type'));
      }
    }

    if (options.mode === MODES.mapAttributions && !isNullOrEmpty(options.layerName)) {
      if (isNullOrEmpty(options.type)) {
        // throw new Error(getValue('exception.layerName'));
        console.warn(getValue('exception.layerName'));
      }
    }


    const impl = new AttributionsImpl();
    super(impl, Attributions.NAME);

    this.position = options.position;
    this.closePanel = options.closePanel; // TO-DO Eliminar
    this.mode_ = Number.parseInt(options.mode, 10) || 1; // TO-DO Probar
    this.url_ = options.url || 'https://componentes.cnig.es/api-core/files/attributions/WMTS_PNOA_20170220/atribucionPNOA_Url.kml';
    this.type_ = options.type || 'kml';
    this.layerName_ = options.layerName || 'attributions';
    this.layer_ = options.layer;
    this.scale_ = Number.parseInt(options.scale, 10) || 10000;
    this.attributionParam_ = options.attributionParam || 'atribucion';
    this.urlParam_ = options.urlParam || 'url';

    this.defaultAttribution_ = options.defaultAttribution || 'Instituto Geogr&aacute;fico Nacional';
    this.defaultURL_ = options.defaultURL || 'https://www.ign.es/';
    this.tooltip_ = options.tooltip || getValue('attributions').tooltip;
    this.urlAttribute = options.urlAttribute || 'Gobierno de España';
    this.options = options;

    this.collectionsAttributions_ = [];

    /**
     * Order: Orden que tendrá con respecto al
     * resto de plugins y controles por pantalla.
     */
    this.order = options.order;
  }

  /**
   * Esta función crea la vista del mapa especificado.
   *
   * @public
   * @function
   * @param {M.Map} map Mapa
   * @returns {Promise} Plantilla HTML.
   * @api
   */
  createView(map) {
    this.map = map;

    return new Promise((success, fail) => {
      const html = compileTemplate(attributionsTemplate, {
        vars: {
          collapsible: window.innerWidth < 769,
          tooltip: getValue('scale').tooltip, // [ TO-DO ] Ponerlo en traducciones y template ?¿?
          order: this.order,
        },
      });

      html.querySelector('#close-button').addEventListener('click', () => this.closePanel());
      this.html_ = html;

      this.initMode();

      this.onMoveEnd(() => {
        this.changeAttributions();
      });

      success(html);
    });
  }

  /**
   * @public
   * @function
   */
  initMode() {
    if (this.mode_ === MODES.mapAttributions) {
      this.collectionsAttributions_.forEach((attribuccionParams) => {
        const { name, contentAttributions, contentType } = attribuccionParams;
        if (contentAttributions) {
          this.createVectorLayer(name, contentAttributions, contentType);
        }
      });
    }
  }

  createVectorLayer(layerName, url, type) {
    let layer = this.layer_;
    if (!(layer instanceof GeoJSON)) {
      const optionsLayer = {
        name: `${layerName}_attributions`,
        url,
      };

      if (type === 'geojson') {
        layer = new GeoJSON(optionsLayer, { displayInLayerSwitcher: false });
      } else if (type === 'kml') {
        layer = new KML(optionsLayer, { displayInLayerSwitcher: false });
      } else if (this.type === 'topojson') {
        // TODO: Implement in Mapea M.layer.TopoJSON
      }
    }


    if (this.map.getLayers({ name: layer }).length < 1) {
      this.map.addLayers(layer);
      layer.displayInLayerSwitcher = false;
      layer.setVisible(false);
    }
  }


  /**
     * This method shows the layer attributions
     *
     * @function
     * @public
     */
  changeAttributions() {
    this.clearContent();
    const layers = this.collectionsAttributions_;

    layers.forEach((layer) => {
      let featureAttributions = false;

      const zoom = this.map_.getZoom();

      let mapAttributions = [];
      let defaultMapAttributions = false;

      if (this.checkDefaultAttribution(layer)) {
        defaultMapAttributions = this.defaultAttribution(layer, zoom, mapAttributions);
      }

      // No tiene attribuccion por defecto
      // Capas: 'OI.OrthoimageCoverage', 'EL.GridCoverageDSM', 'IGNBaseTodo', 'LC.LandCoverSurfaces'
      if (!defaultMapAttributions) {
        mapAttributions = [layer];
      } else {
        mapAttributions = defaultMapAttributions;
      }

      // Features Attributions
      if (this.map_.getScale() <= this.scale_) {
        this.setVisible(true);
        if (this.map_.getLayers().some(l => l.name.includes(`${layer.name}_attributions`))) {
          const features = this.map_.getLayers().filter(l => l.name.includes(`${layer.name}_attributions`))[0].getFeatures();
          featureAttributions = this.getMapAttributions(features);
        }
      }

      if (featureAttributions) {
        mapAttributions = mapAttributions.concat(featureAttributions);
      }
      // ---

      this.addContent(mapAttributions);
    });
  }

  defaultAttribution(layer, zoom) {
    const isHybrid = this.map_.getLayers().filter((l) => {
      return l.type === 'WMTS' && !l.displayInLayerSwitcher && l.name === 'OI.OrthoimageCoverage';
    }).length > 0;
    if ((layer !== undefined && layer.name === 'OI.OrthoimageCoverage') || isHybrid) {
      if (zoom < 14) {
        return [{ name: 'Copernicus Sentinel 2019', url: 'https://sentinel.esa.int/web/sentinel/home' }];
      }
      return [{ name: 'Sistema Cartográfico Nacional', url: 'http://www.scne.es/' }];
    } else if (layer !== undefined && (layer.name === 'IGNBaseTodo' || layer.name === 'EL.GridCoverageDSM')) {
      return [{ name: 'Sistema Cartográfico Nacional', url: 'http://www.scne.es/' }];
    } else if (layer !== undefined && layer.name === 'LC.LandCoverSurfaces') {
      if (zoom < 14) {
        return [{ name: 'CORINE-Land Cover. Instituto Geográfico Nacional', url: this.defaultURL_ }];
      }
      return [{ name: 'Sistema Cartográfico Nacional', url: 'http://www.scne.es/' }];
    }
    return false;
  }

  checkDefaultAttribution(layer) {
    return ['OI.OrthoimageCoverage', 'EL.GridCoverageDSM', 'IGNBaseTodo', 'LC.LandCoverSurfaces'].includes(layer.name);
  }

  /**
     * This method adds the text content to the view attribution
     *
     * @function
     * @public
     */
  addContent(attributions) {
    const html = this.html_;
    const id = attributions[0].nameLayer || '';
    const links = attributions.map((attrOpt, index, arr) => {
      const element = attrOpt.url ? 'a' : 'p';
      const link = document.createElement(element);

      if (element === 'a') {
        link.target = '_blank';
        link.href = attrOpt.url || '';
        link.setAttribute('rol', 'link');
      }


      link.setAttribute('tabindex', this.order);

      link.innerHTML = attrOpt.name || '';
      const attributeURL = this.map_.getScale() > this.scale_ ? '' : ' '.concat(this.urlAttribute);
      link.innerHTML += arr.length - 1 === index ? attributeURL : ' ';
      return link;
    });
    const div = document.createElement('div');
    div.classList.add('attributionElements');

    links[0].innerHTML = `<span>${id}</span> ${links[0].innerHTML}`;

    links.forEach((link) => {
      div.append(link);
    });

    html.append(div);
  }

  addHTMLContent(html) {
    this.html_.innerHTML += `<div>${html}</div>`;
  }

  /**
     * This method adds the text content to the view attribution
     *
     * @function
     * @public
     */
  clearContent() {
    if (!isNullOrEmpty(this.html_)) {
      const html = this.html_;
      html.querySelectorAll('.attributionElements').forEach(child => html.removeChild(child));
    }
  }

  /**
     * This method toggle de visibility of the view attribution
     */
  setVisible(visibility) {
    const html = this.html_;
    html.style.display = visibility === false ? 'none' : '';
  }

  /**
     * @function
     * @public
     */
  getMapAttributions(featuresAttributions) {
    this.updateBBoxFeature();
    const interFilter = INTERSECT(this.bboxFeature_);
    const filteredFeatures = interFilter.execute(featuresAttributions);
    return filteredFeatures.map((feature) => {
      return {
        name: feature.getAttribute(this.attributionParam_) || '',
        url: feature.getAttribute(this.urlParam_) || this.defaultURL_,
      };
    }).filter((element, index, array) => // remove repeat elements
      array.map(e => e.attribution).indexOf(element.attribution) === index);
  }

  addAttributions(attribuccionParams) {
    if (typeof attribuccionParams === 'string') {
      this.addHTMLContent(attribuccionParams);
    } else {
      this.collectionsAttributions_.push(attribuccionParams);

      const { name, contentType, contentAttributions } = attribuccionParams;
      this.createVectorLayer(name, contentAttributions, contentType);
    }
  }

  /**
   * @function
   * @public
   */
  closePanel() {
    this.getPanel().collapse();
  }

  /**
     * @function
     * @public
     */
  changeContentAttribution(content) {
    // this.control_.changeContent(content);
  }

  /**
     * @function
     * @public
     */
  updateBBoxFeature() {
    const { x, y } = this.map_.getBbox();
    this.bboxFeature_ = new Feature('bbox_feature', {
      type: 'Feature',
      properties: {},
      geometry: {
        type: 'Polygon',
        coordinates: [
          [
            [x.min, y.min],
            [x.min, y.max],
            [x.max, y.max],
            [x.max, y.min],
            [x.min, y.min],
          ],
        ],
      },
    });
  }

  /**
     * @function
     * @public
     */
  setCollapsiblePanel(e) {
    if (this.getPanel() && this.getPanel().getTemplatePanel()) {
      if (e.target.innerWidth < 769) {
        this.getPanel().getTemplatePanel().classList.remove('no-collapsible');
        this.closePanel();
      } else {
        this.getPanel().getTemplatePanel().classList.add('no-collapsible');
        this.getPanel().getTemplatePanel().classList.remove('collapsed');
      }
    }
  }

  /**
   * Optione las attribuciones de las capas cargadas
   * @function
   * @public
   */
  getAttributionsFromMap(layers) {
    const layersFormat = layers.map(layer => layer.getAttributions());
    // Se elimina las capas que no tenga atribuciones
    return layersFormat.filter(Boolean);
  }

  /**
     * @function
     * @public
     */
  onMoveEnd(callback) {
    this.impl_.registerEvent('moveend', this.map, e => callback(e));
  }

  // [ ] Cuando añaden capas
  // [ ] Cuando se elminan capas
  onAddLayer(callback) {
    this.impl_.registerEvent('add', this.map, e => callback(e));
  }


  /**
   * Esta función comprueba si un objeto es igual
   * a este control.
   *
   * @public
   * @function
   * @param {*} obj Objeto a comparar.
   * @returns {boolean} Iguales devuelve verdadero, falso si no son iguales.
   * @api
   */
  equals(obj) {
    const equals = (obj instanceof Attributions);
    return equals;
  }

  getAttributions() {
    return this.collectionsAttributions_;
  }

  setAttributions(attr) {
    this.collectionsAttributions_ = attr;
    this.changeAttributions();
  }

  /**
   * Esta función destruye el control.
   */
  destroy() {
    this.getImpl().destroy();
  }
}

/**
 * Nombre del control.
 * @const
 * @type {string}
 * @public
 * @api
 */
Attributions.NAME = 'attributions';

export default Attributions;
