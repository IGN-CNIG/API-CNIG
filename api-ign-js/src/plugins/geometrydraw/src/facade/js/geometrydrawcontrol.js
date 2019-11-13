/**
 * @module M/control/GeometryDrawControl
 */

import GeometryDrawImplControl from 'impl/geometrydrawcontrol';
import template from 'templates/geometrydraw';
import drawingTemplate from 'templates/drawing';
import textDrawTemplate from 'templates/textdraw';
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
     * Checks if point/line/polygon/text drawing tool is active.
     */
    this.isPointActive = false;
    this.isLineActive = false;
    this.isPolygonActive = false;
    this.isTextActive = false;

    /**
     * Checks if edition tool is active.
     */
    this.isEditionActive = false;

    /**
     * Selected Mapea feature
     */
    this.feature = undefined;

    /**
     * Feature that is drawn on selection layer around this.feature
     * to emphasize it.
     * @type {M.feature}
     */
    this.emphasis = undefined;

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
     * Template with text feature drawing tools.
     */
    this.textDrawTemplate = undefined;

    /**
     * Current color for drawing features.
     */
    this.currentColor = undefined;

    /**
     * Current line thickness (or circle radius) for drawing features.
     */
    this.currentThickness = undefined;

    /**
     * Current feature name / description text.
     */
    this.textContent = 'Texto';

    /**
     * Current text feature font color.
     */
    this.fontColor = '#F00';

    /**
     * Current text feature font size.
     */
    this.fontSize = '12';

    /**
     * Current text feature font family.
     */
    this.fontFamily = 'Verdana';

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
      this.createTextDrawTemplate();
      this.createDownloadingTemplate();
      this.addEvents(html);
      success(html);
    });
  }

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

    this.drawingTools.querySelector('#colorSelector').addEventListener('change', e => this.styleChange(e));
    this.drawingTools.querySelector('#thicknessSelector').addEventListener('change', e => this.styleChange(e));
    this.drawingTools.querySelector('button').addEventListener('click', this.deleteSingleFeature.bind(this));

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
    html.querySelector('#pointdrawing').addEventListener('click', (e) => {
      this.geometryBtnClick('Point');
    });
    html.querySelector('#linedrawing').addEventListener('click', (e) => {
      this.geometryBtnClick('LineString');
    });
    html.querySelector('#polygondrawing').addEventListener('click', (e) => {
      this.geometryBtnClick('Polygon');
    });
    html.querySelector('#textdrawing').addEventListener('click', (e) => {
      this.geometryBtnClick('Text');
    });
    html.querySelector('#cleanAll').addEventListener('click', this.deleteDrawnFeatures.bind(this));
    html.querySelector('#download').addEventListener('click', this.openDownloadOptions.bind(this));
    html.querySelector('#edit').addEventListener('click', this.editBtnClick.bind(this));
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
    let lastBtnState;

    if (geometry === 'Point') {
      lastBtnState = this.isPointActive;
    } else if (geometry === 'LineString') {
      lastBtnState = this.isLineActive;
    } else if (geometry === 'Polygon') {
      lastBtnState = this.isPolygonActive;
    } else {
      lastBtnState = this.isTextActive;
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

          if (document.getElementById('drawingtools') !== null) {
            document.getElementById('drawingtools').remove();
          }

          if (document.getElementById('textdrawtools') !== null) {
            document.getElementById('textdrawtools').remove();
          }
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

          if (document.getElementById('drawingtools') !== null) {
            document.getElementById('drawingtools').remove();
          }

          if (document.getElementById('textdrawtools') !== null) {
            document.getElementById('textdrawtools').remove();
          }
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
          if (document.getElementById('drawingtools') !== null) {
            document.getElementById('drawingtools').remove();
          }

          if (document.getElementById('textdrawtools') !== null) {
            document.getElementById('textdrawtools').remove();
          }
        }
        break;
      case 'Text':
        if (lastBtnState) {
          this.geometry = undefined;
          this.isTextActive = false;
          document.getElementById('textdrawing').classList.remove('activeTool');
        } else {
          this.isTextActive = true;
          this.geometry = 'Point';
          document.getElementById('textdrawing').classList.add('activeTool');
          if (document.getElementById('drawingtools') !== null) {
            document.getElementById('drawingtools').remove();
          }

          if (document.getElementById('textdrawtools') !== null) {
            document.getElementById('textdrawtools').remove();
          }
        }
        break;
      default:
        break;
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
      if ((this.feature !== undefined) && this.feature.getStyle().get('fill.opacity') === 0) {
        const fontPropsArray = this.feature.getStyle().get('label.font').split(' ');
        fontPropsArray.shift();
        const noBoldFont = fontPropsArray.join(' ');
        this.feature.getStyle().set('label.font', noBoldFont);
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
          const newLineStyle = new M.style.Line({
            stroke: {
              color: this.currentColor,
              width: this.currentThickness,
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
      const featureFillOpacity = this.feature.getStyle().get('fill.opacity');
      this.geometry = this.feature.getGeometry().type;

      if (featureFillOpacity === 0) {
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
      this.textContent = 'Texto';
      this.fontColor = '#71a7d3';
      this.fontFamily = 'Arial';
      this.fontSize = 12;
    }

    if ((this.feature.getStyle() !== null) &&
      this.feature.getStyle().get('label.font').split(' ')[0] === 'bold') {
      fontProperties = `bold ${this.fontSize}px ${this.fontFamily}`;
    } else {
      fontProperties = `${this.fontSize}px ${this.fontFamily}`;
    }

    this.feature.setStyle(new M.style.Point({
      radius: 0,
      fill: {
        color: 'black',
        opacity: 0,
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
    const defaults = ['', '#71a7d3', '12', 'Arial'];
    const inputs = document.querySelectorAll('#textdrawtools>label>*');
    let sameStyles = true;
    for (let i = 0; i < inputs.length; i += 1) {
      if (inputs[i].value !== defaults[i]) sameStyles = false;
    }
    return sameStyles;
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
      this.feature = event.feature;
      this.feature = M.impl.Feature.olFeature2Facade(this.feature);
      if (this.geometry === undefined) this.geometry = this.feature.getGeometry().type;

      if (this.geometry === 'Point') {
        if (this.isTextActive) {
          this.updateGlobalsWithInput();
          if (lastFeature !== undefined) {
            this.textContent = 'Texto';
            // this.setTextStyle(true);
          }
          // else {
          // }
          this.setTextStyle(false);
        } else {
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
        }
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
    }
    if (infoContainer !== null) infoContainer.innerHTML = '';

    switch (this.geometry) {
      case 'Point':
        const x = this.getImpl().getFeatureCoordinates(olFeature)[0];
        const y = this.getImpl().getFeatureCoordinates(olFeature)[1];
        if (infoContainer !== null) {
          infoContainer.innerHTML = `Coordenadas<br/>
          x: ${Math.round(x * 1000) / 1000},<br/>
          y: ${Math.round(y * 1000) / 1000}`;
        }
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
        if (infoContainer !== null) infoContainer.innerHTML = `Longitud: ${lineLength} ${units}`;
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
   * @public
   * @function
   * @api
   */
  emphasizeSelectedFeature() {
    this.emphasis = null;
    this.selectionLayer.removeFeatures(this.selectionLayer.getFeatures());

    if (this.feature) {
      const isTextDrawActive = document.querySelector('#textdrawtools') !== null;

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
        this.cleanBoldText();
        // selected text is bold
        const newFont = `bold ${this.fontSize}px ${this.fontFamily}`;
        this.feature.getStyle().set('label.font', newFont);
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
   * Deletes 'bold' property from all text features.
   * @public
   * @function
   * @api
   */
  cleanBoldText() {
    const textFeatures = this.drawLayer.getFeatures();
    textFeatures.forEach((f, idx) => {
      let font = f.getStyle().get('label.font');
      if (font !== undefined) {
        const fontPieces = font.split(' ');
        if (fontPieces[0] === 'bold') {
          fontPieces.shift();
          font = fontPieces.join(' ');
          this.drawLayer.getFeatures()[idx].getStyle().set('label.font', font);
        }
      }
    });
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
      case 'kml':
        arrayContent = tokml(geojsonLayer);
        mimeType = 'xml';
        extensionFormat = 'kml';
        break;
      case 'gml':
        arrayContent = this.getImpl().getGML({
          olFeatures,
          epsg: 'EPSG:3857',
          featureNS: 'http://abcdef.xyz/dummy',
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
    this.getImpl().deactivateSelection();
    this.getImpl().activateSelection();
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
