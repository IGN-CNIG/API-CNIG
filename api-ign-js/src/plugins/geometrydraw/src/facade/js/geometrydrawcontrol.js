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

    this.numberOfDrawFeatures = 0;

    this.selectionLayer = new M.layer.Vector({
      name: 'selectLayer',
      source: this.getImpl().newVectorSourceWithCollectionFeatures(),
    });

    /**
     * Checks if click on point button is activation click or deactivation click.
     */
    this.oddPointClick = undefined;
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

    this.doStuff();

    return new Promise((success, fail) => {
      const html = M.template.compileSync(template);
      this.addEvents(html);
      success(html);
    });
  }

  addEvents(html) {
    html.querySelector('#pointdrawing').addEventListener('click', this.pointClick.bind(this));
    // FIXME: create listeners for line and polygon
  }

  pointClick() {
    // activates drawing, adds events 1st time
    if (this.oddPointClick || this.oddPointClick === undefined) {
      const drawingTools = M.template.compileSync(drawingTemplate, { jsonp: true });
      this.geometry = 'Point'; // LineString, Polygon
      this.currentFill = drawingTools.querySelector('#colorSelector').value;
      this.currentRadius = drawingTools.querySelector('#thicknessSelector').value;

      if (this.oddPointClick === undefined) {
        drawingTools.querySelector('#colorSelector').addEventListener('change', this.styleChange.bind(this));
        drawingTools.querySelector('#thicknessSelector').addEventListener('change', this.styleChange.bind(this));
      }
      document.querySelector('.m-geometrydraw').appendChild(drawingTools);
      this.addOnClickEvent();
      this.oddPointClick = false;
    } else {
      // TODO: deactivates click, hide template
      this.deleteOnClickEvent();
      // FIXME: either delete template or create is just once
      // document.querySelector('#drawingtools').style.display = 'none';
      this.oddPointClick = true;
    }
  }

  /**
   * Changes style of current feature.
   */
  styleChange() {
    const fillValue = document.querySelector('#colorSelector').value;
    const radiusValue = document.querySelector('#thicknessSelector').value;
    this.currentFill = fillValue;
    this.currentRadius = radiusValue;

    const newPointStyle = this.getImpl().newOLCircleStyle({
      radius: radiusValue,
      strokeColor: 'white',
      strokeWidth: 2,
      fillColor: fillValue,
    });
    this.feature.setStyle(newPointStyle);
  }


  /* FIXME: fix following TAKE to Impl */

  doStuff() {
    if (this.numberOfDrawFeatures === 0) {
      this.numberOfDrawFeatures = this.map.getLayers()[this.map.getLayers().length - 1]
        .getFeatures().length;
    }
    this.vectorLayer = this.map.getLayers()[this.map.getLayers().length - 1]
      .getImpl().getOL3Layer();
    this.vectorSource = this.getImpl().newVectorSource();
    this.vectorStyle = this.getImpl().newOLStyle({
      fillColor: 'rgba(255, 255, 255, 0.2)',
      strokeColor: '#ffcc33',
      strokeWidth: 2,
      circleRadius: 7,
      circleFill: '#ffcc33',
    });
    // this.vectorLayer.set('vendor.mapaalacarta.selectable', true);
    this.map.addLayers(this.selectionLayer);
    this.vectorLayer.setStyle(this.vectorStyle);
    this.vectorLayer.setSource(this.vectorSource);
  }

  activate() {
    super.activate();
    this.addOnClickEvent();
  }

  deactivate() {
    super.deactivate();
    this.deleteOnClickEvent();
  }

  /**
   * This function adds the event singleclick to the specified map
   *
   * @private
   * @function
   */
  addOnClickEvent() {
    const olMap = this.map.getMapImpl();
    if (this.geometry !== 'Text') {
      this.draw = this.getImpl().newDrawInteraction(this.vectorSource, this.geometry);
      this.draw.on('drawend', (event) => {
        this.feature = event.feature;
        this.feature.setId(`draw-${this.numberOfDrawFeatures}`);
        this.feature.set('name', this.feature.getId());
        this.numberOfDrawFeatures += 1;
        const featureMapea = this.convertToMFeature_(this.feature);
        this.setFeature2(featureMapea.getImpl().getOLFeature());
      });
    } else {
      this.draw = this.getImpl().newDrawInteraction(this.vectorSource, 'Point');
      this.draw.on('drawend', (event) => {
        const feature = event.feature;
        this.setContent_(feature);
      });
    }
    olMap.addInteraction(this.draw);
  }

  setContent_(feature) {
    feature.setStyle(this.getImpl().newOLTextStyle(
      'Texto',
      '12px Arial',
      '#000000',
      'rgba(213, 0, 110, 0)',
      0,
    ));
    this.feature = feature;
    this.feature.setId(`draw-${this.numberOfDrawFeatures}`);
    this.numberOfDrawFeatures += 1;
    this.feature.set('name', this.feature.getId());
    const featureMapea = this.convertToMFeature_(this.feature);
    this.setFeature2(featureMapea.getImpl().getOLFeature());
  }

  deleteOnClickEvent() {
    this.map.getMapImpl().removeInteraction(this.draw);
  }

  convertToMFeature_(olFeature) {
    const feature = new M.Feature(olFeature.getId(), {
      geometry: {
        coordinates: olFeature.getGeometry().getCoordinates(),
        type: olFeature.getGeometry().getType(),
      },
      properties: olFeature.getProperties(),
    });
    feature.getImpl().getOLFeature().setStyle(olFeature.getStyle());
    this.map.getLayers()[this.map.getLayers().length - 1].addFeatures(feature);
    return feature;
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
    // if (this.stylePlugin === null) {
    //   this.stylePlugin = new M.plugin.StyleTools(this.feature, this.map, this);
    // } else {
    //   this.stylePlugin.changeElements(this.feature, this);
    // }
  }

  changeSquare(feature) {
    this.square = null;
    this.selectionLayer.getImpl().getOL3Layer().getSource().clear();
    if (this.feature.getGeometry().getType() === 'Point' || this.feature.getGeometry().getType() === 'MultiPoint') {
      if (this.feature.getStyle() === null) {
        const style2 = this.getImpl().newOLCircleStyle({
          radius: 6, // this.currentRadius, // FIXME: square grows a lot
          strokeColor: 'white',
          strokeWidth: 2,
          fillColor: this.currentFill || '#71a7d3',
        });
        this.feature.setStyle(style2);
        this.feature.changed();
        // eslint-disable-next-line no-underscore-dangle
      } else if (this.feature.getStyle().text_ !== null) {
        return;
      }

      let featureSize;

      if (this.feature.getStyle().getImage().getSize() === undefined ||
        this.feature.getStyle().getImage().getSize() === null) {
        featureSize = this.feature.get('size');
      } else {
        featureSize = this.feature.getStyle().getImage().getSize()[0];
      }

      this.square = this.getImpl().cloneFeature(this.feature.getGeometry().clone());
      this.square.setStyle(this.getImpl().newRegularShapeStyle({
        strokeColor: '#FF0000',
        strokeWidth: 2,
        points: 4,
        radius: (featureSize / 1.5) + 5,
        rotation: Math.PI / 4,
      }));

      this.selectionLayer.getImpl().getOL3Layer().getSource().addFeature(this.square);
    } else {
      const extent = this.feature.getGeometry().getExtent();
      this.square = this.getImpl().newPolygonFeature(extent);
      this.square.setStyle(this.getImpl().newSquareStyle('#FF0000', 2));
      this.selectionLayer.getImpl().getOL3Layer().getSource().addFeature(this.square);
    }
  }

  setFeature2(feature) {
    this.feature = feature;
    this.changeSquare(this.feature);
    // if (this.stylePlugin === null) {
    //   this.stylePlugin = new M.plugin.StyleTools(this.feature, this.map, this);
    // } else {
    //   this.stylePlugin.changeElements(this.feature, this);
    // }
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
