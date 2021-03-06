/**
 * @module M/impl/utils
 */
import Feature from 'M/feature/Feature';
import * as WKT from 'M/geom/WKT';
import { isNullOrEmpty, isString } from 'M/util/Utils';
import { getWidth, extend } from 'ol/extent';
import { get as getProj, getTransform, transformExtent } from 'ol/proj';
import RenderFeature from 'ol/render/Feature';

const getUnitsPerMeter = (projectionCode, meter) => {
  const projection = getProj(projectionCode);
  const metersPerUnit = projection.getMetersPerUnit();
  return meter / metersPerUnit;
};

export const geojsonTo4326 = (featuresAsJSON, codeProjection) => {
  const transformFunction = getTransform(codeProjection, 'EPSG:4326');
  const jsonResult = [];
  let jsonFeature = {};
  featuresAsJSON.forEach((featureAsJSON) => {
    const coordinates = [];
    if (Array.isArray(featureAsJSON.geometry.coordinates[0]) &&
      featuresAsJSON.length > 1) { // Type Polygon
      featureAsJSON.geometry.coordinates.forEach((aCoordinates) => {
        if (!Number.isFinite(aCoordinates[0]) && Array.isArray(aCoordinates)) {
          coordinates.push(aCoordinates.map((cord) => {
            const arrayAuxCC = [];
            if (Number.isFinite(cord[0])) {
              arrayAuxCC.push(transformFunction(cord));
            } else {
              cord.forEach((coordinate) => {
                arrayAuxCC.push(transformFunction(coordinate));
              });
            }
            return arrayAuxCC;
          }));
          jsonFeature = {
            ...featureAsJSON,
            geometry: {
              type: featureAsJSON.geometry.type,
              coordinates,
            },
          };
        } else { // type line
          const coordinate = transformFunction(aCoordinates);
          coordinates.push(coordinate);
          jsonFeature = {
            ...featureAsJSON,
            geometry: {
              type: featureAsJSON.geometry.type,
              coordinates,
            },
          };
        }
      }); // Type Point
      jsonResult.push(jsonFeature);
    } else if (featureAsJSON.geometry.coordinates.length === 3) {
      featureAsJSON.geometry.coordinates.pop();
      jsonFeature = {
        ...featureAsJSON,
        geometry: {
          type: featureAsJSON.geometry.type,
          coordinates: transformFunction(featureAsJSON.geometry.coordinates),
        },
      };
      jsonResult.push(jsonFeature);
    } else if (featuresAsJSON.length === 1) { // the layer has only one feature line
      if (featureAsJSON.geometry.coordinates[0].length > 2) {
        const coordinatesPolygon = featureAsJSON.geometry.coordinates[0]
          .map(coord => transformFunction(coord));
        jsonFeature = {
          ...featureAsJSON,
          geometry: {
            type: featureAsJSON.geometry.type,
            coordinates: coordinatesPolygon,
          },
        };
        jsonResult.push(jsonFeature);
      } else {
        jsonFeature = {
          ...featureAsJSON,
          geometry: {
            type: featureAsJSON.geometry.type,
            coordinates: transformFunction(featureAsJSON.geometry.coordinates[0]),
          },
        };
        jsonResult.push(jsonFeature);
      }
    } else if (Number.isFinite(featureAsJSON.geometry.coordinates[0])) {
      const coordTransformed = transformFunction(featureAsJSON.geometry.coordinates);
      jsonFeature = {
        ...featureAsJSON,
        geometry: {
          type: featureAsJSON.geometry.type,
          coordinates: coordTransformed,
        },
      };
      jsonResult.push(jsonFeature);
    }
  });
  return jsonResult;
};


/**
 * @classdesc
 * Static utils class.
 * @api
 */
class Utils {
  /**
   *
   * @function
   * @api stable
   */
  static generateResolutions(projection, extent, minZoom, maxZoom) {
    let newExtent;
    let newMinZoom;
    let newMaxZoom;
    const generatedResolutions = [];
    const defaultMaxZoom = 28;
    // extent
    if (isNullOrEmpty(extent)) {
      newExtent = projection.getExtent();
    }
    // size
    const size = getWidth(newExtent) / 256;

    if (isNullOrEmpty(minZoom)) {
      // ol.DEFAULT_MIN_ZOOM;
      newMinZoom = 0;
    }
    if (isNullOrEmpty(maxZoom)) {
      newMaxZoom = defaultMaxZoom;
    }
    const zoomLevels = newMaxZoom - newMinZoom;

    for (let i = 0; i < zoomLevels; i += 1) {
      generatedResolutions[i] = size / (2 ** i);
    }

    return generatedResolutions;
  }

  /**
   *
   * @function
   * @api stable
   */
  static addOverlayImage(overlayImage, map) {
    map.getMapImpl().updateSize();
    const mapSize = map.getMapImpl().getSize();
    const screenXY = overlayImage.screenXY;
    const screenXUnits = overlayImage.screenXUnits;
    const screenYUnits = overlayImage.screenYUnits;
    const overlayXY = overlayImage.overlayXY;
    const overlayXUnits = overlayImage.overlayXUnits;
    const overlayYUnits = overlayImage.overlayYUnits;
    const size = overlayImage.size;
    const src = overlayImage.src;

    // src
    const img = document.createElement('img');
    img.src = src;

    // size
    img.style.width = `${size[0]}px`;
    img.style.height = `${size[1]}px`;

    // position
    let offsetX = overlayXY[0];
    if (overlayXUnits === 'fraction') {
      offsetX *= size[0];
    }
    let offsetY = overlayXY[1];
    if (overlayYUnits === 'fraction') {
      offsetY = (size[1] - (offsetY * size[1]));
    }
    img.style.position = 'absolute';
    let left = screenXY[0];
    if (screenXUnits === 'fraction') {
      left = (left * mapSize[0]) - offsetX;
    }
    let top = screenXY[1];
    if (screenYUnits === 'fraction') {
      top = (mapSize[1] - (top * mapSize[1])) - offsetY;
    }
    img.style.top = `${top}px`;
    img.style.left = `${left}px`;

    // parent
    const container = map.getMapImpl().getOverlayContainerStopEvent();
    container.appendChild(img);

    return img;
  }


  /**
   * Get the height of an extent.
   * @public
   * @function
   * @param {ol.Extent} extent Extent.
   * @return {number} Height.
   * @api stable
   */
  static getExtentHeight(extent) {
    return extent[3] - extent[1];
  }

  /**
   * Get the width of an extent.
   * @public
   * @function
   * @param {ol.Extent} extent Extent.
   * @return {number} Width.
   * @api stable
   */
  static getExtentWidth(extent) {
    return extent[2] - extent[0];
  }

  /**
   * Calcs the geometry center
   * @public
   * @function
   * @param {ol.geom} geom the ol geometry
   * @return {Array<number>} center coordinates
   * @api stable
   */
  static getCentroid(geometry) {
    let centroid;
    let coordinates;
    let medianIdx;
    let points;
    let lineStrings;
    if (isNullOrEmpty(geometry)) {
      centroid = null;
    } else if (geometry instanceof RenderFeature) {
      centroid = geometry;
    } else {
      switch (geometry.getType()) {
        case 'Point':
          centroid = geometry.getCoordinates();
          break;
        case 'LineString':
        case 'LinearRing':
          coordinates = geometry.getCoordinates();
          medianIdx = Math.floor(coordinates.length / 2);
          centroid = coordinates[medianIdx];
          break;
        case 'Polygon':
          centroid = Utils.getCentroid(geometry.getInteriorPoint());
          break;
        case 'MultiPoint':
          points = geometry.getPoints();
          medianIdx = Math.floor(points.length / 2);
          centroid = Utils.getCentroid(points[medianIdx]);
          break;
        case 'MultiLineString':
          lineStrings = geometry.getLineStrings();
          medianIdx = Math.floor(lineStrings.length / 2);
          centroid = Utils.getCentroid(lineStrings[medianIdx]);
          break;
        case 'MultiPolygon':
          points = geometry.getInteriorPoints();
          centroid = Utils.getCentroid(points);
          break;
        case 'Circle':
          centroid = geometry.getCenter();
          break;
        default:
          return null;
      }
    }
    return centroid;
  }

  /**
   * Get the width of an extent.
   * @public
   * @function
   * @param {ol.Extent} extent Extent.
   * @return {number} Width.
   * @api stable
   */
  static getFeaturesExtent(features, projectionCode) {
    const olFeatures = features.map(f => (f instanceof Feature ? f.getImpl().getOLFeature() : f));
    let extents = olFeatures.map(feature => feature.getGeometry().getExtent().slice(0));
    if (extents.length === 1) {
      const geometry = olFeatures[0].getGeometry();
      if (geometry.getType() === 'Point') {
        const units = getUnitsPerMeter(projectionCode, 1000);
        const coordX = geometry.getCoordinates()[0];
        const coordY = geometry.getCoordinates()[1];
        extents = [
          [
            coordX - units,
            coordY - units,
            coordX + units,
            coordY + units,
          ],
        ];
      }
    }
    return extents.length === 0 ? null : extents.reduce((ext1, ext2) => extend(ext1, ext2));
  }


  /**
   * Get the coordinate of centroid
   * @public
   * @function
   * @param {ol.geom} geometry geometry
   * @return {Arra<number>}
   * @api stable
   */
  static getCentroidCoordinate(geometry) {
    let centroid;
    let coordinates;
    let medianIdx;
    let points;
    let lineStrings;
    let geometries;

    // POINT
    if (geometry.getType() === WKT.POINT) {
      centroid = geometry.getCoordinates();
    } else if (geometry.getType() === WKT.LINE_STRING) {
      // LINE
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    } else if (geometry.getType() === WKT.LINEAR_RING) {
      coordinates = geometry.getCoordinates();
      medianIdx = Math.floor(coordinates.length / 2);
      centroid = coordinates[medianIdx];
    } else if (geometry.getType() === WKT.POLYGON) {
      // POLYGON
      centroid = Utils.getCentroidCoordinate(geometry.getInteriorPoint());
    } else if (geometry.getType() === WKT.MULTI_POINT) {
      // MULTI
      points = geometry.getPoints();
      medianIdx = Math.floor(points.length / 2);
      centroid = Utils.getCentroidCoordinate(points[medianIdx]);
    } else if (geometry.getType() === WKT.MULTI_LINE_STRING) {
      lineStrings = geometry.getLineStrings();
      medianIdx = Math.floor(lineStrings.length / 2);
      centroid = Utils.getCentroidCoordinate(lineStrings[medianIdx]);
    } else if (geometry.getType() === WKT.MULTI_POLYGON) {
      points = geometry.getInteriorPoints();
      centroid = Utils.getCentroidCoordinate(points);
    } else if (geometry.getType() === WKT.CIRCLE) {
      centroid = geometry.getCenter();
    } else if (geometry.getType() === WKT.GEOMETRY_COLLECTION) {
      geometries = geometry.getGeometries();
      medianIdx = Math.floor(geometries.length / 2);
      centroid = Utils.getCentroidCoordinate(geometries[medianIdx]);
    }
    return centroid;
  }

  /**
   * Transform the extent. If the extent it is the same
   * than source proj extent then the target proj extent
   * will be returned
   * @public
   * @function
   * @param {ol.Extent} extent Extent to transform.
   * @param {String} srcProj source projection.
   * @param {String} tgtProj target projection.
   * @return {ol.Extent} transformed extent.
   * @api stable
   */
  static transformExtent(extent, srcProj, tgtProj) {
    let transformedExtent;

    const olSrcProj = isString(srcProj) ? getProj(srcProj) : srcProj;
    const olTgtProj = isString(tgtProj) ? getProj(tgtProj) : tgtProj;

    // checks if the extent to transform is the same
    // than source projection extent
    const srcProjExtent = olSrcProj.getExtent();
    const sameSrcProjExtent = extent.every((coord, i) => coord === srcProjExtent[i]);

    if (sameSrcProjExtent) {
      transformedExtent = olTgtProj.getExtent();
    } else {
      transformedExtent = transformExtent(extent, olSrcProj, olTgtProj);
    }
    return transformedExtent;
  }

  /**
   * TODO:
   */
  static getWMTSScale(map, exact) {
    const projection = map.getProjection().code;
    const units = map.getProjection().units;
    const bbox = map.getBbox();
    const screenLength = (map.getMapImpl().getSize()[0] * 0.026458) / 100;
    const coord = [[bbox.x.min, bbox.y.min], [bbox.x.max, bbox.y.min]];
    const line = new ol.geom.LineString(coord);
    let length = Math.round(line.getLength() * 100) / 100;
    if (projection === 'EPSG:3857') {
      length = Math.round(ol.sphere.getLength(line) * 100) / 100;
    } else if (units === 'd') {
      const coordinates = line.getCoordinates();
      for (let i = 0, ii = coordinates.length - 1; i < ii; i += 1) {
        length += ol.sphere.getDistance(ol.proj.transform(coordinates[i], projection, 'EPSG:4326'), ol.proj.transform(coordinates[i + 1], projection, 'EPSG:4326'));
      }
    }

    let scale = (length / screenLength);
    if (!exact === true) {
      if (scale >= 1000 && scale <= 950000) {
        scale = Math.round(scale / 1000) * 1000;
      } else if (scale >= 950000) {
        scale = Math.round(scale / 1000000) * 1000000;
      } else {
        scale = Math.round(scale);
      }
    }

    return Math.trunc(scale);
  }

  /*
    static getWMTSScale(map, exact) {
      const projection = map.getProjection().code;
      const olProj = getProj(projection);
      const mpu = olProj.getMetersPerUnit(); // meters per unit in depending on the CRS;
      const size = map.getMapImpl().getSize();
      const pix = size[0]; // Numero de pixeles en el mapa
      // Extension del mapa en grados (xmin, ymin, xmax, ymax)
      const pix2 = map.getMapImpl().getView().calculateExtent(size);
      // Extension angular del mapa (cuantos grados estan en el mapa)
      const ang = pix2[2] - pix2[0];
      // (numero de metros en el mapa / numero de pixeles) / metros por pixel
      let scale = (((mpu * ang) / pix) * 1000) / 0.28;
      if (!exact === true) {
        if (scale >= 1000 && scale <= 950000) {
          scale = Math.round(scale / 1000) * 1000;
        } else if (scale >= 950000) {
          scale = Math.round(scale / 1000000) * 1000000;
        } else {
          scale = Math.round(scale);
        }
      }
      return Math.trunc(scale);
    }
  */
}

export default Utils;
