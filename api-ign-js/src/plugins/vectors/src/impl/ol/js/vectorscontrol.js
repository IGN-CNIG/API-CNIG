/**
 * @module M/impl/control/VectorsControl
 */

import Profil from './profilcontrol';
import { getValue } from '../../../facade/js/i18n/language';

const WGS84 = 'EPSG:4326';
const MERCATOR = 'EPSG:900913';
const PROFILE_URL = 'https://servicios.idee.es/wcs-inspire/mdt?request=GetCoverage&bbox=';
const PROFILE_URL_SUFFIX = '&service=WCS&version=1.0.0&coverage=Elevacion4258_5&' +
'interpolationMethod=bilinear&crs=EPSG%3A4258&format=ArcGrid&width=2&height=2';

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

    this.draw.on('drawstart', () => {
      document.addEventListener('keydown', this.addUndoEvent.bind(this));
    });
  }

  addUndoEvent(evt) {
    if (evt.ctrlKey && evt.key === 'z') {
      this.draw.removeLastPoint();
    }
  }

  /**
   * Removes draw interaction from map.
   * @public
   * @function
   * @api
   */
  removeDrawInteraction() {
    this.facadeMap_.getMapImpl().removeInteraction(this.draw);
    document.removeEventListener('keydown', this.addUndoEvent);
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
   * @param {*} source2 -
   */
  loadGMLLayer(source, layerName) {
    let srs = this.facadeMap_.getProjection().code;
    let features = [];
    if (source.split('srsName="')[1].indexOf('http') > -1 && source.indexOf('gml:pos') > -1) {
      srs = `EPSG:${source.split('srsName="')[1].split('#')[1].split('"')[0]}`;
      features = new ol.format.WFS({ gmlFormat: new ol.format.GML3() }).readFeatures(source, {
        dataProjection: srs,
        featureProjection: this.facadeMap_.getProjection().code,
      });
    } else if (source.split('srsName="')[1].indexOf('crs:EPSG::') > -1 && source.indexOf('gml:pos') > -1) {
      srs = `EPSG:${source.split('srsName="')[1].split('::')[1].split('"')[0]}`;
      features = new ol.format.WFS({ gmlFormat: new ol.format.GML3() }).readFeatures(source, {
        dataProjection: srs,
        featureProjection: this.facadeMap_.getProjection().code,
      });
    } else if (source.indexOf('gml:coordinates') > -1) {
      srs = source.split('srsName="')[1].split('"')[0];
      features = new ol.format.WFS({ gmlFormat: new ol.format.GML2() }).readFeatures(source, {
        dataProjection: srs,
        featureProjection: this.facadeMap_.getProjection().code,
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
   * @param {*} source2 -
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
    let features = new ol.format.GPX()
      .readFeatures(source, { featureProjection: this.facadeMap_.getProjection().code });

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
        res += line.getLength();
      });
    } else {
      res = geom.getLength();
    }

    return res;
  }

  /**
   * Gets feature area
   * @public
   * @function
   * @api
   */
  getFeatureArea() {
    return this.facadeControl.feature.getImpl().getOLFeature().getGeometry().getArea();
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
        const alt = response.text.split('dy')[1].split(' ').filter((item) => {
          return item !== '';
        })[1];
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
    }).catch(() => {
      M.dialog.error(getValue('exception.query_profile'), 'Error');
    });
  }

  showProfile(coord) {
    const lineString = new ol.geom.LineString(coord);
    const feature = new ol.Feature({
      geometry: lineString,
      name: 'Line',
    });

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
    });

    this.facadeMap_.getMapImpl().addControl(profil);
    const drawPoint = (e) => {
      if (!this.pt) return;
      if (e.type === 'over') {
        this.pt.setGeometry(new ol.geom.Point(e.coord));
        this.pt.setStyle(null);
      } else {
        this.pt.setStyle([]);
      }
    };

    profil.setGeometry(feature);
    this.pt = new ol.Feature(new ol.geom.Point([0, 0]));
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
}
