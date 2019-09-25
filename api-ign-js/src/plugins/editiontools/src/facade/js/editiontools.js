/**
 * @module M/plugin/EditionTools
 */
import '../assets/css/editiontools.css';
import PickFeature from './pickFeature';
import MoveFeature from './moveFeature';
import EditFeature from './editFeature';
import DrawFeature from './drawFeature';
// import DrawLine from './drawfeature';
// import DrawPolygon from './drawfeature';
// import TextFeature from './textfeature';
// import DownloadGeojson from './downloadGeojson';
import DeleteFeature from './deleteFeature';
// import CuadradoSVG from '../assets/css/images/rectangle.svg';
// import TrianguloSVG from '../assets/css/images/triangulo.svg';
import CuadradoSVG from '../assets/css/images/rectangle';
import TrianguloSVG from '../assets/css/images/triangulo';
import LocalLayersControl from './locallayersControl';

/**
 * @classdesc
 * Main facade plugin object. This class creates a plugin
 * object which has an implementation Object
 *
 * @constructor
 * @extends {M.Plugin}
 * @param {array} controls - Array of controls to be added
 * @api stable
 */
export default class EditionTools extends M.Plugin {
  constructor(numberOfDrawFeatures) {
    super();
    /**
     * Array of controls to be added
     * @private
     * @type {String}
     */

    this.controls_ = [];
    this.feature = null;
    this.panel = null;
    this.layer = null;
    if (numberOfDrawFeatures != null && numberOfDrawFeatures != undefined) {
      this.numberOfDrawFeatures = numberOfDrawFeatures;
    } else {
      this.numberOfDrawFeatures = 0;
    }
    /**
     * Name of this control
     * @public
     * @type {string}
     * @api stable
     */
    this.name = EditionTools.NAME;
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.map_ = null;

    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.pickFeature_ = null;
    /**
     * Implementation of this object
     * @private
     * @type {Object}
     */
    this.moveFeature_ = null;
    // /**
    //  * Implementation of this object
    //  * @private
    //  * @type {Object}
    //  */
    this.editFeature = null;
    // /**
    //  * Implementation of this object
    //  * @private
    //  * @type {Object}
    //  */
    this.drawPoint_ = null;
    this.drawLine_ = null;
    this.drawPolygon_ = null;
    this.coding = 'data:image/svg+xml;base64,';
    // /**
    //  * Implementation of this object
    //  * @private
    //  * @type {Object}
    //  */
    this.textFeature_ = null;
    // /**
    //  * Implementation of this object
    //  * @private
    //  * @type {Object}
    //  */
    // this.downloadGeojson_ = null;
    // /**
    //  * Implementation of this object
    //  * @private
    //  * @type {Object}
    //  */
    this.deleteFeature_ = null;
    this.vectorLayer = null;
    this.vectorSource = null;
    this.vectorStyle = null;
    this.stylePlugin = null;
    this.slayer = new M.layer.Vector({
      name: 'selectLayer',
      source: new ol.source.Vector({ features: new ol.Collection([]) }),
    });
    this.square = null;
    this.localLayers_ = null;
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
    this.map_ = map;
    if (this.numberOfDrawFeatures == 0) {
      this.numberOfDrawFeatures = map.getLayers()[map.getLayers().length - 1].getFeatures().length;
    }
    this.vectorLayer = map.getLayers()[map.getLayers().length - 1].getImpl().getOL3Layer();
    this.vectorSource = new ol.source.Vector();
    this.vectorStyle = new ol.style.Style({
      fill: new ol.style.Fill({ color: 'rgba(255, 255, 255, 0.2)' }),
      stroke: new ol.style.Stroke({ color: '#ffcc33', width: 2 }),
      image: new ol.style.Circle({
        radius: 7,
        fill: new ol.style.Fill({ color: '#ffcc33' }),
      }),
    });
    this.vectorLayer.set('vendor.mapaalacarta.selectable', true);
    this.map_.addLayers(this.slayer);
    this.vectorLayer.setStyle(this.vectorStyle);
    this.vectorLayer.setSource(this.vectorSource);
    this.pickFeature_ = new PickFeature(this);
    this.moveFeature_ = new MoveFeature(this);
    this.editFeature_ = new EditFeature(this);
    this.drawPoint_ = new DrawFeature(this, 'Point');
    this.drawLine_ = new DrawFeature(this, 'LineString');
    this.drawPolygon_ = new DrawFeature(this, 'Polygon');
    this.textFeature_ = new DrawFeature(this, 'Text');
    // this.textFeature_ = new TextFeature();
    this.deleteFeature_ = new DeleteFeature(this);
    this.localLayers_ = new LocalLayersControl(this);
    //  this.downloadGeojson_ = new DownloadGeojson(this.feature);
    // map.addControls([
    //   this.pickFeature_, this.moveFeature_
    //    ,this.drawFeature_,
    //    this.textFeature_,
    //    this.deleteFeature_,
    //    this.downloadGeojson_
    // ]);
    if (this.panel === null) {
      this.panel = new M.ui.Panel('EditionTools', {
        collapsible: false,
        className: 'm-tools-editionTools',
        position: M.ui.position.TR,
      });
      this.panel.addControls([
        this.pickFeature_,
        this.moveFeature_,
        this.editFeature_,
        this.deleteFeature_,
        this.drawPoint_,
        this.drawLine_,
        this.drawPolygon_,
        this.textFeature_,
        this.localLayers_,
      ]);
    }
    map.addPanels(this.panel);
  }
  /**
   * This function destroys this plugin
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
    this.map_.removeControls([
      this.pickFeature_,
      this.moveFeature_,
      this.editFeature_,
      this.deleteFeature_,
      this.drawPoint_,
      this.drawLine_,
      this.drawPolygon_,
      this.textFeature_,
      this.localLayers_,
      // this.drawFeature_,
      // this.textFeature_,
      // this.deleteFeature_,
      // this.downloadGeojson_
    ]);
    this.map_.removePanel(this.panel);
    this.map_.removeLayers(this.vectorSource_);
    this.controls = null;
    this.controls_ = null;
    this.map_ = null;
    this.feature = null;
    this.layer = null;
    this.textFeature_ = null;
    this.pickFeature_ = null;
    this.moveFeature_ = null;
    this.editFeature_ = null;
    this.deleteFeature_ = null;
    this.vectorSource = null;
    this.vectorLayer = null;
    this.vectorStyle = null;
    // this.drawFeature_ = null;
    // this.textFeature_ = null;
    // this.deleteFeature_ = null;
    // this.downloadGeojson_ = null;
  }
  getControls() {
    return this.controls_;
  }
  /**
   * This function set layer
   *
   * @public
   * @function
   * @param {M.layer} layer - Layer
   * @api stable
   */
  setFeature(feature) {
    this.feature = feature.getArray()[0];
    this.changeSquare(this.feature);
    if (this.stylePlugin === null) {
      this.stylePlugin = new M.plugin.StyleTools(this.feature, this.map_, this);
    } else {
      this.stylePlugin.changeElements(this.feature, this);
    }

    // if (!M.utils.isNullOrEmpty(feature)) {
    //   const objControls = [];
    //   if (!M.utils.isNullOrEmpty(this.moveFeature_))
    //     objControls.push(this.moveFeature_);
    //   if (!M.utils.isNullOrEmpty(this.deleteFeature_))
    //     objControls.push(this.deleteFeature_);
    //   if (!M.utils.isNullOrEmpty(this.downloadGeojson_))
    //     objControls.push(this.downloadGeojson_);

    // let ctrlActivo = null;
    // objControls.forEach(function (ctrl){if (ctrl.activated) ctrlActivo = ctrl});
    //  this.clearfeature_.getImpl().clear();
    //  objControls.forEach(ctrl => ctrl.setFeature(feature));
    // }
  }

  changeSquare(feature) {
    this.square = null;
    this.slayer.getImpl().getOL3Layer().getSource().clear();
    if (this.feature.getGeometry().getType() == 'Point' || this.feature.getGeometry().getType() == 'MultiPoint') {
      if (this.feature.getStyle() == null) {
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
        this.feature.setStyle(style2);
        this.feature.changed();
      } else if (this.feature.getStyle().text_ != null) {
        return;
      }
      if (this.feature.getStyle().getImage().getSize() == undefined || this.feature.getStyle().getImage().getSize() == null) {
        this.square = new ol.Feature(this.feature.getGeometry().clone());
        this.square.setStyle(new ol.style.Style({
          image: new ol.style.RegularShape({
            stroke: new ol.style.Stroke({ color: '#FFFF00', width: 2 }),
            points: 4,
            radius: (this.feature.get('size') / 1.5) + 5,
            rotation: Math.PI / 4,
          }),
        }));
      } else {
        this.square = new ol.Feature(this.feature.getGeometry().clone());
        this.square.setStyle(new ol.style.Style({
          image: new ol.style.RegularShape({
            stroke: new ol.style.Stroke({ color: '#FFFF00', width: 2 }),
            points: 4,
            radius: (this.feature.getStyle().getImage().getSize()[0] / 1.5) + 5,
            rotation: Math.PI / 4,
          }),
        }));
      }
      this.slayer.getImpl().getOL3Layer().getSource().addFeature(this.square);
    } else {
      // ol extent buffer para suavizar un poco el encuadrado.
      // const extent = ol.extent.buffer(this.feature.getGeometry().getExtent(), 25);
      const extent = this.feature.getGeometry().getExtent();
      this.square = new ol.Feature({ geometry: ol.geom.Polygon.fromExtent(extent) });
      this.square.setStyle(new ol.style.Style({ stroke: new ol.style.Stroke({ color: '#FFFF00', width: 2 }) }));
      this.slayer.getImpl().getOL3Layer().getSource().addFeature(this.square);
    }
  }

  setFeature2(feature) {
    this.feature = feature;
    this.changeSquare(this.feature);
    if (this.stylePlugin === null) {
      this.stylePlugin = new M.plugin.StyleTools(this.feature, this.map_, this);
    } else {
      this.stylePlugin.changeElements(this.feature, this);
    }
  }
  generateMapfishGeoJSON(layers, projection, dpi) {
    const format = new ol.format.GeoJSON();
    let result = '';
    layers.forEach((layer) => {
      if (layer.getImpl().getOL3Layer() != null && layer.getImpl().getOL3Layer().get('vendor.mapaalacarta.selectable') && layer.getImpl().getOL3Layer().getSource().getFeatures().length > 0) {
        const features = layer.getImpl().getOL3Layer().getSource().getFeatures();
        let id = features.length;
        const lineStrings = features.filter(feature =>
          (feature.getGeometry().getType() == 'LineString' || feature.getGeometry().getType() == 'MultiLineString') && feature.getStyle().length > 1);
        lineStrings.forEach((lineString) => {
          const point = new ol.geom.Point(lineString.getStyle()[1].getGeometry().getCoordinates());
          const pointFeature = new ol.Feature(point);
          pointFeature.setId('draw-' + id);
          pointFeature.set('name', 'draw-' + id);
          pointFeature.setStyle(new ol.style.Style());
          if (lineString.getStyle()[1].image_ != null && lineString.getStyle()[1].image_ != undefined) {
            pointFeature.getStyle().setImage(lineString.getStyle()[1].getImage());
          } else {
            pointFeature.getStyle().setCircle(lineString.getStyle()[1].getCircle());
          }
          pointFeature.getStyle().strokeEnd = lineString.getStyle()[0].getStroke().strokeEnd;
          id += 1;
          features.push(pointFeature);
        });
        for (let i = 0; i < features.length; i += 1) {
          const keys = features[i].getKeys().length;
          if (features[i].getKeys().includes('name')) {
            features[i].set('name', features[i].get('name') + i);
          } else {
            features[i].set('name', 'feature-' + i);
          }
          for (let j = 0; j < keys; j += 1) {
            if (features[i].getKeys()[j] != 'geometry' && features[i].getKeys()[j] != 'extensionsNode_' && features[i].getKeys()[j] != 'color' && features[i].getKeys()[j] != 'icon' && features[i].getKeys()[j] != 'size' && features[i].getKeys()[j] != 'name') {
              features[i].unset(features[i].getKeys()[j]);
            }
          }
        }
        const fakeFeatures = new ol.Collection(features);
        fakeFeatures.getArray().map((feature) => {
          feature.getGeometry().setCoordinates(this.changeProjectionPoint(feature.getGeometry().getCoordinates(), 'EPSG:4326', projection));
          return feature;
        });
        result += '{"type": "geojson", "geoJson":' + format.writeFeatures(fakeFeatures.getArray());
        result += ',' + this.toMapFishDrawStyle(fakeFeatures.getArray(), dpi) + '},';
        fakeFeatures.getArray().map((feature) => {
          feature.getGeometry().setCoordinates(this.changeProjectionPoint(feature.getGeometry().getCoordinates(), projection, 'EPSG:4326'));
          return feature;
        });
      }
    });
    return result;
  }
  toMapFishDrawStyle(features, dpi) {
    let result = '"style": {"version": "2",';
    let ratioPhysic;
    if (dpi == 450) {
      ratioPhysic = 0.3;
    } else {
      ratioPhysic = 0.075;
    }
    let svgRatio;
    if (dpi == 450) {
      svgRatio = 4;
    } else {
      svgRatio = 0.5;
    }
    let textRatio;
    if (dpi == 450) {
      textRatio = 2;
    } else {
      textRatio = 8;
    }
    features.forEach((feature) => {
      const geometry = feature.getGeometry().getType();
      result += '"[name = \'' + feature.get('name') + '\']": {"symbolizers": [{';
      if (feature.getStyle().strokeEnd === undefined) {
        if (geometry == 'Polygon' || geometry == 'MultiPolygon') {
          let color = '#0000FF';
          if (feature.getStyle().getFill().getColor() != 'rgba(0, 0, 255, 0.2)') {
            color = this.rgbaToHex_(feature.getStyle().getFill().getColor());
          }
          result += '"type" : "polygon", "fillColor":"' + color +
            '", "fillOpacity":0.2, "strokeColor": "' + feature.getStyle().getStroke().getColor() +
            '", "strokeOpacity":1, "strokeWidth":' + (feature.getStyle().getStroke().getWidth() * ratioPhysic) +
            ', "strokeLinecap":"round"';
          if (feature.getStyle().getStroke().dashStyle != undefined) {
            result += ', "strokeDashstyle":"' + feature.getStyle().getStroke().dashStyle + '"}]},';
          } else {
            result += '}]},';
          }
        } else if (geometry == 'LineString' || geometry == 'MultiLineString' || geometry == 'GeometryCollecion') {
          if (Array.isArray(feature.getStyle())) {
            result += '"type" : "line", "strokeColor": "' + feature.getStyle()[0].getStroke().getColor() +
              '", "strokeOpacity":1, "strokeWidth":' + (feature.getStyle()[0].getStroke().getWidth() * ratioPhysic);
            result += ', "strokeLinecap":"round"';
            if (feature.getStyle()[0].getStroke().dashStyle != undefined) {
              result += ', "strokeDashstyle":"' + feature.getStyle()[0].getStroke().dashStyle + '"}]},';
            } else {
              result += '}]},';
            }
          } else {
            result += '"type" : "line", "strokeColor": "' + feature.getStyle().getStroke().getColor() +
              '", "strokeOpacity":1, "strokeWidth":' + (feature.getStyle().getStroke().getWidth() * ratioPhysic);
            result += ', "strokeLinecap":"round"';
            if (feature.getStyle().getStroke().dashStyle != undefined) {
              result += ', "strokeDashstyle":"' + feature.getStyle().getStroke().dashStyle + '"}]},';
            } else {
              result += '}]},';
            }
          }
        } else if (feature.getStyle().text_ !== null) {
          const textOriginal = [];
          textOriginal[0] = feature.getStyle().getText().font_.includes('bold') ? 'bold' : '';
          textOriginal[1] = feature.getStyle().getText().font_.includes('italic') ? 'italic' : '';
          textOriginal[2] = feature.getStyle().getText().font_.replace(/\D/g, '');
          textOriginal[3] = feature.getStyle().getText().font_.split('px ');
          textOriginal[3] = textOriginal[3][1];
          result += '"type" : "text", "fontColor":"' + feature.getStyle().getText().getFill().getColor() +
            '", "fontFamily": "' + textOriginal[3] +
            '", "fontSize": "' + (textOriginal[2] / textRatio) + 'px", "fontStyle": "' + textOriginal[0] +
            '", "label":"' + feature.getStyle().getText().getText() + '"}]},';
        } else {
          if (feature.getStyle().getImage().fill_ === null || feature.getStyle().getImage().fill_ === undefined) {
            let icon = feature.get('icon');
            icon = icon.replace('width="' + (feature.get('size') * 2) + 'px"', 'width="' + (feature.get('size') * svgRatio) + 'px"');
            icon = icon.replace('height="' + (feature.get('size') * 2) + 'px"', 'height="' + (feature.get('size') * svgRatio) + 'px"');
            const toBTOA = window.btoa(icon);
            const finalTienda = 'data:image/svg+xml;base64,' + toBTOA;
            result += '"type" : "point", "fillColor":"#FF0000", "fillOpacity":0,"graphicOpacity": 1.0, "graphicFormat": "image/svg+xml", "externalGraphic" : "' + finalTienda + '"}]},';
          } else {
            result += '"type" : "point",  "fillColor":"' + feature.getStyle().getImage().getFill().getColor() +
              '", "fillOpacity":1, "strokeColor": "#FFFFFF", "strokeOpacity":1, "strokeWidth": 0, "strokeLinecap": "round", "rotation": "0",' +
              '"pointRadius": ' + (feature.getStyle().getImage().getRadius() * ratioPhysic) + '}]},';
          }
        }
      } else {
        switch (feature.getStyle().strokeEnd) {
          case 'circle':
            result += '"type" : "point",  "fillColor":"' + feature.getStyle().getImage().getFill().getColor() +
              '", "fillOpacity":1, "strokeColor": "#FFFFFF", "strokeOpacity":1, "strokeWidth":0, "strokeLinecap": "round", "rotation": "0",' +
              '"pointRadius": ' + feature.getStyle().getImage().getStroke().getWidth() + '}]},';
            break;
          case 'triangle':
          case 'square':
            let paso1 = '';
            if (feature.getStyle().strokeEnd == 'square') {
              paso1 = CuadradoSVG.replace(this.coding, '');
            } else {
              paso1 = TrianguloSVG.replace(this.coding, '');
            }
            const toATOB = window.atob(paso1);
            let paso2 = toATOB.toString();
            paso2 = paso2.replace(/<path/g, '<path fill="' + feature.getStyle().getImage().getFill().getColor() + '"');
            paso2 = paso2.replace(/<polygon/g, '<polygon fill="' + feature.getStyle().getImage().getFill().getColor() + '"');
            paso2 = paso2.replace(/<rect/g, '<rect fill="' + feature.getStyle().getImage().getFill().getColor() + '"');
            paso2 = paso2.replace(/width="10px"/g, 'width="' + (feature.getStyle().getImage().getStroke().getWidth() * svgRatio) + 'px"');
            paso2 = paso2.replace(/height="10px"/g, 'height="' + (feature.getStyle().getImage().getStroke().getWidth() * svgRatio) + 'px"');
            const toBTOA = window.btoa(paso2);
            const finalTienda = this.coding + toBTOA;
            // if (this.feature.getStyle().getImage() === null) {
            result += '"type" : "point", "fillColor":"#FF0000", "rotation": "' + this.radiansToDegrees_(feature.getStyle().getImage().getRotation()) + '", "fillOpacity":0,"graphicOpacity": 1.0,' +
              '"graphicFormat": "image/svg+xml", "externalGraphic" : "' + finalTienda +
              '"}]},';
            break;
          default:
            break;
        }
      }
    });
    result = result.substr(0, result.length - 1);
    result += '}';
    return result;
  }

  deletePrincipalFeature() {
    if (document.getElementById('styleToolsHTML') != null) {
      this.stylePlugin.destroyControl();
    }
  }

  radiansToDegrees_(radians) {
    const pi = Math.PI;
    return radians * (180 / pi);
  }

  changeProjectionPoint(arrayCoord, projectionOrigen, projectionDestino) {
    const arrayCoordo = arrayCoord;
    if (this.arrayDimension(arrayCoord, 1) > 1) {
      for (let i = 0; i < arrayCoord.length; i += 1) {
        arrayCoordo[i] = this.changeProjectionPoint(arrayCoordo[i], projectionOrigen, projectionDestino);
      }
      return arrayCoordo;
    }
    return ol.proj.transform(arrayCoordo, projectionOrigen, projectionDestino);
  }

  arrayDimension(arr, count) {
    let countputoSlim = count;
    if (arr[0].length != undefined) {
      countputoSlim += 1;
      return this.arrayDimension(arr[0], countputoSlim);
    }
    return countputoSlim;
  }

  rgbaToHex_(arrayColor) {
    const toHex = function(color) {
      let hex = Number(color).toString(16);
      if (hex.length < 2) {
        hex = '0' + hex;
      }
      return hex;
    };
    const red = toHex(arrayColor[0]);
    const green = toHex(arrayColor[1]);
    const blue = toHex(arrayColor[2]);
    return '#' + red + green + blue;
  }

  getNumberOfIdFeature() {
    return this.numberOfDrawFeatures;
  }
  getFeature() {
    return this.feature;
  }

  /**
   *
   *
   * @param {any} plugin
   * @returns
   * @memberof LocalLayers
   */
  equals(plugin) {
    if (plugin instanceof EditionTools) {
      return true;
    }
    return false;
  }
}

/**
 * Name to identify this plugin
 * @const
 * @type {string}
 * @public
 * @api stable
 */

EditionTools.NAME = 'EditionTools';
