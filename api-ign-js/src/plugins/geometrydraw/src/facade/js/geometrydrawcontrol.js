/**
 * @module M/control/GeometryDrawControl
 */

import GeometryDrawImplControl from 'impl/geometrydrawcontrol';
import template from 'templates/geometrydraw';
import drawingTemplate from 'templates/drawing';

export default class GeometryDrawControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor() {
    if (M.utils.isUndefined(GeometryDrawImplControl)) {
      M.exception('La implementación usada no puede crear controles GeometryDrawControl');
    }
    const impl = new GeometryDrawImplControl();
    super(impl, 'GeometryDraw');

    /**
     * Number of features drawn on current layer.
     */
    this.numberOfDrawFeatures = 0;

    /**
     * Check if click on point/line/polygon button is
     * activation click (true) or deactivation click (false).
     */
    this.oddPointClick = undefined;
    this.oddLineClick = undefined;
    this.oddPolygonClick = undefined;

    /**
     * Selected feature
     */
    this.feature = undefined;

    /**
     * Selection square
     * @type {M.feature}
     */
    this.square = undefined;

    /**
     * Current geometry selected.
     */
    this.geometry = undefined; // Point, LineString, Polygon

    /**
     * Template that expands drawing tools with color and thickness options.
     */
    this.drawingTools = undefined;

    /**
     * Current color for drawing features.
     */
    this.currentColor = undefined;

    /**
     * Current line thickness (or circle radius) for drawing features.
     */
    this.currentThickness = undefined;

    /**
     * Saves drawing layer ( __ draw__) from Mapea.
     */
    this.drawLayer = undefined;

    /**
     * OL vector source for draw interactions.
     */
    this.vectorSource = undefined;

    /**
     * Style for vector layer
     */
    this.vectorStyle = undefined;

    /**
     * Mapea layer where a square will be drawn around selected feature.
     */
    this.selectionLayer = new M.layer.Vector({
      name: 'selectLayer',
      source: this.getImpl().newVectorSourceWithCollectionFeatures(),
    });
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
      const html = M.template.compileSync(template);
      this.initializeLayers();
      this.createDrawingTemplate();
      this.addEvents(html);
      success(html);
    });
  }

  /**
   * Creates template with drawing options.
   * @public
   * @function
   * @api
   */
  createDrawingTemplate() {
    this.drawingTools = M.template.compileSync(drawingTemplate, { jsonp: true });

    this.currentColor = this.drawingTools.querySelector('#colorSelector').value;
    this.currentThickness = this.drawingTools.querySelector('#thicknessSelector').value;

    this.drawingTools.querySelector('#colorSelector').addEventListener('change', this.styleChange.bind(this));
    this.drawingTools.querySelector('#thicknessSelector').addEventListener('change', this.styleChange.bind(this));
  }

  /**
   * Adds event listeners to geometry buttons.
   * @public
   * @function
   * @api
   * @param {String} html - Geometry buttons template.
   */
  addEvents(html) {
    html.querySelector('#pointdrawing').addEventListener('click', (e) => {
      this.geometryBtnClick('Point');
    });
    html.querySelector('#linedrawing').addEventListener('click', (e) => {
      this.geometryBtnClick('LineString');
    });
    html.querySelector('#polygondrawing').addEventListener('click', (e) => {
      this.geometryBtnClick('Polygon');
    });
    html.querySelector('#cleanAll').addEventListener('click', this.cleanDrawnFeatures.bind(this));
    html.querySelector('#download').addEventListener('click', this.download.bind(this));
  }

  /**
   * Deletes all drawn features.
   * @public
   * @function
   * @api
   */
  cleanDrawnFeatures() {
    this.drawLayer.removeFeatures(this.drawLayer.getFeatures());
    this.selectionLayer.removeFeatures([this.square]);
  }

  /**
   * Shows/hides drawing template and
   * adds/removes draw interaction.
   * @public
   * @function
   * @api
   * @param {String} geometry - clicked button geometry type
   */
  geometryBtnClick(geometry) {
    const lastGeometry = this.geometry;
    let oddOrNot;
    this.geometry = geometry;

    switch (geometry) {
      case 'Point':
        oddOrNot = this.oddPointClick;
        this.oddPointClick = this.oddPointClick === false;
        break;
      case 'LineString':
        oddOrNot = this.oddLineClick;
        this.oddLineClick = this.oddLineClick === false;
        break;
      case 'Polygon':
        oddOrNot = this.oddPolygonClick;
        this.oddPolygonClick = this.oddPolygonClick === false;
        break;
      default:
        break;
    }

    // button is clicked for the 1st time
    if (oddOrNot || oddOrNot === undefined) {
      // resets last used geometry button counter
      // to avoid conflicts if two buttons are clicked consecutively
      if (document.querySelector('.m-geometrydraw').querySelector('#drawingtools') !== null) {
        if (lastGeometry === 'Point') {
          this.oddPointClick = true;
        } else if (lastGeometry === 'LineString') {
          this.oddLineClick = true;
        } else {
          this.oddPolygonClick = true;
        }
        this.deleteOnClickEvent();
        // FIXME: unselect last feature
      }
      document.querySelector('.m-geometrydraw').appendChild(this.drawingTools);
      this.addOnClickEvent();
    } else { // button is clicked for the 2nd time
      document.querySelector('.m-geometrydraw').removeChild(this.drawingTools);
      this.deleteOnClickEvent();
      this.selectionLayer.removeFeatures([this.square]);
      this.feature = undefined;
    }
  }

  /**
   * Changes style of current feature.
   * @public
   * @function
   * @api
   */
  styleChange() {
    this.currentColor = document.querySelector('#colorSelector').value;
    this.currentThickness = document.querySelector('#thicknessSelector').value;

    switch (this.geometry) {
      case 'Point':
        const newPointStyle = this.getImpl().newOLCircleStyle({
          radius: this.currentThickness,
          strokeColor: 'white',
          strokeWidth: 2,
          fillColor: this.currentColor,
        });
        if (this.feature !== undefined) this.feature.setStyle(newPointStyle);
        break;
      case 'LineString':
        const newLineStyle = this.getImpl()
          .newSimpleLineStyle(this.currentColor, this.currentThickness);
        if (this.feature !== undefined) this.feature.setStyle(newLineStyle);
        break;
      case 'Polygon':
        const newPolygonStyle = this.getImpl().newPolygonStyle({
          fillColor: 'rgba(255, 255, 255, 0.2)',
          strokeColor: this.currentColor,
          strokeWidth: this.currentThickness,
        });
        if (this.feature !== undefined) this.feature.setStyle(newPolygonStyle);
        break;
      default:
        break;
    }
  }

  /**
   * Refreshes number of drawn features.
   * Adds style and source to vector layer.
   * Adds selection layer to map.
   * @public
   * @function
   * @api
   */
  initializeLayers() {
    if (this.numberOfDrawFeatures === 0) {
      this.numberOfDrawFeatures = this.map.getLayers()[this.map.getLayers().length - 1]
        .getFeatures().length;
    }
    this.drawLayer = this.map.getLayers()[this.map.getLayers().length - 1];
    this.vectorSource = this.getImpl().newVectorSource();

    // default layer styles
    this.vectorStyle = this.getImpl().newOLStyle({
      fillColor: 'rgba(255, 255, 255, 0.2)',
      strokeColor: '#71a7d3',
      strokeWidth: 2,
      circleRadius: 7,
      circleFill: '#71a7d3',
    });
    this.map.addLayers(this.selectionLayer);
    this.drawLayer.setStyle(this.vectorStyle);
    this.getImpl().setOLSource(this.drawLayer, this.vectorSource);
  }

  /**
   * This function adds draw interaction to map.
   * @public
   * @function
   * @api
   */
  addOnClickEvent() {
    const olMap = this.map.getMapImpl();
    if (this.geometry !== 'Text') {
      // creates new draw interaction
      this.draw = this.getImpl().newDrawInteraction(this.vectorSource, this.geometry);
      // saves new feature (on draw ending)
      this.addDrawEvent();
    } else {
      this.draw = this.getImpl().newDrawInteraction(this.vectorSource, 'Point');
      this.draw.on('drawend', (event) => {
        const feature = event.feature;
        this.setContent_(feature);
      });
    }
    olMap.addInteraction(this.draw);
  }

  /**
   * Defines function to be executed on click on draw interaction.
   * Creates feature with drawing and adds it to map.
   * @public
   * @function
   * @api
   */
  addDrawEvent() {
    this.draw.on('drawend', (event) => {
      // creates OL feature
      this.feature = event.feature;
      // this.feature.set('name', this.feature.getId());
      // this.feature.setId(`draw-${this.numberOfDrawFeatures}`);
      // this.numberOfDrawFeatures += 1;

      // sets OL style to OL feature
      if (this.geometry === 'Point') {
        this.feature.setStyle(this.getImpl().newOLCircleStyle({
          radius: this.currentThickness || 6,
          strokeColor: 'white',
          strokeWidth: 2,
          fillColor: this.currentColor || '#71a7d3',
        }));
      } else if (this.geometry === 'LineString') {
        this.feature.setStyle(this.getImpl().newSimpleLineStyle(
          this.currentColor,
          this.currentThickness,
        ));
      } else { // Polygon
        this.feature.setStyle(this.getImpl().newPolygonStyle({
          fillColor: 'rgba(255, 255, 255, 0.2)',
          strokeColor: this.currentColor,
          strokeWidth: this.currentThickness,
        }));
      }

      // turns OL feature to Mapea feature & adds it to draw layer
      const featureMapea = this.getImpl().OLToMapeaFeature(this.feature);
      this.map.getLayers()[this.map.getLayers().length - 1].addFeatures(featureMapea);
      // this.setFeature(featureMapea.getImpl().getOLFeature());
      this.setFeature(this.feature);
    });
  }

  /**
   * Sets text content on feature
   * @public
   * @function
   * @api
   * @param {*} feature - OL feature
   */
  setContent_(feature) {
    feature.setStyle(this.getImpl().newOLTextStyle({
      text: 'Texto',
      font: '12px Arial',
      textFillColor: '#000000',
      defaultColor: 'rgba(213, 0, 110, 0)',
      strokeWidth: 0,
    }));
    this.feature = feature;
    this.feature.setId(`draw-${this.numberOfDrawFeatures}`);
    this.numberOfDrawFeatures += 1;
    this.feature.set('name', this.feature.getId());
    const featureMapea = this.getImpl().OLToMapeaFeature(this.feature);
    this.map.getLayers()[this.map.getLayers().length - 1].addFeatures(featureMapea);
    // this.setFeature(featureMapea.getImpl().getOLFeature());
    this.setFeature(this.feature);
  }

  /**
   * Removes draw interaction from map.
   */
  deleteOnClickEvent() {
    this.map.getMapImpl().removeInteraction(this.draw);
  }

  /**
   * Clears selection layer.
   * Draws square around feature and adds it to selection layer.
   * For points:
   *    If feature doesn't have style, sets new style.
   */
  changeSquare() {
    this.square = null;
    this.selectionLayer.removeFeatures(this.selectionLayer.getFeatures());
    if (this.feature.getGeometry().getType() === 'Point' ||
      this.feature.getGeometry().getType() === 'MultiPoint') {
      // this.square is born being a OL feature
      this.square = this.getImpl().cloneFeature(this.feature.getGeometry().clone());
      this.square.setStyle(this.getImpl().newRegularShapeStyle({
        strokeColor: '#FF0000',
        strokeWidth: 2,
        points: 4,
        radius: 25,
        rotation: Math.PI / 4,
      }));
    } else {
      const extent = this.feature.getGeometry().getExtent();
      this.square = this.getImpl().newPolygonFeature(extent);
      this.square.setStyle(this.getImpl().newSimpleLineStyle('#FF0000', 2));
    }
    // this.square is now a Mapea feature
    this.square = this.getImpl().OLToMapeaFeature(this.square);
    this.selectionLayer.addFeatures([this.square]);
  }

  /**
   * Updates current feature var.
   * Adds selection square to feature.
   * @param {*} feature - OL feature
   */
  setFeature(feature) {
    this.feature = feature;
    this.changeSquare();
  }

  // radiansToDegrees_(radians) {
  //   const pi = Math.PI;
  //   return radians * (180 / pi);
  // }

  // changeProjectionPoint(arrayCoord, projectionOrigen, projectionDestino) {
  //   const arrayCoordo = arrayCoord;
  //   if (this.arrayDimension(arrayCoord, 1) > 1) {
  //     for (let i = 0; i < arrayCoord.length; i += 1) {
  //       arrayCoordo[i] = this
  //         .changeProjectionPoint(arrayCoordo[i], projectionOrigen, projectionDestino);
  //     }
  //     return arrayCoordo;
  //   }
  //   return ol.proj.transform(arrayCoordo, projectionOrigen, projectionDestino);
  // }

  // arrayDimension(arr, count) {
  //   let countputoSlim = count;
  //   if (arr[0].length !== undefined) {
  //     countputoSlim += 1;
  //     return this.arrayDimension(arr[0], countputoSlim);
  //   }
  //   return countputoSlim;
  // }

  // rgbaToHex_(arrayColor) {
  //   const toHex = (color) => {
  //     let hex = Number(color).toString(16);
  //     if (hex.length < 2) {
  //       hex = `0${hex}`;
  //     }
  //     return hex;
  //   };
  //   const red = toHex(arrayColor[0]);
  //   const green = toHex(arrayColor[1]);
  //   const blue = toHex(arrayColor[2]);
  //   return `#${red}${green}${blue}`;
  // }

  // getNumberOfIdFeature() {
  //   return this.numberOfDrawFeatures;
  // }
  // getFeature() {
  //   return this.feature;
  // }

  /* LAYER DOWNLOAD METHODS */

  download() {
    if (this.drawLayer.getFeatures().length !== 0) {
      const json = JSON.stringify(this.drawLayer.toGeoJSON());
      // const json = JSON.stringify(this.turnMultiGeometriesSimple(this.drawLayer.toGeoJSON()));
      const url = window.URL.createObjectURL(new window.Blob([json], { type: 'application/json' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${this.layer}.json`);
      document.body.appendChild(link);
      link.click();
    } else {
      M.dialog.info('La capa de dibujo está vacía.');
    }
  }


  // /**
  //  * This function turns multigeometries into several simple geometries
  //  * @public
  //  * @function
  //  * @param json - geojson
  //  * @api
  //  */
  // turnMultiGeometriesSimple(json) {
  //   const newJson = {
  //     type: json.type,
  //     // totalFeatures: json.totalFeatures,
  //     features: [],
  //   };
  //   json.features.forEach((feature) => {
  //     const newFeature = {
  //       type: feature.type,
  //       id: feature.id,
  //       geometry: {
  //         type: '',
  //         coordinates: [],
  //       },
  //       // geometry_name: feature.geometry_name,
  //       properties: feature.properties,
  //     };

  //     switch (feature.geometry.type) {
  //       case 'MultiPoint':
  //         newFeature.geometry.type = 'Point';
  //         break;
  //       case 'MultiLineString':
  //         newFeature.geometry.type = 'LineString';
  //         break;
  //       case 'MultiPolygon':
  //         newFeature.geometry.type = 'Polygon';
  //         break;
  //       default:
  //         newFeature.geometry.type = feature.geometry.type;
  //     }

  //     if (feature.geometry.type === 'MultiPoint' ||
  //       feature.geometry.type === 'MultiLineString' ||
  //       feature.geometry.type === 'MultiPolygon') {
  //       feature.geometry.coordinates.forEach((multiElement) => {
  //         multiElement.forEach((element) => {
  //           newFeature.geometry.coordinates[0] = element;
  //           newJson.features.push(newFeature);
  //         });
  //       });
  //     } else {
  //       newFeature.geometry.coordinates = feature.geometry.coordinates;
  //       newJson.features.push(newFeature);
  //     }
  //   });

  //   return newJson;
  // }

  /**
   * This function compares controls
   *
   * @public
   * @function
   * @param {M.Control} control to compare
   * @api stable
   */
  equals(control) {
    return control instanceof GeometryDrawControl;
  }
}
