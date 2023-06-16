/**
 * @module M/impl/style/Simple
 */
import OLFeature from 'ol/Feature';
import RenderFeature from 'ol/render/Feature';
import { isFunction, isNullOrEmpty } from 'M/util/Utils';
import Style from './Style';
import Feature from '../feature/Feature';

/**
 * @classdesc
 * Esta clase genera estilos simples.
 * @api
 * @namespace M.impl.style.Simple
 */
class Simple extends Style {
  /**
   * Constructor principal de la clase.
   * @constructor
   * @param {Object} options Opciones de la clase.
   * - icon (src): Ruta del icono.
   * @api stable
   */
  constructor(options = {}) {
    super(options);
    this.updateFacadeOptions(options);
  }

  /**
   * Este método obtiene la función de estilo de Openlayer
   * de la Implementación.
   * @public
   * @function
   * @returns {Object} Implementación de Openlayers.
   * @api stable
   */
  get olStyleFn() {
    return this.olStyleFn_;
  }

  /**
   * Este método aplica los estilos a la capa.
   * @public
   * @function
   * @param {M.layer.Vector} layer Capa.
   * @api stable
   */
  applyToLayer(layer) {
    this.layer_ = layer;
    // we will apply the style on the ol3 layer
    const olLayer = layer.getImpl().getOL3Layer();
    if (!isNullOrEmpty(olLayer)) {
      olLayer.setStyle(this.olStyleFn_);
      // layer.getFeatures().forEach(this.applyToFeature, this);
    }
  }

  /**
   * Este método aplica los estilos a los objetos geográficos.
   *
   * @public
   * @param {M.Feature} feature Objetos geográficos.
   * @function
   * @api stable
   */
  applyToFeature(feature) {
    feature.getImpl().getOLFeature().setStyle(this.olStyleFn_);
  }

  /**
   * Este método de la clase obtiene el valor de la función con la que coincide la tecla
   * el parámetro "attr"
   * @public
   * @function
   * @param {string|number|function} attr Atributo o función.
   * @param {ol.Feature}  feature Objeto geográfico de OpenLayers.
   * @param {M.layer.Vector} layer Capas.
   * @api stable
   */
  static getValue(attr, olFeature, layer) {
    const templateRegexp = /^\{\{([^}]+)\}\}$/;
    let attrFeature = attr;
    if (templateRegexp.test(attr) || isFunction(attr)) {
      if (!(olFeature instanceof OLFeature || olFeature instanceof RenderFeature)) {
        attrFeature = undefined;
      } else {
        const feature = Feature.olFeature2Facade(olFeature, false);
        if (templateRegexp.test(attr)) {
          const keyFeature = attr.replace(templateRegexp, '$1');
          attrFeature = feature.getAttribute(keyFeature);
        } else if (isFunction(attr)) {
          let facadeMap;
          if (!isNullOrEmpty(layer)) {
            facadeMap = layer.getImpl().getMap();
          }
          attrFeature = attr(feature, facadeMap);
        }
      }
    }
    if (isNullOrEmpty(attrFeature)) {
      attrFeature = undefined;
    }
    return attrFeature;
  }
}

export default Simple;
