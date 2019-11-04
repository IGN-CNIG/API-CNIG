/**
 * @module M/control/GeometryDrawControl
 */

import GeometryDrawImplControl from 'impl/geometrydrawcontrol';
import template from 'templates/geometrydraw';
import drawingTemplate from 'templates/drawing';
import downloadingTemplate from 'templates/downloading';
import shpWrite from 'shp-write';
import tokml from 'tokml';

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

    // facade control goes to impl as reference param
    impl.facadeControl = this;

    /**
     * Number of features drawn on current layer.
     */
    // this.numberOfDrawFeatures = 0;

    /**
     * Checks if point/line/polygon/text drawing tool is active.
     */
    this.isPointActive = false;
    this.isLineActive = false;
    this.isPolygonActive = false;
    // this.isTextActive = false;

    /**
     * Checks if edition tool is active.
     */
    this.isEditionActive = false;

    /**
     * Selected Mapea feature
     */
    this.feature = undefined;

    /**
     * Selection square
     * @type {M.feature}
     */
    this.square = undefined;

    /**
     * Current geometry type selected for drawing.
     */
    this.geometry = undefined; // Point, LineString, Polygon

    /**
     * Template that expands drawing tools with color and thickness options.
     */
    this.drawingTools = undefined;

    /**
     * Template with downloading format options.
     */
    this.downloadingTemplate = undefined;

    /**
     * Current color for drawing features.
     */
    this.currentColor = undefined;

    /**
     * Current line thickness (or circle radius) for drawing features.
     */
    this.currentThickness = undefined;

    /**
     * Current feature name/description text.
     */
    this.currentText = '';

    /**
     * Saves drawing layer ( __ draw__) from Mapea.
     */
    this.drawLayer = undefined;

    /**
     * OL vector source for draw interactions.
     */
    this.vectorSource = this.getImpl().newVectorSource(false);

    /**
     * Mapea layer where a square will be drawn around selected feature.
     */
    this.selectionLayer = new M.layer.Vector({
      name: 'selectLayer',
      source: this.getImpl().newVectorSource(true),
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
      this.createDownloadingTemplate();
      this.addEvents(html);
      success(html);
    });
  }

  /**
   * Creates template with download options.
   * @public
   * @function
   * @api
   */
  createDownloadingTemplate() {
    this.downloadingTemplate = M.template.compileSync(downloadingTemplate, { jsonp: true });
    this.downloadingTemplate.querySelector('button').addEventListener('click', this.downloadLayer.bind(this));
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
    this.currentText = this.drawingTools.querySelector('#featureName').value;

    this.drawingTools.querySelector('#colorSelector').addEventListener('change', this.styleChange.bind(this));
    this.drawingTools.querySelector('#thicknessSelector').addEventListener('change', this.styleChange.bind(this));
    this.drawingTools.querySelector('#featureName').addEventListener('input', this.styleChange.bind(this));
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
    html.querySelector('#cleanAll').addEventListener('click', this.deleteDrawnFeatures.bind(this));
    html.querySelector('#download').addEventListener('click', this.openDownloadOptions.bind(this));
    html.querySelector('#edit').addEventListener('click', this.editBtnClick.bind(this));
  }

  /**
   * Deletes all drawn features.
   * @public
   * @function
   * @api
   */
  deleteDrawnFeatures() {
    if (this.feature !== undefined) {
      this.deleteSingleFeature();
      this.deactivateDrawing();
    } else {
      this.deactivateDrawing();
      this.getImpl().deactivateSelection();
      this.drawLayer.removeFeatures(this.drawLayer.getFeatures());
      this.feature = undefined;
      this.geometry = undefined;
      this.selectionLayer.removeFeatures([this.square]);
      if (document.querySelector('#drawingtools>#featureInfo') !== null) {
        document.querySelector('#drawingtools>#featureInfo').style.display = 'none';
      }
    }
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
    this.selectionLayer.removeFeatures([this.square]);
    this.getImpl().deactivateSelection();
    this.getImpl().activateSelection();
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
    let lastBtnState;

    if (geometry === 'Point') {
      lastBtnState = this.isPointActive;
    } else if (geometry === 'LineString') {
      lastBtnState = this.isLineActive;
    } else {
      lastBtnState = this.isPolygonActive;
    }

    if (this.isEditionActive) {
      this.deactivateEdition();
      document.querySelector('#otherBtns>#edit').classList.remove('activeTool');
    }
    this.deactivateDrawing();

    switch (geometry) {
      case 'Point':
        if (lastBtnState) {
          this.geometry = undefined;
          this.isPointActive = false;
          document.getElementById('pointdrawing').classList.remove('activeTool');
        } else {
          this.isPointActive = true;
          this.geometry = geometry;
          document.getElementById('pointdrawing').classList.add('activeTool');
        }
        break;
      case 'LineString':
        if (lastBtnState) {
          this.geometry = undefined;
          this.isLineActive = false;
          document.getElementById('linedrawing').classList.remove('activeTool');
        } else {
          this.isLineActive = true;
          this.geometry = geometry;
          document.getElementById('linedrawing').classList.add('activeTool');
        }
        break;
      case 'Polygon':
        if (lastBtnState) {
          this.geometry = undefined;
          this.isPolygonActive = false;
          document.getElementById('polygondrawing').classList.remove('activeTool');
        } else {
          this.isPolygonActive = true;
          this.geometry = geometry;
          document.getElementById('polygondrawing').classList.add('activeTool');
        }
        break;
      default:
        break;
    }

    if (this.isPointActive || this.isLineActive || this.isPolygonActive) {
      document.querySelector('.m-geometrydraw').appendChild(this.drawingTools);
      this.addDrawInteraction();
      this.changeSquare();

      if (document.querySelector('#drawingtools>#featureInfo') !== null) {
        document.querySelector('#drawingtools>#featureInfo').style.display = 'none';
      }

      if (document.querySelector('.m-geometrydraw>#downloadFormat')) {
        document.querySelector('.m-geometrydraw').removeChild(this.downloadingTemplate);
      }
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
    if (this.isPointActive || this.isLineActive || this.isPolygonActive) {
      if (document.querySelector('.m-geometrydraw #drawingtools') !== null) {
        document.querySelector('.m-geometrydraw').removeChild(this.drawingTools);
      }

      this.map.getMapImpl().removeInteraction(this.draw);
      this.selectionLayer.removeFeatures([this.square]);
      this.feature = undefined;
      this.isPointActive = false;
      this.isLineActive = false;
      this.isPolygonActive = false;
      document.getElementById('pointdrawing').classList.remove('activeTool');
      document.getElementById('linedrawing').classList.remove('activeTool');
      document.getElementById('polygondrawing').classList.remove('activeTool');
    }
  }

  /**
   * Deactivates edition tool.
   * @public
   * @function
   * @api
   */
  deactivateEdition() {
    if (this.isEditionActive) {
      this.isEditionActive = false;
      this.getImpl().deactivateSelection();
      if (document.querySelector('#drawingtools>#featureInfo') !== null) {
        document.querySelector('#drawingtools>#featureInfo').style.display = 'none';
      }
    }
  }

  /**
   * Activates or deactivates feature selection & modify interaction.
   * Deactivates drawing if it's active.
   * @public
   * @function
   * @api
   */
  editBtnClick() {
    if (this.isEditionActive) {
      this.deactivateEdition();
      document.querySelector('#otherBtns>#edit').classList.remove('activeTool');
      this.isEditionActive = false;
    } else {
      this.deactivateDrawing();
      this.getImpl().activateSelection();
      this.isEditionActive = true;
      document.querySelector('#otherBtns>#edit').classList.add('activeTool');
      // document.querySelector('.m-geometrydraw').appendChild(this.drawingTools);
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
    this.currentText = document.querySelector('#featureName').value;

    switch (this.feature.getGeometry().type) {
      case 'Point':
        const newPointStyle = new M.style.Point({
          radius: this.currentThickness,
          fill: {
            color: this.currentColor,
          },
          stroke: {
            color: 'white',
            width: 2,
          },
          label: {
            text: this.currentText,
          },
        });
        if (this.feature !== undefined) this.feature.setStyle(newPointStyle);
        break;
      case 'LineString':
        const newLineStyle = new M.style.Line({
          stroke: {
            color: this.currentColor,
            width: this.currentThickness,
          },
          label: {
            text: this.currentText,
          },
        });
        if (this.feature !== undefined) this.feature.setStyle(newLineStyle);
        break;
      case 'Polygon':
        const newPolygonStyle = new M.style.Polygon({
          fill: {
            color: this.currentColor,
            opacity: 0.2,
          },
          stroke: {
            color: this.currentColor,
            width: this.currentThickness,
          },
          label: {
            text: this.currentText,
          },
        });
        if (this.feature !== undefined) this.feature.setStyle(newPolygonStyle);
        break;
      default:
        break;
    }
  }

  /**
   * Gets given feature thickness.
   * @public
   * @function
   * @api
   * @param {*} feature - Mapea feature
   */
  getFeatureThickness(feature) {
    if (feature.getGeometry().type === 'Point') {
      return feature.getStyle().get('radius');
    }
    return feature.getStyle().get('stroke.width');
  }

  /**
   * Gets given feature color.
   * @public
   * @function
   * @api
   * @param {*} feature - Mapea feature
   */
  getFeatureColor(feature) {
    if (feature.getGeometry().type === 'Point') {
      return feature.getStyle().get('fill.color');
    }
    return feature.getStyle().get('stroke.color');
  }

  /**
   * Gets given feature label.
   * @public
   * @function
   * @api
   * @param {*} feature - Mapea feature
   */
  getFeatureText(feature) {
    return feature.getStyle().get('label.text') || '';
  }

  /**
   * Updates input values with selected feature values.
   * @public
   * @function
   * @api
   */
  updateInputValues() {
    this.geometry = this.feature.getGeometry().type;
    this.currentColor = this.getFeatureColor(this.feature);
    this.currentThickness = this.getFeatureThickness(this.feature);
    this.currentText = this.getFeatureText(this.feature);
    this.drawingTools.querySelector('#colorSelector').value = this.currentColor;
    this.drawingTools.querySelector('#thicknessSelector').value = this.currentThickness;
    this.drawingTools.querySelector('#featureName').value = this.currentText;
  }

  /**
   * Adds style and source to vector layer.
   * Adds selection layer to map.
   * @public
   * @function
   * @api
   */
  initializeLayers() {
    this.drawLayer = this.map.getLayers()[this.map.getLayers().length - 1];
    this.map.addLayers(this.selectionLayer);
    this.getImpl().setOLSource(this.drawLayer, this.vectorSource);
  }

  /**
   * This function adds draw interaction to map.
   * @public
   * @function
   * @api
   */
  addDrawInteraction() {
    const olMap = this.map.getMapImpl();
    this.draw = this.getImpl().newDrawInteraction(this.vectorSource, this.geometry);
    this.addDrawEvent();
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
      this.feature = event.feature;
      this.feature = M.impl.Feature.olFeature2Facade(this.feature);

      if (this.geometry === 'Point') {
        this.feature.setStyle(new M.style.Point({
          radius: this.currentThickness,
          fill: {
            color: this.currentColor,
          },
          stroke: {
            color: 'white',
            width: 2,
          },
        }));
      } else if (this.geometry === 'LineString') {
        this.feature.setStyle(new M.style.Line({
          stroke: {
            color: this.currentColor,
            width: this.currentThickness,
          },
        }));
      } else {
        this.feature.setStyle(new M.style.Polygon({
          fill: {
            color: this.currentColor,
            opacity: 0.2,
          },
          stroke: {
            color: this.currentColor,
            width: this.currentThickness,
          },
        }));
      }

      this.map.getLayers()[this.map.getLayers().length - 1].addFeatures(this.feature);
      this.changeSquare();
      this.showFeatureInfo();
    });
  }

  /**
   * On select, shows feature info.
   * @public
   * @function
   * @api
   */
  showFeatureInfo() {
    const olFeature = this.feature.getImpl().getOLFeature();
    const infoContainer = document.querySelector('#drawingtools>#featureInfo');
    if (document.querySelector('#drawingtools>#featureInfo') !== null) {
      document.querySelector('#drawingtools>#featureInfo').style.display = 'block';
    }
    if (infoContainer !== null) infoContainer.innerHTML = '';

    switch (this.geometry) {
      case 'Point':
        const x = this.getImpl().getFeatureCoordinates(olFeature)[0];
        const y = this.getImpl().getFeatureCoordinates(olFeature)[1];
        infoContainer.innerHTML = `Coordenadas<br/>
        x: ${Math.round(x * 1000) / 1000},<br/>
        y: ${Math.round(y * 1000) / 1000}`;
        break;
      case 'LineString':
        let lineLength = this.getImpl().getFeatureLength(olFeature);
        let units = 'km';
        if (lineLength > 100) {
          lineLength = Math.round((lineLength / 1000) * 100) / 100;
        } else {
          lineLength = Math.round(lineLength * 100) / 100;
          units = 'm';
        }
        infoContainer.innerHTML = `Longitud: ${lineLength} ${units}`;
        break;
      case 'Polygon':
        let area = this.getImpl().getFeatureArea(olFeature);
        let areaUnits = `km${'2'.sup()}`;
        if (area > 10000) {
          area = Math.round((area / 1000000) * 100) / 100;
        } else {
          area = Math.round(area * 100) / 100;
          areaUnits = `m${'2'.sup()}`;
        }
        infoContainer.innerHTML = `Área: ${area} ${areaUnits}`;
        break;
      default:
        if (document.querySelector('#drawingtools>#featureInfo') !== null) {
          document.querySelector('#drawingtools>#featureInfo').style.display = 'none';
        }
        break;
    }
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
  changeSquare() {
    this.square = null;
    this.selectionLayer.removeFeatures(this.selectionLayer.getFeatures());
    if (this.feature) {
      if (this.geometry === 'Point' || this.geometry === 'MultiPoint') {
        // eslint-disable-next-line no-underscore-dangle
        const thisOLfeat = this.feature.getImpl().olFeature_;
        const OLFeatClone = thisOLfeat.clone();
        this.square = M.impl.Feature.olFeature2Facade(OLFeatClone);

        this.square.setStyle(new M.style.Point({
          radius: 20,
          stroke: {
            color: '#FF0000',
            width: 2,
          },
        }));
      } else {
        // eslint-disable-next-line no-underscore-dangle
        const extent = this.feature.getImpl().olFeature_.getGeometry().getExtent();
        this.square = M.impl.Feature.olFeature2Facade(this.getImpl().newPolygonFeature(extent));
        this.square.setStyle(new M.style.Line({
          stroke: {
            color: '#FF0000',
            width: 2,
          },
        }));
      }
      this.selectionLayer.addFeatures([this.square]);
    }
  }

  /**
   * Opens download template
   * @public
   * @function
   * @api
   */
  openDownloadOptions() {
    if (this.drawLayer.getFeatures().length !== 0) {
      if (this.isEditionActive) {
        this.deactivateEdition();
        document.querySelector('#otherBtns>#edit').classList.remove('activeTool');
      }
      this.deactivateDrawing();
      document.querySelector('.m-geometrydraw').appendChild(this.downloadingTemplate);
    } else {
      M.dialog.info('La capa de dibujo está vacía.');
    }
  }

  /**
   * Downloads draw layer as GeoJSON, kml or gml.
   * @public
   * @function
   * @api
   */
  downloadLayer() {
    const downloadFormat = this.downloadingTemplate.querySelector('select').value;
    const olFeatures = this.drawLayer.getImpl().getOL3Layer().getSource().getFeatures();
    const geojsonLayer = this.drawLayer.toGeoJSON();
    let arrayContent;
    let mimeType;
    let extensionFormat;

    switch (downloadFormat) {
      case 'geojson':
        arrayContent = JSON.stringify(geojsonLayer);
        mimeType = 'json';
        extensionFormat = 'geojson';
        break;
      case 'kml': // FIXME: take to Impl
        arrayContent = tokml(geojsonLayer);
        // const kmlFormat = new ol.format.KML();
        // arrayContent = kmlFormat.writeFeatures(olFeatures, {
        //   decimals: 3,
        //   featureProjection: 'EPSG:3857', // map.getView().getProjection()
        // });
        mimeType = 'xml';
        extensionFormat = 'kml';
        break;
      case 'gml':
        const gmlFormat = new ol.format.GML3(); // Cannot read property 'undefined' of undefined
        // const gmlFormat = new ol.format.GML2(); // Failed to execute 'serializeToString' on
        // 'XMLSerializer': parameter 1 is not of type 'Node'.
        // const gmlFormat = new ol.format.GML(); // Cannot read property 'undefined' of undefined
        // const gmlFormat = new ol.format.GML32(); // is not a constructor
        arrayContent = gmlFormat.writeFeatures(olFeatures, {
          featureProjection: 'EPSG:3857',
          featureNS: 'http://abcdef.xyz/dummy', // Namespace used for feature attributes.
          featureType: 'dummy',
        });
        mimeType = 'xml';
        extensionFormat = 'gml';
        break;
      case 'shp':
        const json = geojsonLayer;
        const options = {
          folder: this.layer,
          types: {
            point: this.layer,
            polygon: this.layer,
            line: this.layer,
          },
        };
        shpWrite.download(json, options);
        break;
      default:
        M.dialog.error('No se ha seleccionado formato de descarga.');
        break;
    }

    if (downloadFormat !== 'shp') {
      const url = window.URL.createObjectURL(new window.Blob([arrayContent], {
        type: `application/${mimeType}`,
      }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${this.layer}.${extensionFormat}`);
      document.body.appendChild(link);
      link.click();
    }

    document.querySelector('.m-geometrydraw').removeChild(this.downloadingTemplate);
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
    return control instanceof GeometryDrawControl;
  }
}
