/**
 * @module M/impl/control/VectorsControl
 */

import Profil from './profilcontrol';
import { getValue } from '../../../facade/js/i18n/language';

const WGS84 = 'EPSG:4326';
const MERCATOR = 'EPSG:900913';
const GML_FORMAT = 'text/xml; subtype=gml/3.1.1';
const PROFILE_URL = 'https://servicios.idee.es/wcs-inspire/mdt?request=GetCoverage&bbox=';
const PROFILE_URL_SUFFIX = '&service=WCS&version=1.0.0&coverage=Elevacion4258_5&' +
'interpolationMethod=bilinear&crs=EPSG%3A4258&format=ArcGrid&width=2&height=2';
const WFS_EXCEPTIONS = [
  'https://servicios.idee.es/wfs-inspire/hidrografia?',
  'https://servicios.idee.es/wfs-inspire/hidrografia',
  'https://www.ign.es/wfs-inspire/unidades-administrativas?',
  'https://www.ign.es/wfs-inspire/unidades-administrativas',
  'https://servicios.idee.es/wfs-inspire/transportes?',
  'https://servicios.idee.es/wfs-inspire/transportes',
  'https://servicios.idee.es/wfs-inspire/ocupacion-suelo?',
  'https://servicios.idee.es/wfs-inspire/ocupacion-suelo',
  'https://www.cartociudad.es/wfs-inspire/direcciones?',
  'https://www.cartociudad.es/wfs-inspire/direcciones',
  'http://ideihm.covam.es/wfs/costaspain?',
  'http://ideihm.covam.es/wfs/costaspain',
  'http://ideihm.covam.es/wfs/catalogoENC?',
  'http://ideihm.covam.es/wfs/catalogoENC',
  'http://ideihm.covam.es/wfs/catalogoPapel?',
  'http://ideihm.covam.es/wfs/catalogoPapel',
  'http://ideihm.covam.es/wfs/lucesIHM?',
  'http://ideihm.covam.es/wfs/lucesIHM',
  'http://ideihm.covam.es/wfs/limitesMAR?',
  'http://ideihm.covam.es/wfs/limitesMAR',
  'http://ideihm.covam.es/wfs/CartaOF?',
  'http://ideihm.covam.es/wfs/CartaOF',
];

export default class VectorsControl extends M.impl.Control {
  /**
   * This function adds the control to the specified map
   *
   * @public
   * @function
   * @param {M.Map} map to add the plugin
   * @param {HTMLElement} html of the plugin
   * @api stable
   */
  addTo(map, html) {
    /**
     * Facade map
     * @private
     * @type {M.map}
     */
    this.facadeMap_ = map;

    this.distance_ = 30;

    this.selected_ = null;

    this.initOlLayers();
    super.addTo(map, html);
  }

  initOlLayers() {
    this.style_ = (evt) => {
      let style;
      if (evt.getGeometry().getType() === 'LineString') {
        style = [new ol.style.Style({
          stroke: new ol.style.Stroke({
            color: '#4286f4',
            width: 2,
          }),
        })];
      } else {
        style = [new ol.style.Style({
          image: new ol.style.Circle({
            radius: 6,
            fill: new ol.style.Fill({
              color: '#4286f4',
            }),
          }),
          stroke: new ol.style.Stroke({
            color: '#4286f4',
            width: 2,
          }),
          fill: new ol.style.Fill({
            color: '#4286f4',
          }),
        })];
      }

      return style;
    };

    this.source_ = new ol.source.Vector({ wrapX: false });
    this.vector_ = new ol.layer.Vector({
      source: this.source_,
      style: this.style_,
      name: 'capatopo',
    });

    this.vector_.setZIndex(1000000);
    this.facadeMap_.getMapImpl().addLayer(this.vector_);
  }

  /**
   * Creates new OpenLayers vector source
   * @public
   * @function
   * @api
   * @param {Boolean} featuresIncluded - indicates if an OL collection of
   * features should be included in new source
   */
  newVectorSource(featuresIncluded) {
    return featuresIncluded ?
      new ol.source.Vector({ features: new ol.Collection([]) }) :
      new ol.source.Vector();
  }

  /**
   * Transforms x,y coordinates to 4326 on coordinates array.
   * @public
   * @function
   * @api
   * @param {String} codeProjection
   * @param {Array<Number>} oldCoordinates
   */
  getTransformedCoordinates(codeProjection, oldCoordinates) {
    const transformFunction = ol.proj.getTransform(codeProjection, 'EPSG:4326');
    return this.getFullCoordinates(
      oldCoordinates,
      transformFunction(this.getXY(oldCoordinates)),
    );
  }

  /**
   * Given a coordinate set (x, y, altitude?), returns [x,y].
   * @public
   * @function
   * @api
   * @param {Array<Number>} coordinatesSet
   */
  getXY(coordinatesSet) {
    const coordinateCopy = [];
    for (let i = 0; i < coordinatesSet.length; i += 1) coordinateCopy.push(coordinatesSet[i]);
    while (coordinateCopy.length > 2) coordinateCopy.pop();
    return coordinateCopy;
  }

  /**
   * Substitutes x, y coordinates on coordinate set (x, y, altitude...)
   * @public
   * @function
   * @api
   * @param {Array} oldCoordinates
   * @param {Array<Number>} newXY - [x,y]
   */
  getFullCoordinates(oldCoordinates, newXY) {
    const newCoordinates = oldCoordinates;
    newCoordinates[0] = newXY[0];
    newCoordinates[1] = newXY[1];
    return newCoordinates;
  }

  /**
   * This function adds draw interaction to map.
   * @public
   * @function
   * @api
   */
  addDrawInteraction(layer, geom) {
    const olMap = this.facadeMap_.getMapImpl();
    const vectorSource = layer.getImpl().getOL3Layer().getSource();
    const geometry = layer.getGeometryType() !== null ? layer.getGeometryType() : layer.geometry;
    this.draw = this.newDrawInteraction(vectorSource, geometry);
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
      this.facadeControl.onDraw(event);
    });

    document.addEventListener('keyup', this.addEscEvent.bind(this));
    this.draw.once('drawstart', (evt) => {
      document.onkeydown = this.addUndoEvent.bind(this, evt.feature);
      // document.addEventListener('keydown', this.addUndoEvent.bind(this, evt.feature));
    });
  }

  addUndoEvent(feature, evt) {
    if (evt.ctrlKey && evt.key === 'z') {
      this.draw.removeLastPoint();
    }
  }

  addEscEvent(evt) {
    if (evt.key === 'Escape') {
      this.facadeControl.deactivateDrawing();
      this.facadeControl.isDrawingActive = false;
      this.facadeControl.drawLayer = undefined;
    }
  }

  /**
   * Removes draw interaction from map.
   * @public
   * @function
   * @api
   */
  removeDrawInteraction() {
    document.onkeydown = null;
    this.facadeMap_.getMapImpl().removeInteraction(this.draw);
  }

  /**
   * Removes edit interaction
   * @public
   * @api
   * @function
   */
  removeEditInteraction() {
    this.facadeMap_.getMapImpl().removeInteraction(this.edit);
  }

  /**
   * Removes select interaction
   * @public
   * @function
   * @api
   */
  removeSelectInteraction() {
    this.facadeMap_.getMapImpl().removeInteraction(this.select);
  }

  /**
   * Creates new OpenLayers draw interaction
   * @public
   * @function
   * @api
   * @param {OLVectorSource} vectorSource -
   * @param {String} geometry - type of geometry ['Point', 'LineString', 'Polygon']
   */
  newDrawInteraction(vectorSource, geometry) {
    return new ol.interaction.Draw({
      source: vectorSource,
      type: geometry,
    });
  }

  /**
   * Creates polygon feature from extent.
   * @public
   * @function
   * @api
   * @param {Array} extent - geometry extent
   */
  newPolygonFeature(extent) {
    return new ol.Feature({ geometry: ol.geom.Polygon.fromExtent(extent) });
  }

  /**
   * Creates current feature clone.
   * @public
   * @function
   * @api
   */
  getMapeaFeatureClone() {
    // eslint-disable-next-line no-underscore-dangle
    const implFeatureClone = this.facadeControl.feature.getImpl().olFeature_.clone();
    const emphasis = M.impl.Feature.olFeature2Facade(implFeatureClone);
    return emphasis;
  }

  /**
   * Deletes attributes from feature.
   * @public
   * @function
   * @api
   * @param {M.Feature} feature
   */
  unsetAttributes(feature) {
    const properties = feature.getImpl().getOLFeature().getProperties();
    const keys = Object.keys(properties);
    keys.forEach((key) => {
      if (key !== 'geometry') feature.getImpl().getOLFeature().unset(key);
    });
  }

  /**
   * Activates selection mode.
   * @public
   * @function
   * @api
   */
  activateSelection(layer) {
    const olMap = this.facadeMap_.getMapImpl();
    const facadeControl = this.facadeControl;
    const drawingLayer = layer.getImpl().getOL3Layer();

    if (drawingLayer) {
      this.select = new ol.interaction.Select({
        wrapX: false,
        layers: [drawingLayer],
      });

      this.select.on('select', (e) => {
        if (e.target.getFeatures().getArray().length > 0) {
          facadeControl.onSelect(e);
        }
      });

      olMap.addInteraction(this.select);

      this.edit = new ol.interaction.Modify({ features: this.select.getFeatures() });
      this.edit.on('modifyend', (evt) => {
        facadeControl.onModify();
      });
      olMap.addInteraction(this.edit);
    }
  }

  /**
   * Loads GeoJSON layer
   * @public
   * @function
   * @param {*} source2 -
   */
  loadGeoJSONLayer(source, layerName) {
    let features = new ol.format.GeoJSON()
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });

    features = this.featuresToFacade(features);
    const layer = new M.layer.Vector({ name: layerName, legend: layerName, extract: false });
    layer.addFeatures(features);
    this.facadeMap_.addLayers(layer);
    return features;
  }

  /**
   * Loads GML layer
   * @public
   * @function
   * @param {*} source -
   */
  loadGMLLayer(source, layerName) {
    let newSource = source;
    let srs = this.facadeMap_.getProjection().code;
    if (newSource.indexOf('srsName="GCS_WGS_1984"') > -1) {
      newSource = newSource.replace(/srsName="GCS_WGS_1984"/gi, 'srsName="EPSG:4326"');
    }

    if (newSource.indexOf('cp:geometry') > -1) {
      newSource = newSource.replace(/cp:geometry/gi, 'ogr:geometryProperty');
    }

    if (newSource.indexOf('certificacion:the_geom') > -1) {
      newSource = newSource.replace(/certificacion:the_geom/gi, 'ogr:geometryProperty');
    }

    if (newSource.split('srsName="')[1].indexOf('http') > -1) {
      try {
        srs = `EPSG:${newSource.split('srsName="')[1].split('#')[1].split('"')[0]}`;
      } catch (err) {
        srs = `EPSG:${newSource.split('srsName="')[1].split('/EPSG/')[1].split('/')[1]}`;
      }
    } else if (newSource.split('srsName="')[1].indexOf('crs:EPSG::') > -1) {
      srs = `EPSG:${newSource.split('srsName="')[1].split('::')[1].split('"')[0]}`;
    } else {
      srs = newSource.split('srsName="')[1].split('"')[0];
    }

    if (newSource.indexOf('<member>') > -1) {
      newSource = newSource.replace(/member/gi, 'gml:featureMember');
    } else if (newSource.indexOf('<wfs:member>') > -1) {
      newSource = newSource.replace(/wfs:member/gi, 'gml:featureMember');
    } else if (newSource.indexOf('<ogr:featureMember>') > -1) {
      newSource = newSource.replace(/ogr:featureMember/gi, 'gml:featureMember');
    }

    let features = new ol.format.WFS({ gmlFormat: new ol.format.GML2() }).readFeatures(newSource, {
      dataProjection: srs,
      featureProjection: this.facadeMap_.getProjection().code,
    });

    features = features.map((f, index) => {
      const newF = f;
      if (!f.getGeometry()) {
        newF.setGeometry(f.get('geometry'));
      }

      return newF;
    });

    if (features.length === 0 || features[0].getGeometry() === undefined) {
      features = new ol.format.WFS({ gmlFormat: new ol.format.GML3() }).readFeatures(newSource, {
        dataProjection: srs,
        featureProjection: this.facadeMap_.getProjection().code,
      });

      features = features.map((f, index) => {
        const newF = f;
        if (!f.getGeometry()) {
          newF.setGeometry(f.get('geometry'));
        }

        return newF;
      });
    }

    features = this.featuresToFacade(features);
    const layer = new M.layer.Vector({ name: layerName, legend: layerName, extract: false });
    layer.addFeatures(features);
    this.facadeMap_.addLayers(layer);
    return features;
  }

  /**
   * Loads GeoJSON layer
   * @public
   * @function
   * @param {*} source-
   */
  loadAllInGeoJSONLayer(sources, layerName) {
    let features = [];
    sources.forEach((source) => {
      const localFeatures = new ol.format.GeoJSON()
        .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });
      if (localFeatures !== null && localFeatures !== undefined && localFeatures.length > 0) {
        features = features.concat(localFeatures);
      }
    });

    features = this.featuresToFacade(features);
    const layer = new M.layer.Vector({ name: layerName, legend: layerName, extract: false });
    layer.addFeatures(features);
    this.facadeMap_.addLayers(layer);
    return features;
  }

  /**
   * Loads KML layer
   * @public
   * @function
   * @api
   * @param {*} source -
   * @param {*} extractStyles -
   */
  loadKMLLayer(source, layerName, extractStyles) {
    let features = new ol.format.KML({ extractStyles })
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });

    features = this.featuresToFacade(features);
    features = this.geometryCollectionParse(features);
    const layer = new M.layer.Vector({ name: layerName, legend: layerName, extract: false });
    layer.addFeatures(features);
    this.facadeMap_.addLayers(layer);
    return features;
  }

  /**
   * Loads GPX layer.
   * @public
   * @function
   * @api
   * @param {*} source -
   */
  loadGPXLayer(source, layerName) {
    let features = [];
    const origFeatures = new ol.format.GPX()
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });
    origFeatures.forEach((f) => {
      if (f.getGeometry().getType() === 'MultiLineString') {
        if (f.getGeometry().getLineStrings().length === 1) {
          const geom = f.getGeometry().getLineStrings()[0];
          if (geom.getCoordinates().length > 150) {
            let i = 2;
            let newGeom = geom.simplify(i);
            while (newGeom.getCoordinates().length > 150) {
              i += 1;
              newGeom = geom.simplify(i);
            }

            f.setGeometry(newGeom);
          } else {
            f.setGeometry(geom);
          }
        }
      }

      features.push(f);
    });

    features = this.featuresToFacade(features);
    const layer = new M.layer.Vector({ name: layerName, legend: layerName, extract: false });
    layer.addFeatures(features);
    this.facadeMap_.addLayers(layer);
    return features;
  }

  /**
   * Converts Openlayers features to Mapea features.
   * @public
   * @function
   * @api
   * @param {Array<OL.Feature>} implFeatures
   * @returns {Array<M.Feature>}
   */
  featuresToFacade(implFeatures) {
    return implFeatures.map((feature) => {
      return M.impl.Feature.olFeature2Facade(feature);
    });
  }

  /**
   * Centers on features
   * @public
   * @function
   * @api
   * @param {*} features -
   */
  centerFeatures(features) {
    if (!M.utils.isNullOrEmpty(features)) {
      if ((features.length === 1) && (features[0].getGeometry().type === 'Point')) {
        const pointView = new ol.View({
          center: features[0].getGeometry().coordinates,
          zoom: 15,
        });
        this.facadeMap_.getMapImpl().setView(pointView);
      } else {
        const extent = M.impl.utils.getFeaturesExtent(features);
        this.facadeMap_.getMapImpl().getView().fit(extent, {
          duration: 500,
          minResolution: 1,
        });
      }

      features.forEach((f) => {
        switch (f.getGeometry().type) {
          case 'Point':
          case 'MultiPoint':
            const newPointStyle = new M.style.Point({
              radius: 6,
              fill: {
                color: '#71a7d3',
              },
              stroke: {
                color: 'white',
                width: 2,
              },
            });
            if (f !== undefined) f.setStyle(newPointStyle);
            break;
          case 'LineString':
          case 'MultiLineString':
            const newLineStyle = new M.style.Line({
              stroke: {
                color: '#71a7d3',
                width: 6,
                linedash: undefined,
              },
            });
            if (f !== undefined) f.setStyle(newLineStyle);
            break;
          case 'Polygon':
          case 'MultiPolygon':
            const newPolygonStyle = new M.style.Polygon({
              fill: {
                color: '#71a7d3',
                opacity: 0.2,
              },
              stroke: {
                color: '#71a7d3',
                width: 6,
              },
            });
            if (f !== undefined) f.setStyle(newPolygonStyle);
            break;
          default:
            break;
        }
      });
    }
  }

  /**
   * Gets extent of feature
   * @public
   * @function
   * @api
   * @param {M.Featuer} mapeaFeature
   */
  getFeatureExtent() {
    return this.facadeControl.feature.getImpl().getOLFeature().getGeometry().getExtent();
  }

  /**
   * Gets coordinates of current feature.
   * @public
   * @function
   * @api
   */
  getFeatureCoordinates() {
    return this.facadeControl.feature.getImpl().getOLFeature().getGeometry().getCoordinates();
  }

  /**
   * Gets feature length
   * @public
   * @function
   * @api
   */
  getFeatureLength() {
    let res = 0;
    const geom = this.facadeControl.feature.getImpl().getOLFeature().getGeometry();
    if (typeof geom.getLength !== 'function') {
      geom.getLineStrings().forEach((line) => {
        res += this.getGeometryLength(line);
      });
    } else {
      res = this.getGeometryLength(geom);
    }

    return res;
  }

  getGeometryLength(geometry) {
    let length = 0;
    const codeProj = this.facadeMap_.getProjection().code;
    const unitsProj = this.facadeMap_.getProjection().units;
    if (codeProj === 'EPSG:3857') {
      length = ol.sphere.getLength(geometry);
    } else if (unitsProj === 'd') {
      const coordinates = geometry.getCoordinates();
      for (let i = 0, ii = coordinates.length - 1; i < ii; i += 1) {
        length += ol.sphere.getDistance(ol.proj.transform(coordinates[i], codeProj, 'EPSG:4326'), ol.proj.transform(coordinates[i + 1], codeProj, 'EPSG:4326'));
      }
    } else {
      length = geometry.getLength();
    }

    return length;
  }

  /**
   * Gets feature area
   * @public
   * @function
   * @api
   */
  getFeatureArea() {
    const projection = this.facadeMap_.getProjection();
    const geom = this.facadeControl.feature.getImpl().getOLFeature().getGeometry();
    return ol.sphere.getArea(geom, { projection: projection.code });
  }

  /**
   * Convert olFeature to M.Feature
   * @public
   * @function
   * @api
   */
  convertToMFeatures(olFeature) {
    const feature = new M.Feature(olFeature.getId(), {
      geometry: {
        coordinates: olFeature.getGeometry().getCoordinates(),
        type: olFeature.getGeometry().getType(),
      },
      properties: olFeature.getProperties(),
    });

    return feature;
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

  calculateProfile(feature) {
    const coordinates = feature.getGeometry().coordinates;
    let pointsCoord = '';
    for (let i = 1; i < coordinates.length; i += 1) {
      pointsCoord = pointsCoord.concat(this.findNewPoints(coordinates[i - 1], coordinates[i]));
    }

    let pointsBbox = pointsCoord.split('|');
    while (pointsBbox.length > 150) {
      pointsBbox = pointsBbox.filter((elem, i) => {
        return i % 2 === 0;
      });
    }

    const altitudes = [];
    const promises = [];
    pointsBbox = pointsBbox.filter((elem) => {
      return elem !== '' && elem.trim().length > 3;
    });

    pointsBbox.forEach((bbox) => {
      const url = `${PROFILE_URL}${bbox}${PROFILE_URL_SUFFIX}`;
      promises.push(M.remote.get(url));
    });

    Promise.all(promises).then((responses) => {
      responses.forEach((response) => {
        let alt = 0;
        if (response.text.indexOf('dy') > -1) {
          alt = response.text.split('dy')[1].split(' ').filter((item) => {
            return item !== '';
          })[1];
        } else if (response.text.indexOf('cellsize') > -1) {
          alt = response.text.split('cellsize')[1].split(' ').filter((item) => {
            return item !== '';
          })[1];
        }

        altitudes.push(parseFloat(alt));
      });

      const arrayXZY = [];
      altitudes.forEach((data, index) => {
        const points = pointsBbox[index].split(',');
        const center = ol.extent.getCenter([parseFloat(points[0]), parseFloat(points[1]),
          parseFloat(points[2]), parseFloat(points[3])]);
        arrayXZY.push([center[0], center[1], data]);
      });

      const arrayXZY2 = arrayXZY.map((coord) => {
        return ol.proj.transform(coord, 'EPSG:4326', this.facadeMap_.getProjection().code);
      });

      this.showProfile(arrayXZY2);
    }).catch((err) => {
      M.dialog.error(getValue('exception.query_profile'), 'Error');
    });
  }

  showProfile(coord) {
    const lineString = new ol.geom.LineString(coord);
    const feature = new ol.Feature({
      geometry: lineString,
      name: 'Line',
    });

    this.pt = new ol.Feature(new ol.geom.Point([0, 0]));
    const profil = new Profil({
      info: {
        zmin: getValue('zmin'),
        zmax: getValue('zmax'),
        altitude: getValue('altitude'),
        distance: getValue('distance'),
        ytitle: getValue('ytitle'),
        xtitle: getValue('xtitle'),
        altitudeUnits: 'm',
        distanceUnitsM: 'm',
        distanceUnitsKM: 'km',
      },
      projection: this.facadeMap_.getProjection().code,
      map: this.facadeMap_.getMapImpl(),
      title: getValue('profile'),
      pointLayer: this.source_,
      width: 400,
      height: 200,
    });

    this.facadeMap_.getMapImpl().addControl(profil);
    const drawPoint = (e) => {
      if (!this.pt) return;
      if (e.type === 'over') {
        this.pt.setGeometry(new ol.geom.Point(e.coord));
        this.pt.setStyle([new ol.style.Style({
          image: new ol.style.Circle({
            radius: 7,
            fill: new ol.style.Fill({
              color: '#ff0000',
            }),
          }),
        })]);
      } else {
        this.pt.setStyle([]);
      }
    };

    profil.setGeometry(feature);
    this.pt.setStyle([]);
    this.source_.addFeature(this.pt);
    profil.on(['over', 'out'], (e) => {
      if (e.type === 'over') profil.popup(`${e.coord[2]} m`);
      drawPoint(e);
    });

    profil.show();
  }

  findNewPoints(originPoint, destPoint) {
    const srs = this.facadeMap_.getProjection().code;
    const oriMete = ol.proj.transform(originPoint, srs, MERCATOR);
    const destMete = ol.proj.transform(destPoint, srs, MERCATOR);
    const angle = this.getAngleBetweenPoints(oriMete, destMete);
    const distance = this.getDistBetweenPoints(originPoint, destPoint);
    let addX;
    let addY;
    let res;
    let points = '';
    if (distance >= 50) {
      const distPoint = (distance / this.distance_ > this.distance_) ?
        distance / this.distance_ : this.distance_;
      for (let i = 0; i <= distance / distPoint; i += 1) {
        if (angle >= 0 && angle <= 90) {
          [addX, addY] = [1, 1];
        } else if (angle >= 90) {
          [addX, addY] = [-1, 1];
        } else if (angle <= 0 && angle >= -90) {
          [addX, addY] = [1, -1];
        } else {
          [addX, addY] = [-1, -1];
        }
        const nPA = [(Math.cos((angle * Math.PI) / 180) * (distPoint * i)) + oriMete[0],
          (Math.sin((angle * Math.PI) / 180) * (distPoint * i)) + oriMete[1]];
        const nPB = [(Math.cos((angle * Math.PI) / 180) * ((distPoint * i) + addX)) + oriMete[0],
          (Math.sin((angle * Math.PI) / 180) * ((distPoint * i) + addY)) + oriMete[1]];
        const coord1 = (ol.proj.transform(nPA, MERCATOR, WGS84));
        const coord2 = (ol.proj.transform(nPB, MERCATOR, WGS84));
        points += `${coord1},${coord2}|`;
      }

      res = points;
    }

    return res;
  }


  getDistBetweenPoints(firstPoint, secondPoint) {
    const srs = this.facadeMap_.getProjection().code;
    const line = new ol.geom.LineString([ol.proj.transform(firstPoint, srs, MERCATOR),
      ol.proj.transform(secondPoint, srs, MERCATOR)]);
    return line.getLength();
  }

  getAngleBetweenPoints(firstPoint, secondPoint) {
    const p1 = { x: firstPoint[0], y: firstPoint[1] };
    const p2 = { x: secondPoint[0], y: secondPoint[1] };
    return (Math.atan2(p2.y - p1.y, p2.x - p1.x) * 180) / Math.PI;
  }

  removeMapEvents(map) {
    this.removeMapOverlays(map);
    map.getMapImpl().removeEventListener('pointermove');
  }

  addMapsEvents(map) {
    map.getMapImpl().on('pointermove', (evt) => {
      if (this.selected_ !== null) {
        this.removeMapOverlays(map);
        this.selected_ = null;
      }

      const layers = [];
      map.getMapImpl().forEachFeatureAtPixel(evt.pixel, (feature) => {
        if (feature.getId() !== undefined && feature.getId() !== null) {
          const filtered = map.getLayers().filter((l) => {
            return ['kml', 'geojson', 'wfs', 'vector'].indexOf(l.type.toLowerCase()) > -1 && l.getFeatureById(feature.getId()) !== undefined;
          });

          if (filtered.length > 0) {
            const layer = filtered[0];
            const name = layer.legend || layer.name;
            if (layers.indexOf(name) < 0) {
              layers.push(name);
            }
          }

          this.selected_ = feature;
        }
      });

      if (layers.length > 0 && this.selected_ !== null) {
        let layerNames = '';
        layers.forEach((layerName) => {
          layerNames += `<p>- ${layerName}</p>`;
        });

        const htmlString = `<div id='popup-overlay' class='popup-overlay-container'>
          <div class='popup-overlay-title'>
            ${getValue('vector_layers')}
            <button id='overlay-close-button' class='popup-overlay-close-button'>
              X
            </button>
          </div>
          <div class='popup-overlay-info-container'>
            <div>
              ${layerNames}
            </div>
          </div>
        </div>`;

        const doc = new DOMParser().parseFromString(htmlString, 'text/html');
        const overlay = new ol.Overlay({
          element: doc.getElementById('popup-overlay'),
          stopEvent: true,
          autoPan: true,
          autoPanAnimation: {
            duration: 250,
          },
          position: evt.coordinate,
          positioning: 'top-right',
        });

        map.getMapImpl().addOverlay(overlay);
        document.getElementById('overlay-close-button').addEventListener('click', this.removeMapOverlays.bind(null, map));
      } else {
        this.removeMapOverlays(map);
      }
    });
  }

  removeMapOverlays(map) {
    const overlays = map.getMapImpl().getOverlays().getArray();
    overlays.forEach((item) => {
      if (item.getKeys().indexOf('element') > -1 &&
      item.element.innerHTML.indexOf('m-measure') < 0) {
        map.getMapImpl().removeOverlay(item);
      }
    });
  }

  addWFSLayer(url, name, legend) {
    const map = this.facadeMap_;
    const srs = map.getProjection().code;
    if (WFS_EXCEPTIONS.indexOf(url) > -1) {
      const facadeControl = this.facadeControl;
      if (map.getZoom() >= facadeControl.wfszoom) {
        let cancelFlag = false;
        const content = '<p class="m-vectors-loading"><span class="icon-spinner" /></p>';
        M.dialog.info(content, getValue('loading'));
        setTimeout(() => {
          document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
          const button = document.querySelector('div.m-dialog.info div.m-button > button');
          button.innerHTML = getValue('cancel');
          button.style.width = '75px';
          button.style.backgroundColor = '#71a7d3';
          button.addEventListener('click', (e) => {
            e.preventDefault();
            cancelFlag = true;
          });

          const bbox = map.getBbox();
          const extent = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
          const wfsURL = `${url}service=WFS&version=2.0.0&request=GetFeature&typename=${name}&` +
            `outputFormat=${encodeURIComponent(GML_FORMAT)}&srsName=${srs}&bbox=${extent.join(',')},${srs}`;
          const layer = new M.layer.Vector({ name, legend, extract: false });
          M.remote.get(wfsURL).then((response) => {
            if (!cancelFlag) {
              const responseWFS = response.text.replace(/wfs:member/gi, 'gml:featureMember');
              const formatter = new ol.format.WFS({ gmlFormat: ol.format.GML2() });
              let features = formatter.readFeatures(responseWFS);
              features = features.map((f, index) => {
                const newF = f;
                if (!f.getGeometry()) {
                  newF.setGeometry(f.get('geometry'));
                }

                return newF;
              });

              if (features.length > 0) {
                features = this.featuresToFacade(features);
                layer.addFeatures(features);
                layer.updatable = true;
                layer.url = url;
                this.facadeMap_.addLayers(layer);
                document.querySelector('div.m-mapea-container div.m-dialog').remove();
              } else {
                document.querySelector('div.m-mapea-container div.m-dialog').remove();
                M.dialog.error(getValue('exception.error_no_features_wfs'), 'Error');
              }
            } else {
              document.querySelector('div.m-mapea-container div.m-dialog').remove();
            }
          }).catch(() => {
            document.querySelector('div.m-mapea-container div.m-dialog').remove();
            if (!cancelFlag) {
              M.dialog.error(getValue('exception.error_features_wfs'), 'Error');
            }
          });
        }, 10);
      } else {
        const levels = facadeControl.wfszoom - map.getZoom();
        M.dialog.info(getValue('exception.wfs_zoom').replace('*', levels), getValue('warning'));
      }
    } else {
      try {
        const layer = new M.layer.WFS({
          url,
          name,
          legend,
        });

        this.facadeMap_.addLayers(layer);
        this.waitLayerLoaded(layer);
      } catch (err) {
        M.dialog.error(getValue('exception.error_wfs'), 'Error');
      }
    }
  }

  reloadFeaturesUpdatables(layerName, layerURL) {
    const map = this.facadeMap_;
    const srs = map.getProjection().code;
    const filtered = map.getLayers().filter((layer) => {
      return ['kml', 'geojson', 'wfs', 'vector'].indexOf(layer.type.toLowerCase()) > -1 && layer.isVisible() &&
        layer.name !== undefined && layer.name !== 'selectLayer' && layer.name !== '__draw__' && layer.updatable &&
        layer.name === layerName && layer.url === layerURL;
    });

    if (filtered.length > 0) {
      const layer = filtered[0];
      const facadeControl = this.facadeControl;
      if (map.getZoom() >= facadeControl.wfszoom) {
        let cancelFlag = false;
        const content = '<p class="m-vectors-loading"><span class="icon-spinner" /></p>';
        M.dialog.info(content, getValue('loading'));
        setTimeout(() => {
          document.querySelector('div.m-mapea-container div.m-dialog div.m-title').style.backgroundColor = '#71a7d3';
          const button = document.querySelector('div.m-dialog.info div.m-button > button');
          button.innerHTML = getValue('cancel');
          button.style.width = '75px';
          button.style.backgroundColor = '#71a7d3';
          button.addEventListener('click', (e) => {
            e.preventDefault();
            cancelFlag = true;
          });

          const bbox = map.getBbox();
          const extent = [bbox.x.min, bbox.y.min, bbox.x.max, bbox.y.max];
          const wfsURL = `${layer.url}service=WFS&version=2.0.0&request=GetFeature&typename=${layer.name}&` +
            `outputFormat=${encodeURIComponent(GML_FORMAT)}&srsName=${srs}&bbox=${extent.join(',')},${srs}`;
          M.remote.get(wfsURL).then((response) => {
            if (!cancelFlag) {
              const responseWFS = response.text.replace(/wfs:member/gi, 'gml:featureMember');
              const formatter = new ol.format.WFS({ gmlFormat: ol.format.GML2() });
              let features = formatter.readFeatures(responseWFS);
              features = features.map((f, index) => {
                const newF = f;
                if (!f.getGeometry()) {
                  newF.setGeometry(f.get('geometry'));
                }

                return newF;
              });

              if (features.length > 0) {
                features = this.featuresToFacade(features);
                layer.removeFeatures(layer.getFeatures());
                layer.addFeatures(features);
                document.querySelector('div.m-mapea-container div.m-dialog').remove();
              } else {
                document.querySelector('div.m-mapea-container div.m-dialog').remove();
                M.dialog.error(getValue('exception.error_no_features_wfs'), 'Error');
              }
            } else {
              document.querySelector('div.m-mapea-container div.m-dialog').remove();
            }
          }).catch(() => {
            document.querySelector('div.m-mapea-container div.m-dialog').remove();
            if (!cancelFlag) {
              M.dialog.error(getValue('exception.error_features_wfs'), 'Error');
            }
          });
        }, 10);
      } else {
        const levels = facadeControl.wfszoom - map.getZoom();
        M.dialog.info(getValue('exception.wfs_zoom').replace('*', levels), getValue('warning'));
      }
    } else {
      M.dialog.error(getValue('exception.error_features_wfs'), 'Error');
    }
  }

  waitLayerLoaded(layer) {
    if (layer.getGeometryType() === null) {
      setTimeout(() => {
        this.waitLayerLoaded(layer);
      }, 200);
    } else {
      this.facadeControl.renderLayers();
    }
  }
}
