/**
 * @module M/plugin/StyleTools
 */
import 'assets/css/styletools';
import PointStyle from './pointStyle';
import LineStringStyle from './lineStringStyle';
import PolygonStyle from './polygonStyle';
import TextStyle from './textStyle';

export default class StyleTools extends M.Plugin {
  /**
   * @classdesc
   * Main facade plugin object. This class creates a plugin
   * object which has an implementation Object
   *
   * @constructor
   * @extends {M.Plugin}
   * @param {Object} impl implementation object
   * @api stable
   */
  constructor(feature, map, plugin) {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map = null;
    this.feature = feature;
    this.geometry = feature.getGeometry().getType();
    this.plugin = plugin;
    const style1 = new ol.style.Style({
      stroke: new ol.style.Stroke({ color: '#0000FF', width: 3 }),
      fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
    });
    const style2 = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        stroke: new ol.style.Stroke({
          color: 'white',
          width: 2,
        }),
        fill: new ol.style.Fill({
          color: '#7CFC00',
        }),
      }),
    });

    if (this.feature.getStyle() === null) {
      if (this.geometry != 'Point' && this.geometry != 'MultiPoint') {
        this.feature.setStyle(style1);
      } else {
        this.feature.setStyle(style2);
      }
    }
    this.panel = null;
    this.control = null;
    /**
     * Array of controls
     * @private
     * @type {Array<M.Control>}
     */
    this.controls_ = [];
    this.addTo(map);
  }

  /**
   * This function adds this plugin into the map
   *
   * @public
   * @function
   * @param {M.Map} map the map to add the plugin
   * @api stable
   */
  addTo(map) {
    this.map = map;
    // panel para agregar control - no obligatorio
    this.panel = new M.ui.Panel('panelStyleTools', {
      collapsible: false,
      position: M.ui.position.TL,
      className: 'm-tools-styleTools',
    });
    if (this.geometry == 'Polygon' || this.geometry == 'MultiPolygon') {
      this.control = new PolygonStyle(this, this.feature);
      this.panel.addControls([this.control]);
    } else if (this.geometry == 'LineString' || this.geometry == 'MultiLineString' || this.geometry == 'GeometryCollecion') {
      this.control = new LineStringStyle(this, this.feature);
      this.panel.addControls([this.control]);
    } else if (this.feature.getStyle().text_ !== null) {
      this.control = new TextStyle(this, this.feature);
      this.panel.addControls([this.control]);
    } else {
      this.control = new PointStyle(this, this.feature);
      this.panel.addControls([this.control]);
    }
    map.addPanels(this.panel);
  }

  destroyControl() {
    this.plugin.square = null;
    this.plugin.slayer.getImpl().getOL3Layer().getSource().clear();
    document.getElementById('styleToolsHTML').remove();
    this.map.getMapImpl().removeControl(this.control);
    this.feature = null;
    this.geometry = null;
  }

  changeElements(feature, plugin) {
    this.feature = feature;
    this.geometry = feature.getGeometry().getType();
    this.plugin = plugin;
    const style1 = new ol.style.Style({
      stroke: new ol.style.Stroke({ color: '#0000FF', width: 3 }),
      fill: new ol.style.Fill({ color: 'rgba(0, 0, 255, 0.2)' }),
    });
    const style2 = new ol.style.Style({
      image: new ol.style.Circle({
        radius: 6,
        stroke: new ol.style.Stroke({
          color: 'white',
          width: 2,
        }),
        fill: new ol.style.Fill({
          color: '#7CFC00',
        }),
      }),
    });
    if (document.getElementById('styleToolsHTML') != null) {
      document.getElementById('styleToolsHTML').remove();
    }
    this.map.getMapImpl().removeControl(this.control);
    if (this.feature.getStyle() === null) {
      if (this.geometry != 'Point' && this.geometry != 'MultiPoint') {
        this.feature.setStyle(style1);
      } else {
        this.feature.setStyle(style2);
      }
    }
    if (this.geometry == 'Polygon' || this.geometry == 'MultiPolygon') {
      this.control = new PolygonStyle(this, this.feature);
      this.panel.addControls([this.control]);
    } else if (this.geometry == 'LineString' || this.geometry == 'MultiLineString' || this.geometry == 'GeometryCollection') {
      this.control = new LineStringStyle(this, this.feature);
      this.panel.addControls([this.control]);
    } else if (this.feature.getStyle().text_ !== null) {
      this.control = new TextStyle(this, this.feature);
      this.panel.addControls([this.control]);
    } else {
      this.control = new PointStyle(this, this.feature);
      this.panel.addControls([this.control]);
    }
  }

  destroy() {
    this.panel.removeControls(this.panel.getControls());
    this.feature = null;
    this.geometry = null;
    this.panel = null;
    this.controls_ = null;
    this.map = null;
  }
}
