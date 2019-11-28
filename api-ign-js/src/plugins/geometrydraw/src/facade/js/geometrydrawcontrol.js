/**
 * @module M/control/GeometryDrawControl
 */

import GeometryDrawImplControl from 'impl/geometrydrawcontrol';
import template from 'templates/geometrydraw';
import drawingTemplate from 'templates/drawing';
import textDrawTemplate from 'templates/textdraw';
import downloadingTemplate from 'templates/downloading';
import uploadingTemplate from 'templates/uploading';
import shpWrite from 'shp-write';
import tokml from 'tokml';
import * as shp from 'shpjs';

const DEFAULT_TEXT = 'Texto';
const DEFAULT_FONT_COLOR = '#71a7d3';
const DEFAULT_FONT_FAMILY = 'Arial';
const DEFAULT_SIZE = 12;

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
     * Checks if point drawing tool is active.
     * @private
     * @type {Boolean}
     */
    this.isPointActive = false;

    /**
     * Checks if line drawing tool is active.
     * @private
     * @type {Boolean}
     */
    this.isLineActive = false;

    /**
     * Checks if polygon drawing tool is active.
     * @private
     * @type {Boolean}
     */
    this.isPolygonActive = false;

    /**
     * Checks if text drawing tool is active.
     * @private
     * @type {Boolean}
     */
    this.isTextActive = false;

    /**
     * Checks if edition tool is active.
     * @private
     * @type {Boolean}
     */
    this.isEditionActive = false;

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
     * Template with downloading format options.
     * @private
     * @type {String}
     */
    this.downloadingTemplate = undefined;

    /**
     * Template with uploading format options.
     * @private
     * @type {String}
     */
    this.uploadingTemplate = undefined;

    /**
     * Template with text feature drawing tools.
     * @private
     * @type {String}
     */
    this.textDrawTemplate = undefined;

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
     * Current feature name / description text.
     * @private
     * @type {String}
     */
    this.textContent = 'Texto';

    /**
     * Current text feature font color.
     * @private
     * @type {String}
     */
    this.fontColor = '#F00';

    /**
     * Current text feature font size.
     * @private
     * @type {String}
     */
    this.fontSize = '12';

    /**
     * Current text feature font family.
     * @private
     * @type {String}
     */
    this.fontFamily = 'Verdana';

    /**
     * Saves drawing layer ( __ draw__) from Mapea.
     * @private
     * @type {*} - Mapea layer
     */
    this.drawLayer = undefined;

    /**
     * OL vector source for draw interactions.
     * @private
     * @type {*} - OpenLayers vector source
     */
    this.vectorSource = this.getImpl().newVectorSource(false);

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
      this.createTextDrawTemplate();
      this.createDownloadingTemplate();
      this.createUploadingTemplate();
      this.addEvents(html);
      success(html);
    });
  }

  /**
   * Creates text drawing options template.
   *
   * @public
   * @function
   * @api
   */
  createTextDrawTemplate() {
    this.textDrawTemplate = M.template.compileSync(textDrawTemplate, { jsonp: true });

    this.textContent = this.textDrawTemplate.querySelector('#textContent').value;
    this.fontColor = this.textDrawTemplate.querySelector('#fontColor').value;
    this.fontSize = this.textDrawTemplate.querySelector('#fontSize').value;
    this.fontFamily = this.textDrawTemplate.querySelector('#fontFamily').value;

    this.textDrawTemplate.querySelector('#textContent').addEventListener('input', e => this.styleChange(e));
    this.textDrawTemplate.querySelector('#fontColor').addEventListener('change', e => this.styleChange(e));
    this.textDrawTemplate.querySelector('#fontSize').addEventListener('change', e => this.styleChange(e));
    this.textDrawTemplate.querySelector('#fontFamily').addEventListener('change', e => this.styleChange(e));

    this.textDrawTemplate.querySelector('button').addEventListener('click', this.deleteSingleFeature.bind(this));
    this.textDrawTemplate.querySelector('button').style.display = 'none';
  }

  /**
   * Creates download options template.
   * @public
   * @function
   * @api
   */
  createDownloadingTemplate() {
    this.downloadingTemplate = M.template.compileSync(downloadingTemplate, { jsonp: true });
    this.downloadingTemplate.querySelector('button').addEventListener('click', this.downloadLayer.bind(this));
  }

  /**
   * Creates upload options template.
   *
   * @public
   * @function
   * @api
   */
  createUploadingTemplate() {
    const accept = '.kml, .zip, .gpx, .geojson';
    this.uploadingTemplate = M.template.compileSync(uploadingTemplate, {
      jsonp: true,
      vars: { accept },
    });
    const inputFile = this.uploadingTemplate.querySelector('#geometrydraw-uploading>input');
    this.loadBtn_ = this.uploadingTemplate.querySelector('#geometrydraw-uploading button');
    inputFile.addEventListener('change', evt => this.changeFile(evt, inputFile.files[0]));
    this.loadBtn_.addEventListener('click', () => {
      this.loadLayer();
    });
    this.loadBtn_.setAttribute('disabled', 'disabled');
  }

  /**
   * Creates drawing options template.
   * @public
   * @function
   * @api
   */
  createDrawingTemplate() {
    this.drawingTools = M.template.compileSync(drawingTemplate, { jsonp: true });

    this.currentColor = this.drawingTools.querySelector('#colorSelector').value;
    this.currentThickness = this.drawingTools.querySelector('#thicknessSelector').value;

    this.drawingTools.querySelector('#colorSelector').addEventListener('change', e => this.styleChange(e));
    this.drawingTools.querySelector('#thicknessSelector').addEventListener('change', e => this.styleChange(e));
    this.drawingTools.querySelector('button').addEventListener('click', () => this.deleteSingleFeature());

    this.drawingTools.querySelector('button').style.display = 'none';
  }

  /**
   * Adds event listeners to geometry buttons.
   * @public
   * @function
   * @api
   * @param {String} html - Geometry buttons template.
   */
  addEvents(html) {
    html.querySelector('#pointdrawing').addEventListener('click', e => this.geometryBtnClick('Point'));
    html.querySelector('#linedrawing').addEventListener('click', e => this.geometryBtnClick('LineString'));
    html.querySelector('#polygondrawing').addEventListener('click', e => this.geometryBtnClick('Polygon'));
    html.querySelector('#textdrawing').addEventListener('click', e => this.geometryBtnClick('Text'));
    html.querySelector('#cleanAll').addEventListener('click', () => this.deleteDrawnFeatures());
    html.querySelector('#download').addEventListener('click', () => this.openDownloadOptions());
    html.querySelector('#upload').addEventListener('click', () => this.openUploadOptions());
    html.querySelector('#edit').addEventListener('click', () => this.editBtnClick());
  }

  /**
   * Hides tools menu.
   * @param {*} property - isPointActive
   * @param {*} idDraw - pointdrawing
   * @param {*} geometry
   */
  activationManager(clickedGeometry, drawingDiv, geometry) {
    // if drawing is active
    if (this[clickedGeometry]) {
      this.deactivateDrawing();
      this.geometry = undefined;
      this[clickedGeometry] = false;
      document.getElementById(drawingDiv).classList.remove('activeTool');
    } else {
      this.deactivateDrawing();
      this[clickedGeometry] = true;
      this.geometry = geometry;
      document.getElementById(drawingDiv).classList.add('activeTool');

      if (document.getElementById('drawingtools') !== null) {
        document.getElementById('drawingtools').remove();
      } else if (document.getElementById('textdrawtools') !== null) {
        document.getElementById('textdrawtools').remove();
      } else if (document.getElementById('geometrydraw-uploading') !== null) {
        document.getElementById('geometrydraw-uploading').remove();
      }
    }
  }

  /**
   * Shows/hides tools template and
   * adds/removes draw interaction.
   * @public
   * @function
   * @api
   * @param {String} geometry - clicked button geometry type
   */
  geometryBtnClick(geometry) {
    if (this.isEditionActive) {
      this.deactivateEdition();
      document.querySelector('#otherBtns>#edit').classList.remove('activeTool');
    }

    switch (geometry) {
      case 'Point':
        this.activationManager('isPointActive', 'pointdrawing', geometry);
        break;
      case 'LineString':
        this.activationManager('isLineActive', 'linedrawing', geometry);
        break;
      case 'Polygon':
        this.activationManager('isPolygonActive', 'polygondrawing', geometry);
        break;
      case 'Text':
        this.activationManager('isTextActive', 'textdrawing', 'Point');
        break;
      default:
    }

    this.createDrawingTemplate();

    if (this.isPointActive || this.isLineActive || this.isPolygonActive || this.isTextActive) {
      if (this.isTextActive) {
        this.textDrawTemplate.querySelector('#textContent').value = '';
        this.textDrawTemplate.querySelector('button').style.display = 'none';
        document.querySelector('.m-geometrydraw').appendChild(this.textDrawTemplate);
      } else {
        this.drawingTools.querySelector('button').style.display = 'none';
        document.querySelector('.m-geometrydraw').appendChild(this.drawingTools);
      }

      this.addDrawInteraction();

      if (document.querySelector('#drawingtools #featureInfo') !== null) {
        document.querySelector('#drawingtools #featureInfo').style.display = 'none';
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
    if (this.isPointActive || this.isLineActive || this.isPolygonActive || this.isTextActive) {
      if (document.querySelector('.m-geometrydraw #drawingtools') !== null) {
        document.querySelector('.m-geometrydraw').removeChild(this.drawingTools);
      } else if (document.querySelector('.m-geometrydraw #textdrawtools') !== null) {
        document.querySelector('.m-geometrydraw').removeChild(this.textDrawTemplate);
      }

      this.map.getMapImpl().removeInteraction(this.draw);
      this.selectionLayer.removeFeatures([this.emphasis]);
      if ((this.feature !== undefined) && this.feature.getStyle().get('label') !== undefined) {
        this.feature.getStyle().set('fill.opacity', 0);
      }

      this.feature = undefined;
      this.isPointActive = false;
      this.isLineActive = false;
      this.isPolygonActive = false;
      this.isTextActive = false;
      document.getElementById('pointdrawing').classList.remove('activeTool');
      document.getElementById('linedrawing').classList.remove('activeTool');
      document.getElementById('polygondrawing').classList.remove('activeTool');
      document.getElementById('textdrawing').classList.remove('activeTool');
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
      if (document.querySelector('#drawingtools #featureInfo') !== null) {
        document.querySelector('#drawingtools #featureInfo').style.display = 'none';
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
      if (document.getElementById('geometrydraw-uploading') !== null) {
        document.getElementById('geometrydraw-uploading').remove();
      }
      this.getImpl().activateSelection();
      this.isEditionActive = true;
      document.querySelector('#otherBtns>#edit').classList.add('activeTool');
    }
  }

  /**
   * Changes style of current feature.
   * @public
   * @function
   * @api
   */
  styleChange(e) {
    if (this.feature) {
      const evtId = e.target.id;

      if (document.querySelector('#colorSelector') !== null) {
        this.currentColor = document.querySelector('#colorSelector').value;
        this.currentThickness = document.querySelector('#thicknessSelector').value;
      } else {
        this.textContent = document.querySelector('#textContent').value;
        this.fontColor = document.querySelector('#fontColor').value;
        this.fontSize = document.querySelector('#fontSize').value;
        this.fontFamily = document.querySelector('#fontFamily').value;
      }

      switch (this.feature.getGeometry().type) {
        case 'Point':
        case 'MultiPoint':
          if (evtId === 'colorSelector' || evtId === 'thicknessSelector') {
            const newPointStyle = new M.style.Point({
              radius: this.currentThickness,
              fill: {
                color: this.currentColor,
              },
              stroke: {
                color: 'white',
                width: 2,
              },
            });
            if (this.feature !== undefined) this.feature.setStyle(newPointStyle);
          } else {
            this.setTextStyle(false);
          }
          break;
        case 'LineString':
        case 'MultiLineString':
          const newLineStyle = new M.style.Line({
            stroke: {
              color: this.currentColor,
              width: this.currentThickness,
            },
          });
          if (this.feature !== undefined) this.feature.setStyle(newLineStyle);
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
          if (this.feature !== undefined) this.feature.setStyle(newPolygonStyle);
          break;
        default:
          break;
      }
    }
  }

  /**
   * Updates input values with selected feature values.
   * @public
   * @function
   * @api
   */
  updateInputValues() {
    if (this.feature) {
      let featureIsText;
      if (this.feature.getStyle() !== null) {
        featureIsText = this.feature.getStyle().get('label') !== undefined;
      }
      this.geometry = this.feature.getGeometry().type;

      if (featureIsText) {
        const fontProps = this.feature.getStyle().get('label.font').split(' ');
        this.fontColor = this.feature.getStyle().get('label.color');
        this.textContent = this.feature.getStyle().get('label.text');
        if (fontProps[0] === 'bold') {
          this.fontSize = fontProps[1].slice(0, fontProps[1].length - 2);
          this.fontFamily = fontProps[2];
        } else {
          this.fontSize = fontProps[0].slice(0, fontProps[0].length - 2);
          this.fontFamily = fontProps[1];
        }
        this.updateTextInputValues(
          this.textContent,
          this.fontColor,
          this.fontSize,
          this.fontFamily,
        );
      } else {
        this.currentColor = this.getFeatureColor(this.feature);
        this.currentThickness = this.getFeatureThickness(this.feature);
        this.drawingTools.querySelector('#colorSelector').value = this.currentColor;
        this.drawingTools.querySelector('#thicknessSelector').value = this.currentThickness;
        document.querySelector('#drawingtools #colorSelector').value = this.currentColor;
        document.querySelector('#drawingtools #thicknessSelector').value = this.currentThickness;
      }
    }
  }

  /**
   * Updates TextDraw menu options with given values.
   * @param {String} content - #textContent
   * @param {String} color - #fontColor
   * @param {String} size - #fontSize
   * @param {String} family - #fontFamily
   */
  updateTextInputValues(content, color, size, family) {
    this.textDrawTemplate.querySelector('#textContent').value = content;
    this.textDrawTemplate.querySelector('#fontColor').value = color;
    this.textDrawTemplate.querySelector('#fontSize').value = size;
    this.textDrawTemplate.querySelector('#fontFamily').value = family;
    document.querySelector('#textdrawtools #textContent').value = content;
    document.querySelector('#textdrawtools #fontColor').value = color;
    document.querySelector('#textdrawtools #fontSize').value = size;
    document.querySelector('#textdrawtools #fontFamily').value = family;
  }

  /**
   * Updates global text drawing variables with current input values.
   * @public
   * @function
   * @api
   */
  updateGlobalsWithInput() {
    const textInput = document.querySelector('#textdrawtools #textContent');
    this.textContent = textInput.value === '' ? 'Texto' : textInput.value;
    this.fontColor = document.querySelector('#textdrawtools #fontColor').value;
    this.fontSize = document.querySelector('#textdrawtools #fontSize').value;
    this.fontFamily = document.querySelector('#textdrawtools #fontFamily').value;
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
   * Sets style for text feature.
   * @public
   * @function
   * @api
   * @param {Boolean} defaultTextStyle - whether default style should be used
   */
  setTextStyle(defaultTextStyle) {
    let fontProperties;

    if (defaultTextStyle) {
      this.textContent = DEFAULT_TEXT;
      this.fontColor = DEFAULT_FONT_COLOR;
      this.fontFamily = DEFAULT_FONT_FAMILY;
      this.fontSize = DEFAULT_SIZE;
    }

    if ((this.feature.getStyle() !== null) &&
      this.feature.getStyle().get('label.font').split(' ')[0] === 'bold') {
      fontProperties = `bold ${this.fontSize}px ${this.fontFamily}`;
    } else {
      fontProperties = `${this.fontSize}px ${this.fontFamily}`;
    }

    this.feature.setStyle(new M.style.Point({
      radius: 3,
      fill: {
        color: 'red',
        opacity: 1,
      },
      stroke: {
        color: 'transparent',
        width: 0,
      },
      label: {
        text: this.textContent,
        font: fontProperties,
        color: this.fontColor,
      },
    }));
  }

  /**
   * Checks if textdrawtool box has default input values.
   * @public
   * @function
   * @api
   */
  defaultTextInputValues() {
    const defaults = ['', DEFAULT_FONT_COLOR, DEFAULT_SIZE, DEFAULT_FONT_FAMILY];
    const inputs = document.querySelectorAll('#textdrawtools>label>*');
    let sameStyles = true;
    for (let i = 0; i < inputs.length; i += 1) {
      if (inputs[i].value !== defaults[i]) sameStyles = false;
    }
    return sameStyles;
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
        throw new Error('Geometría no reconocida.');
    }
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
      const lastFeature = this.feature;
      this.hideTextPoint();
      this.feature = event.feature;
      this.feature = M.impl.Feature.olFeature2Facade(this.feature);
      if (this.geometry === undefined) this.geometry = this.feature.getGeometry().type;

      if (this.geometry === 'Point' && this.isTextActive) {
        this.updateGlobalsWithInput();
        if (lastFeature !== undefined) this.textContent = 'Texto';
        this.setTextStyle(false);
      } else {
        this.setFeatureStyle(this.feature, this.geometry);
      }

      if (this.isTextActive) {
        document.querySelector('.m-geometrydraw #textdrawtools button').style.display = 'block';
      } else {
        document.querySelector('.m-geometrydraw #drawingtools button').style.display = 'block';
      }

      this.map.getLayers()[this.map.getLayers().length - 1].addFeatures(this.feature);
      this.emphasizeSelectedFeature();
      this.showFeatureInfo();
      this.updateInputValues();
    });
  }

  /**
   * Deletes Mapea feature set attributes.
   * @public
   * @function
   * @api
   * @param {*} features - Mapea features
   */
  deleteFeatureAttributes(features) {
    const newFeatures = features;
    newFeatures.forEach((feature) => {
      const thisFeature = feature;
      const properties = feature.getImpl().getOLFeature().getProperties();
      const keys = Object.keys(properties);
      keys.forEach((key) => {
        if (key !== 'geometry') thisFeature.getImpl().getOLFeature().unset(key);
      });
    });
    return newFeatures;
  }

  /**
   * On select, shows feature info.
   * @public
   * @function
   * @api
   */
  showFeatureInfo() {
    const olFeature = this.feature.getImpl().getOLFeature();
    const infoContainer = document.querySelector('#drawingtools #featureInfo');
    if (infoContainer !== null) {
      infoContainer.style.display = 'block';
      infoContainer.innerHTML = '';
    }

    switch (this.geometry) {
      case 'Point':
      case 'MultiPoint':
        const x = this.getImpl().getFeatureCoordinates(olFeature)[0];
        const y = this.getImpl().getFeatureCoordinates(olFeature)[1];
        if (infoContainer !== null) {
          infoContainer.innerHTML = `Coordenadas<br/>
          x: ${Math.round(x * 1000) / 1000},<br/>
          y: ${Math.round(y * 1000) / 1000}`;
        }
        break;
      case 'LineString':
      case 'MultiLineString':
        let lineLength = this.getImpl().getFeatureLength(olFeature);
        let units = 'km';
        if (lineLength > 100) {
          lineLength = Math.round((lineLength / 1000) * 100) / 100;
        } else {
          lineLength = Math.round(lineLength * 100) / 100;
          units = 'm';
        }
        if (infoContainer !== null) infoContainer.innerHTML = `Longitud: ${lineLength} ${units}`;
        break;
      case 'Polygon':
      case 'MultiPolygon':
        let area = this.getImpl().getFeatureArea(olFeature);
        let areaUnits = `km${'2'.sup()}`;
        if (area > 10000) {
          area = Math.round((area / 1000000) * 100) / 100;
        } else {
          area = Math.round(area * 100) / 100;
          areaUnits = `m${'2'.sup()}`;
        }
        if (infoContainer !== null) infoContainer.innerHTML = `Área: ${area} ${areaUnits}`;
        break;
      default:
        if (document.querySelector('#drawingtools #featureInfo') !== null) {
          document.querySelector('#drawingtools #featureInfo').style.display = 'none';
        }
        break;
    }
  }

  /**
   * Clears selection layer.
   * Draws square around feature and adds it to selection layer.
   * For points:
   *    If feature doesn't have style, sets new style.
   * For text:
   *    Colours red text feature point.
   * @public
   * @function
   * @api
   */
  emphasizeSelectedFeature() {
    this.emphasis = null;
    this.selectionLayer.removeFeatures(this.selectionLayer.getFeatures());

    if (this.feature) {
      const isTextDrawActive = document.querySelector('#textdrawtools') !== null;

      // if point vs text vs else
      if ((this.geometry === 'Point' || this.geometry === 'MultiPoint') && !isTextDrawActive) {
        // eslint-disable-next-line no-underscore-dangle
        const thisOLfeat = this.feature.getImpl().olFeature_;
        const OLFeatClone = thisOLfeat.clone();
        this.emphasis = M.impl.Feature.olFeature2Facade(OLFeatClone);

        this.emphasis.setStyle(new M.style.Point({
          radius: 20,
          stroke: {
            color: '#FF0000',
            width: 2,
          },
        }));
      } else if ((this.geometry === 'Point' || this.geometry === 'MultiPoint') && isTextDrawActive) {
        if (this.feature.getStyle() === null) this.setTextStyle(false);
        this.feature.getStyle().set('fill.opacity', 1);
      } else {
        // eslint-disable-next-line no-underscore-dangle
        const extent = this.feature.getImpl().olFeature_.getGeometry().getExtent();
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
   * Hides point associated to text feature.
   * @public
   * @function
   * @api
   */
  hideTextPoint() {
    if (this.geometry === 'Point' &&
      this.feature &&
      this.feature.getStyle().get('label') !== undefined) {
      this.feature.getStyle().set('fill.opacity', 0);
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

      this.cleanUploadTemplate();

      this.deactivateDrawing();
      document.querySelector('.m-geometrydraw').appendChild(this.downloadingTemplate);
    } else {
      M.dialog.info('La capa de dibujo está vacía.');
    }
  }

  /**
   * Removes upload template and reboots its options.
   * @public
   * @function
   * @api
   */
  cleanUploadTemplate() {
    if (document.querySelector('#geometrydraw-uploading') !== null) {
      document.querySelector('.m-geometrydraw').removeChild(this.uploadingTemplate);
      this.uploadingTemplate.querySelector('#geometrydraw-uploading>input').value = '';
      this.uploadingTemplate.querySelector('#geometrydraw-uploading>p#fileInfo').innerHTML = '';
      this.file_ = '';
      this.loadBtn_.setAttribute('disabled', 'disabled');
    }
  }

  /**
   * Opens upload template
   * @public
   * @function
   * @api
   */
  openUploadOptions() {
    if (this.isEditionActive) {
      this.deactivateEdition();
      document.querySelector('#otherBtns>#edit').classList.remove('activeTool');
    }
    if (document.querySelector('#downloadFormat') !== null) {
      document.querySelector('.m-geometrydraw').removeChild(this.downloadingTemplate);
    }
    this.deactivateDrawing();
    document.querySelector('.m-geometrydraw').appendChild(this.uploadingTemplate);
    this.loadBtn_.setAttribute('disabled', 'disabled');
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
  newNoTextLayer() {
    const newLayer = new M.layer.Vector({ name: 'copia' });
    const noTextFeatures = this.drawLayer.getFeatures().filter((feature) => {
      // eslint-disable-next-line no-underscore-dangle
      return feature.getStyle().options_.label === undefined;
    });
    newLayer.addFeatures(noTextFeatures);
    return newLayer;
  }

  /**
   * Downloads draw layer as GeoJSON, kml or gml.
   * @public
   * @function
   * @api
   */
  downloadLayer() {
    const fileName = 'misgeometrias';
    const downloadFormat = this.downloadingTemplate.querySelector('select').value;
    const noTextLayer = this.newNoTextLayer();
    noTextLayer.setVisible(false);
    this.map.addLayers(noTextLayer);
    const geojsonLayer = this.toGeoJSON(noTextLayer); // noTextLayer.toGeoJSON(); when fixed
    this.map.removeLayers(noTextLayer);
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
      case 'shp':
        const json = this.parseGeojsonForShp(geojsonLayer);
        const options = {
          folder: fileName,
          types: {
            point: 'puntos',
            polygon: 'poligonos',
            polyline: 'lineas',
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
      link.setAttribute('download', `${fileName}.${extensionFormat}`);
      document.body.appendChild(link);
      link.click();
    }

    document.querySelector('.m-geometrydraw').removeChild(this.downloadingTemplate);
  }

  /**
   * Deletes all drawn features.
   * @public
   * @function
   * @api
   */
  deleteDrawnFeatures() {
    this.deactivateDrawing();
    this.getImpl().deactivateSelection();
    this.drawLayer.removeFeatures(this.drawLayer.getFeatures());
    this.feature = undefined;
    this.geometry = undefined;
    this.selectionLayer.removeFeatures([this.emphasis]);
    if (document.querySelector('#drawingtools #featureInfo') !== null) {
      document.querySelector('#drawingtools #featureInfo').style.display = 'none';
    }
    if (document.querySelector('#otherBtns>#edit') !== null) {
      document.querySelector('#otherBtns>#edit').classList.remove('activeTool');
    }
    if (document.querySelector('.m-geometrydraw>#downloadFormat') !== null) {
      document.querySelector('.m-geometrydraw').removeChild(this.downloadingTemplate);
    }
    this.cleanUploadTemplate();
  }

  /**
   * Deletes selected geometry.
   * @public
   * @function
   * @api
   */
  deleteSingleFeature() {
    const editionMode = this.isEditionActive;
    this.drawLayer.removeFeatures([this.feature]);
    this.feature = undefined;
    this.geometry = undefined;
    this.selectionLayer.removeFeatures([this.emphasis]);
    this.deactivateDrawing();
    this.getImpl().deactivateSelection();
    if (editionMode) this.getImpl().activateSelection();
  }

  /**
   * Gets given feature thickness.
   * @public
   * @function
   * @api
   * @param {M.Feature} feature - Mapea feature
   */
  getFeatureThickness(feature) {
    if (feature.getGeometry().type === 'Point' || feature.getGeometry().type === 'MultiPoint') {
      return feature.getStyle().get('radius');
    }
    return feature.getStyle().get('stroke.width');
  }

  /**
   * Gets given feature color.
   * @public
   * @function
   * @api
   * @param {M.Feature} feature - Mapea feature
   */
  getFeatureColor(feature) {
    if (feature.getGeometry().type === 'Point' || feature.getGeometry().type === 'MultiPoint') {
      return feature.getStyle().get('fill.color');
    }
    return feature.getStyle().get('stroke.color');
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

  /* Layer upload */

  /**
   * Changes selected file.
   * @param {*} evt -
   * @param {*} file -
   */
  changeFile(evt, file) {
    this.file_ = file;
    this.loadBtn_.setAttribute('disabled', 'disabled');
    if (!M.utils.isNullOrEmpty(file)) {
      if (file.size > 20971520) {
        M.dialog.info('El fichero seleccionado sobrepasa el máximo de 20 MB permitido.');
        this.file_ = null;
        document.querySelector('#fileInfo').innerHTML = '';
      } else {
        this.loadBtn_.removeAttribute('disabled');
        document.querySelector('#fileInfo').innerHTML = `Fichero seleccionado: ${file.name}`;
      }
    }
  }

  /**
   * Loads vector layer features on __draw__ (Mapea) layer.
   * @public
   * @function
   * @api
   */
  loadLayer() {
    // eslint-disable-next-line no-bitwise
    const fileExt = this.file_.name.slice((this.file_.name.lastIndexOf('.') - 1 >>> 0) + 2);
    const fileReader = new window.FileReader();
    fileReader.addEventListener('load', (e) => {
      try {
        let features = [];
        if (fileExt === 'zip') {
          // In case of shp group, this unites features
          const geojsonArray = [].concat(shp.parseZip(fileReader.result));
          geojsonArray.forEach((geojson) => {
            const localFeatures = this.getImpl()
              .loadGeoJSONLayer(geojson);
            if (localFeatures) {
              features = features.concat(localFeatures);
            }
          });
        } else if (fileExt === 'kml') {
          features = this.getImpl()
            .loadKMLLayer(fileReader.result, false);
        } else if (fileExt === 'gpx') {
          features = this.getImpl()
            .loadGPXLayer(fileReader.result);
        } else if (fileExt === 'geojson') {
          features = this.getImpl()
            .loadGeoJSONLayer(fileReader.result);
        } else {
          M.dialog.error('Error al cargar el fichero.');
          return;
        }
        if (features.length === 0) {
          M.dialog.info('No se han detectado geometrías en este fichero.');
        } else {
          this.getImpl().centerFeatures(features);
        }
      } catch (error) {
        M.dialog.error('Error al cargar el fichero. Compruebe que se trata del fichero correcto.');
      }
    });
    if (fileExt === 'zip') {
      fileReader.readAsArrayBuffer(this.file_);
    } else if (fileExt === 'kml' || fileExt === 'gpx' || fileExt === 'geojson') {
      fileReader.readAsText(this.file_);
    } else {
      M.dialog.error('No se ha insertado una extensión de archivo permitida. Las permitidas son: KML, SHP(.zip), GPX y GeoJSON.');
    }
  }

  /**
   * Turns GeometryCollection features into single geometry features.
   * @public
   * @function
   * @api
   * @param {Array<M.Feature>} features
   */
  geometryCollectionParse(features) {
    const parsedFeatures = [];
    features.forEach((feature) => {
      if (feature.getGeometry().type === 'GeometryCollection') {
        const geometries = feature.getGeometry().geometries;
        geometries.forEach((geometry) => {
          const num = Math.random();
          const newFeature = new M.Feature(`mf${num}`, {
            type: 'Feature',
            id: `gf${num}`,
            geometry: {
              type: geometry.type,
              coordinates: geometry.coordinates,
            },
          });
          parsedFeatures.push(newFeature);
        });
      } else {
        parsedFeatures.push(feature);
      }
    });
    return parsedFeatures;
  }

  /* TO GEOJSON WITH BUG FIXED */

  /**
   * This function gets the geojson representation of the layer
   * @function
   * @api
   */
  toGeoJSON(layer) {
    const code = this.map_.getProjection().code;
    const featuresAsJSON = layer.getFeatures().map(feature => feature.getGeoJSON());
    return { type: 'FeatureCollection', features: this.geojsonTo4326(featuresAsJSON, code) };
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
   * Given a coordinate set (x, y, altitude?), returns [x,y].
   * @public
   * @function
   * @param {Array<Number>} coordinatesSet
   */
  getXY(coordinatesSet) {
    const coordinateCopy = [];
    for (let i = 0; i < coordinatesSet.length; i += 1) coordinateCopy.push(coordinatesSet[i]);
    while (coordinateCopy.length > 2) coordinateCopy.pop();
    return coordinateCopy;
  }

  // TODO: wrap transformfunction with this
  getFullCoordinates(oldCoordinates, newXY) {
    const newCoordinates = oldCoordinates;
    newCoordinates[0] = newXY[0];
    newCoordinates[1] = newXY[1];
    return newCoordinates;
  }

  getTransformedCoordinates(codeProjection, oldCoordinates) {
    const transformFunction = ol.proj.getTransform(codeProjection, 'EPSG:4326');
    return this.getFullCoordinates(
      oldCoordinates,
      transformFunction(this.getXY(oldCoordinates)),
    );
  }

  /**
   * Converts features coordinates on geojson format to 4326.
   */
  geojsonTo4326(featuresAsJSON, codeProjection) {
    const jsonResult = [];
    // let jsonFeature = {};
    featuresAsJSON.forEach((featureAsJSON) => {
      const coordinates = featureAsJSON.geometry.coordinates;
      let newCoordinates = [];
      switch (featureAsJSON.geometry.type) {
        case 'Point':
          newCoordinates = this.getTransformedCoordinates(codeProjection, coordinates);
          break;
        case 'MultiPoint':
          for (let i = 0; i < coordinates.length; i += 1) {
            const newDot = this
              .getTransformedCoordinates(codeProjection, coordinates[i]);
            newCoordinates.push(newDot);
          }
          break;
        case 'LineString':
          for (let i = 0; i < coordinates.length; i += 1) {
            const newDot = this.getTransformedCoordinates(
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
                .getTransformedCoordinates(codeProjection, coordinates[i][j]);
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
                .getTransformedCoordinates(codeProjection, coordinates[i][j]);
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
                  .getTransformedCoordinates(codeProjection, coordinates[i][j][k]);
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
   * Check whether the value is a JavaScript number.
   *
   * First checks typeof, then self-equality to make sure it is
   * not NaN, then Number.isFinite() to check for Infinity.
   *
   * @public
   * @function
   * @param {*} value - The value to check
   * @return {boolean} Whether that value is a number
   */
  isNumber(value) {
    if (typeof value !== 'number') return false;
    if (value !== Number(value)) return false;
    if (Number.isFinite(value) === false) return false;
    return true;
  }
}
