/**
 * @module M/layer/Generic
 */
import GenericImpl from 'impl/layer/Generic';
import { geojsonTo4326 } from 'impl/util/Utils';
import {
  isNullOrEmpty,
  isUndefined,
  isArray,
  isObject,
  generateRandom,
  isFunction,
  isString,
  modifySVG,
} from '../util/Utils';
import Exception from '../exception/exception';
import LayerBase from './Layer';
import * as LayerType from './Type';
import { getValue } from '../i18n/language';
import * as dialog from '../dialog';
import Style from '../style/Style';
import * as EventType from '../event/eventtype';
import GenericStyle from '../style/Generic';
import FilterBase from '../filter/Base';
import StyleCluster from '../style/Cluster';


/**
 * @classdesc
 * Generic permite añadir cualquier tipo de capa definida con la librería base
 *
 * @api
 * @extends {M.Layer}
 */
class Generic extends LayerBase {
  /**
   * Constructor principal de la clase. Crea una capa Generic
   * con parámetros especificados por el usuario.
   * @constructor
   * @param {string|Mx.parameters.Generic} userParameters Parámetros para la construcción
   * de la capa.
   * - legend: Nombre asociado en el árbol de contenidos, si usamos uno.
   * @param {Mx.parameters.LayerOptions} options Estas opciones se mandarán a
   * la implementación de la capa.
   * - visibility: Indica la visibilidad de la capa.
   * @param {Object} vendorOptions Capa definida en con la librería base.
   * @api
   */
  constructor(userParameters, options, vendorOptions = {}) {
    // checks if the implementation can create Generic layers
    if (isUndefined(GenericImpl)) {
      Exception(getValue('exception').generic_method);
    }

    const params = isNullOrEmpty(userParameters) ? {} : userParameters;
    let opts = isNullOrEmpty(options) ? {} : options;
    opts = {
      ...opts,
      maxExtent: params.maxExtent,
      ids: params.ids,
      cql: params.cql,
    };
    const impl = new GenericImpl(opts, vendorOptions);
    // calls the super constructor
    super(opts, impl);

    if (!isNullOrEmpty(impl) && isFunction(impl.setFacadeObj)) {
      impl.setFacadeObj(this);
    }

    /**
     * Generic name: Nombre de la capa.
     */
    this.name = params.name;

    if (isNullOrEmpty(this.name) && !isNullOrEmpty(vendorOptions.getSource()) &&
      !isNullOrEmpty(vendorOptions.getSource().getParams) &&
      !isNullOrEmpty(vendorOptions.getSource().getParams().LAYERS)) {
      this.name = vendorOptions.getSource().getParams().LAYERS;
    } else if (isNullOrEmpty(this.name) && !isNullOrEmpty(vendorOptions.getSource()) &&
      !isNullOrEmpty(vendorOptions.getSource().getUrl) &&
      !isNullOrEmpty(vendorOptions.getSource().getUrl())) {
      const url = vendorOptions.getSource().getUrl();
      const result = url.split('&typeName=')[1].split('&')[0].split(':');
      if (!isNullOrEmpty(result)) {
        this.name = result[1];
        this.namespace = result[0];
      } else {
        this.name = generateRandom('layer_', '_'.concat(this.type));
      }
    } else if (isNullOrEmpty(this.name)) {
      this.name = generateRandom('layer_', '_'.concat(this.type));
    }

    if (isNullOrEmpty(this.namespace)) {
      if (isNullOrEmpty(params.namespace)) {
        this.namespace = undefined;
      } else {
        this.namespace = params.namespace;
      }
    }

    /**
     * Generic legend: Leyenda de la capa.
     */
    this.legend = params.legend || this.name;

    /**
     * Layer userMaxExtent:
     * MaxExtent proporcionado por el usuario, la medida en que
     * restringe la visualización a una región específica.
     */
    this.userMaxExtent = params.maxExtent;

    /**
     * Layer userMaxExtent:
     * MaxExtent proporcionado por el usuario, la medida en que
     * restringe la visualización a una región específica.
     */
    this.ids = params.ids;

    /**
     * WFS cql: Opcional: instrucción CQL para filtrar.
     * El método setCQL(cadena_cql) refresca la capa aplicando el
     * nuevo predicado CQL que recibe.
     */
    this.cql = params.cql;

    /**
     * Vector filter_. Para filtar los objetos geográficos
     * de las capas vectoriales.
     */
    this.filter_ = null;

    /**
     * Vector style_. Estilo de la capa.
     * @private
     * @type {M.style}
     * @api
     */
    this.style_ = null;

    /**
     * predefinedStyles: Estilos predefinidos para la capa.
     */
    this.predefinedStyles =
      isUndefined(opts.predefinedStyles) ? [] : opts.predefinedStyles;
    if (isUndefined(opts.style) && !isUndefined(this.constructor.DEFAULT_OPTS_STYLE)) {
      this.predefinedStyles.unshift(new GenericStyle(this.constructor.DEFAULT_OPTS_STYLE));
    } else if (isUndefined(opts.style)) {
      this.predefinedStyles.unshift(new GenericStyle(GenericStyle.DEFAULT_OPTIONS_STYLE));
    } else {
      this.predefinedStyles.unshift(opts.style);
    }

    this.setStyle(opts.style);

    impl.on(EventType.LOAD, features => this.fire(EventType.LOAD, [features]));
  }

  /**
   * Devuelve el tipo de layer, Generic.
   *
   * @function
   * @getter
   * @returns {M.LayerType.Generic} Tipo Generic.
   * @api
   */
  get type() {
    return LayerType.Generic;
  }

  /**
   * Sobrescribe el tipo de capa.
   *
   * @function
   * @setter
   * @param {String} newType Nuevo tipo.
   * @api
   */
  set type(newType) {
    if (!isUndefined(newType) &&
      !isNullOrEmpty(newType) && (newType !== LayerType.Generic)) {
      Exception('El tipo de capa debe ser \''.concat(LayerType.Generic).concat('\' pero se ha especificado \'').concat(newType).concat('\''));
    }
  }

  /**
   * Devuelve la url del servicio.
   *
   * @function
   * @getter
   * @public
   * @returns {String} URL del servicio.
   * @api
   */
  get url() {
    return this.getImpl().getURLService();
  }

  /**
   * Modifica la url del servicio.
   * @function
   * @setter
   * @public
   * @param {String} newUrl Nueva URL.
   * @api
   */
  set url(newUrl) {
    this.getImpl().setURLService(newUrl);
  }

  /**
   * Devuelve la leyenda de la capa.
   * La Leyenda indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
   *
   * @function
   * @getter
   * @return {M.layer.Generic.impl.legend} Leyenda de la capa.
   * @api
   */
  get legend() {
    return this.getImpl().legend;
  }

  /**
   * Sobrescribe la leyenda de la capa.
   * La Leyenda indica el nombre que queremos que aparezca en el árbol de contenidos, si lo hay.
   *
   * @function
   * @setter
   * @param {String} newLegend Nueva leyenda.
   * @api
   */
  set legend(newLegend) {
    if (isNullOrEmpty(newLegend)) {
      this.getImpl().legend = this.name;
    } else {
      this.getImpl().legend = newLegend;
    }
  }

  /**
   * Este método devuelve extensión máxima de esta capa.
   *
   * @function
   * @returns {Array} Devuelve la extensión máxima de esta capa.
   * @api
   */
  getMaxExtent(isSource = true) {
    let extent = !isSource ? this.userMaxExtent : this.getImpl().getMaxExtent();
    if (isUndefined(extent) || isNullOrEmpty(extent)) {
      extent = this.map_.getProjection().getExtent();
    }
    return extent;
  }

  /**
   * Este método restablece la extensión máxima de la capa.
   * @function
   * @api
   */
  resetMaxExtent() {
    this.userMaxExtent = null;
    this.calculateMaxExtent().then((maxExtent) => {
      if (isFunction(this.getImpl().setMaxExtent)) {
        this.getImpl().setMaxExtent(maxExtent);
      }
    });
  }

  /**
   * Este método calcula la extensión máxima de esta capa.
   *
   * @function
   * @returns {M.layer.maxExtent} Devuelve una promesa, con la extensión máxima de esta capa.
   * @api
   */
  calculateMaxExtent() {
    return new Promise(resolve => resolve(this.getMaxExtent(false)));
  }
  /**
   * Este método cambia la extensión máxima de la capa.
   *
   * @function
   * @param {Array|Object} maxExtent Nuevo valor para el "MaxExtent".
   * @api
   * @export
   */
  setMaxExtent(maxExtent) {
    let extent = maxExtent;
    if (!isArray(maxExtent) && isObject(maxExtent)) {
      extent = [
        maxExtent.x.min,
        maxExtent.y.min,
        maxExtent.x.max,
        maxExtent.y.max,
      ];
    }
    this.getImpl().setMaxExtent(extent);
  }

  /**
   * Devuelve la versión del servicio, por defecto es 1.3.0.
   *
   * @function
   * @getter
   * @return {M.layer.WMS.impl.version} Versión del servicio.
   * @api
   */
  get version() {
    return this.getImpl().version;
  }

  /**
   * Sobrescribe la versión del servicio, por defecto es 1.3.0.
   *
   * @function
   * @setter
   * @param {String} newVersion Nueva versión del servicio.
   * @api
   */
  set version(newVersion) {
    if (!isNullOrEmpty(newVersion)) {
      this.getImpl().setVersion(newVersion);
    }
  }

  /**
   * Devuelve los ids de la capa.
   * @function
   * @return {M.layer.WFS.impl.ids} Devuelve los ids.
   * @api
   */
  get ids() {
    return this.getImpl().ids;
  }

  /**
   * Sobrescribe los ids de la capa.
   * @function
   * @param {Array} newIds Nuevos ids.
   * @api
   */
  set ids(newIds) {
    if (isNullOrEmpty(newIds)) {
      this.getImpl().ids = this.ids;
    } else {
      this.getImpl().ids = newIds;
    }
  }

  /**
   * Este método devuelve todos los objetos geográficos o discrimina por el filtro.
   *
   * @function
   * @public
   * @param {Boolean} applyFilter Indica si se ejecuta filtro.
   * @return {Array<M.Feature>} Devuelve todos los objetos geográficos o discriminando por
   * el filtro.
   * @api
   */
  getFeatures(skipFilterParam) {
    let skipFilter = skipFilterParam;
    if (isNullOrEmpty(this.getFilter())) skipFilter = true;
    return this.getImpl().getFeatures(skipFilter, this.filter_);
  }

  /**
   * Este método incluye objetos geográficos a la capa.
   *
   * @function
   * @public
   * @param {Array<M.feature>} features Objetos geográficos que
   * se incluirán a la capa.
   * @param {Boolean} update Verdadero se vuelve a cargar la capa,
   * falso no la vuelve a cargar.
   * @api
   */
  addFeatures(featuresParam, update = false) {
    let features = featuresParam;
    if (!isNullOrEmpty(features)) {
      if (!isArray(features)) {
        features = [features];
      }
      this.getImpl().addFeatures(features, update);
    }
  }

  getFeatureById(id) {
    let feature = null;
    if (!isNullOrEmpty(id)) {
      feature = this.getImpl().getFeatureById(id);
    } else {
      dialog.error(getValue('dialog').id_feature);
    }
    return feature;
  }

  /**
   * Este método devuelve el valor de la propiedad filter, esta
   * propiedad se utiliza para filtrar los objeto geográfico.
   *
   * @function
   * @public
   * @return {M.Filter} Devuelve el filtro.
   * @api
   */
  getFilter() {
    return this.filter_;
  }

  /**
   * Este método establece el estilo en capa.
   *
   * @function
   * @public
   * @param {M.Style} styleParam Estilo que se aplicará a la capa.
   * @param {Boolean} applyToFeature Si el valor es verdadero se aplicará a los objetos geográficos,
   * falso no.
   * Por defecto, falso.
   * @param {M.layer.WFS.DEFAULT_OPTIONS_STYLE} defaultStyle Estilo por defecto,
   * se define en WFS.js.
   * @api
   */
  setStyle(style, applyToFeature = false, defaultStyle = Generic.DEFAULT_OPTIONS_STYLE) {
    if (this.getImpl().isLoaded()) {
      if (isNullOrEmpty(this.getStyle())) {
        this.applyStyle_(defaultStyle, applyToFeature);
      }
      if (!isNullOrEmpty(style)) {
        this.applyStyle_(style, applyToFeature);
      }
    } else {
      this.on(EventType.LOAD, () => {
        if (isNullOrEmpty(this.getStyle())) {
          this.applyStyle_(defaultStyle, applyToFeature);
        }
        if (!isNullOrEmpty(style)) {
          this.applyStyle_(style, applyToFeature);
        }
      });
    }
  }

  /**
   * La forma en que se aplica el estilo a la capa.
   *
   * @function
   * @public
   * @param {Object} styleParam Estilo que se aplicará a la capa.
   * @param {Boolean} applyToFeature Indica si se aplicará el estilo a los objetos geográficos.
   * @api
   */
  applyStyle_(styleParam, applyToFeature) {
    let style = styleParam;
    if (isString(style)) {
      style = Style.deserialize(style);
    } else if (!(style instanceof Style)) {
      style = new GenericStyle(style);
    }
    if (style instanceof Style) {
      let options = style.getOptions();
      if (options.point) {
        options = options.point;
      }
      if (options.icon && options.icon.src && typeof options.icon.src === 'string' && options.icon.src.endsWith('.svg') &&
        (options.icon.fill || options.icon.stroke)) {
        modifySVG(options.icon.src, options).then((resp) => {
          options.icon.src = resp;
          this.applyStyle_(styleParam, applyToFeature);
        });
      } else if (style instanceof Style) {
        if (!isNullOrEmpty(this.style_) && this.style_ instanceof Style) {
          this.style_.unapply(this);
        }
        style.apply(this, applyToFeature);
        this.style_ = style;
        this.fire(EventType.CHANGE_STYLE, [style, this]);
      }
    }
    this.fire(EventType.CHANGE_STYLE, [style, this]);
  }

  /**
   * Este método devuelve el estilo de la capa.
   *
   * @function
   * @public
   * @returns {M.layer.Vector.style}
   * @api
   */
  getStyle() {
    return this.style_;
  }

  /**
   * Este método elimina el valor de la propiedad "filter",
   * lo pone a nulo.
   *
   * @function
   * @public
   * @api
   */
  removeFilter() {
    this.setFilter(null);
  }

  /**
   * Elimina el estilo de la capa y de los objetos geográficos.
   *
   * @function
   * @public
   * @api
   */
  clearStyle() {
    this.setStyle(null);
    this.getFeatures().forEach(feature => feature.clearStyle());
  }

  /**
   * Elimina el objeto geográfico indicado por parámetro.
   *
   * @function
   * @public
   * @param {Array<M.feature>} features El objeto geográfico que se eliminará.
   * @api
   */
  removeFeatures(featuresParam) {
    let features = featuresParam;
    if (!isArray(features)) {
      features = [features];
    }
    this.getImpl().removeFeatures(features);
  }

  /**
   * Este método obtiene la representación GeoJSON de la capa.
   * @function
   * @returns {Object} Devuelve un objeto, tipo 'FeatureCollection' con
   * los objetos geográficos.
   * @api
   */
  toGeoJSON() {
    const code = this.map_.getProjection().code;
    const featuresAsJSON = this.getFeatures().map(feature => feature.getGeoJSON());
    return { type: 'FeatureCollection', features: geojsonTo4326(featuresAsJSON, code) };
  }

  /**
   * Sobrescribe el filtro de la capa.
   *
   * @function
   * @public
   * @param {M.Filter} filter Filtro para configurar.
   * @api
   */
  setFilter(filter) {
    if (isNullOrEmpty(filter) || (filter instanceof FilterBase)) {
      this.filter_ = filter;
      const style = this.style_;
      if (style instanceof StyleCluster) {
        // deactivate change cluster event
        style.getImpl().deactivateChangeEvent();
      }
      this.redraw();
      if (style instanceof StyleCluster) {
        // activate change cluster event
        style.getImpl().activateChangeEvent();

        // Se refresca el estilo para actualizar los cambios del filtro
        // ya que al haber activado el evento change de source cluster tras aplicar el filter
        // no se actualiza automaticamente
        style.refresh();
      }
    } else {
      dialog.error(getValue('dialog').vector_filter);
    }
  }

  /**
   * Este método redibuja la capa.
   *
   * @function
   * @public
   * @api
   */
  redraw() {
    this.getImpl().redraw();
  }

  /**
   * Este método elimina todos los objetos geográficos.
   *
   * @function
   * @public
   * @api
   */
  clear() {
    this.removeFilter();
    this.removeFeatures(this.getFeatures(true));
  }

  /**
   * Este método comprueba si un objeto es igual
   * a esta capa.
   *
   * @function
   * @param {Object} obj Objeto a comparar.
   * @returns {Boolean} Valor verdadero es igual, falso no lo es.
   * @api
   */
  equals(obj) {
    let equals = false;
    if (obj instanceof Generic) {
      equals = (this.legend === obj.legend);
      equals = equals && (this.url === obj.url);
      equals = equals && (this.name === obj.name);
    }

    return equals;
  }
}

/**
 * Parámetros predeterminados.
 * @const
 * @type {Object}
 * @public
 * @api
 */
Generic.DEFAULT_PARAMS = {
  fill: {
    color: 'rgba(255, 255, 255, 0.4)',
    opacity: 0.4,
  },
  stroke: {
    color: 'orange',
    width: 1.5,
  },
};

/**
 * Estilos predeterminados.
 * @const
 * @type {Object}
 * @public
 * @api
 */
Generic.DEFAULT_OPTIONS_STYLE = {
  point: {
    ...Generic.DEFAULT_PARAMS,
    radius: 5,
  },
  line: {
    ...Generic.DEFAULT_PARAMS,
  },
  polygon: {
    ...Generic.DEFAULT_PARAMS,
  },
};

export default Generic;
