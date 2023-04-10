/**
 * Copyright (c) 2016 Jean-Marc VIGLINO,
 * released under the CeCILL-B license (French BSD license)
 * (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
 * Usefull function to handle geometric operations
 */

import OLGeomLineString from 'ol/geom/LineString';
import OLGeomLinearRing from 'ol/geom/LinearRing';
import OLGeomMultiLineString from 'ol/geom/MultiLineString';
import OLGeomMultiPoint from 'ol/geom/MultiPoint';
import OLGeomMultiPolygon from 'ol/geom/MultiPolygon';
import OLGeomPoint from 'ol/geom/Point';
import OLGeomPolygon from 'ol/geom/Polygon';
import OLGeomCircle from 'ol/geom/Circle';
import { getCenter as olExtentGetCenter } from 'ol/extent';
import { buffer as olExtentBuffer } from 'ol/extent';

/**
 * Distance beetween 2 points
 * Usefull geometric functions
 * @param {ol.Coordinate} p1 first point
 * @param {ol.Coordinate} p2 second point
 * @return {number} distance
 */
const olCoordinateDist2d = (p1, p2) => {
  const dx = p1[0] - p2[0];
  const dy = p1[1] - p2[1];
  return Math.sqrt((dx * dx) + (dy * dy));
};

/**
 * 2 points are equal
 * Usefull geometric functions
 * @param {ol.Coordinate} p1 first point
 * @param {ol.Coordinate} p2 second point
 * @return {boolean}
 */
const olCoordinateEqual = (p1, p2) => {
  return (p1[0] === p2[0] && p1[1] === p2[1]);
};

/** Get center coordinate of a geometry
 * @param {ol.geom.Geometry} geom
 * @return {ol.Coordinate} the center
 */
const olCoordinateGetGeomCenter = (geom) => {
  switch (geom.getType()) {
    case 'Point':
      return geom.getCoordinates();
    case 'MultiPolygon':
      geom.getPolygon(0);
      // fallthrough
    case 'Polygon':
      return geom.getInteriorPoint().getCoordinates();
    default:
      return geom.getClosestPoint(olExtentGetCenter(geom.getExtent()));
  }
};

/** Get center coordinate of a feature
 * @param {ol.Feature} f
 * @return {ol.coordinate} the center
 */
const olCoordinateGetFeatureCenter = (f) => {
  return olCoordinateGetGeomCenter(f.getGeometry());
};

/** Offset a polyline
 * @param {Array<ol.Coordinate>} coords
 * @param {number} offset
 * @return {Array<ol.Coordinate>} resulting coord
 * @see http://stackoverflow.com/a/11970006/796832
 * @see https://drive.google.com/viewerng/viewer?a=v&pid=sites&srcid=ZGVmYXVsdGRvbWFpbnxqa2dhZGdldHN0b3JlfGd4OjQ4MzI5M2Y0MjNmNzI2MjY
 */
const olCoordinateOffsetCoords = (coords, offset) => {
  const path = [];
  let N = coords.length - 1;
  let max = N;
  let mi;
  let mi1;
  let li;
  let li1;
  let ri;
  let ri1;
  let si;
  let si1;
  let Xi1;
  let Yi1;
  let p0;
  let p1;
  let p2;
  const isClosed = olCoordinateEqual(coords[0], coords[N]);
  if (!isClosed) {
    p0 = coords[0];
    p1 = coords[1];
    p2 = [
      p0[0] + (((p1[1] - p0[1]) / olCoordinateDist2d(p0, p1)) * offset),
      p0[1] - (((p1[0] - p0[0]) / olCoordinateDist2d(p0, p1)) * offset),
    ];
    path.push(p2);
    coords.push(coords[N]);
    N += 1;
    max -= 1;
  }
  for (let i = 0; i < max; i += 1) {
    p0 = coords[i];
    p1 = coords[(i + 1) % N];
    p2 = coords[(i + 2) % N];

    mi = (p1[1] - p0[1]) / (p1[0] - p0[0]);
    mi1 = (p2[1] - p1[1]) / (p2[0] - p1[0]);
    // Prevent alignements
    if (Math.abs(mi - mi1) > 1e-10) {
      li = Math.sqrt(((p1[0] - p0[0]) * (p1[0] - p0[0])) + ((p1[1] - p0[1]) * (p1[1] - p0[1])));
      li1 = Math.sqrt(((p2[0] - p1[0]) * (p2[0] - p1[0])) + ((p2[1] - p1[1]) * (p2[1] - p1[1])));
      ri = p0[0] + ((offset * (p1[1] - p0[1])) / li);
      ri1 = p1[0] + ((offset * (p2[1] - p1[1])) / li1);
      si = p0[1] - ((offset * (p1[0] - p0[0])) / li);
      si1 = p1[1] - ((offset * (p2[0] - p1[0])) / li1);
      Xi1 = ((((mi1 * ri1) - (mi * ri)) + si) - si1) / (mi1 - mi);
      Yi1 = (((mi * mi1 * (ri1 - ri)) + (mi1 * si)) - (mi * si1)) / (mi1 - mi);

      // Correction for vertical lines
      if (p1[0] - p0[0] === 0) {
        Xi1 = p1[0] + ((offset * (p1[1] - p0[1])) / Math.abs(p1[1] - p0[1]));
        Yi1 = ((mi1 * Xi1) - (mi1 * ri1)) + si1;
      }
      if (p2[0] - p1[0] === 0) {
        Xi1 = p2[0] + ((offset * (p2[1] - p1[1])) / Math.abs(p2[1] - p1[1]));
        Yi1 = ((mi * Xi1) - (mi * ri)) + si;
      }

      path.push([Xi1, Yi1]);
    }
  }
  if (isClosed) {
    path.push(path[0]);
  } else {
    coords.pop();
    p0 = coords[coords.length - 1];
    p1 = coords[coords.length - 2];
    p2 = [
      p0[0] - (((p1[1] - p0[1]) / olCoordinateDist2d(p0, p1)) * offset),
      p0[1] + (((p1[0] - p0[0]) / olCoordinateDist2d(p0, p1)) * offset),
    ];
    path.push(p2);
  }
  return path;
};

/** Find the segment a point belongs to
 * @param {ol.Coordinate} pt
 * @param {Array<ol.Coordinate>} coords
 * @return {} the index (-1 if not found) and the segment
 */
const olCoordinateFindSegment = (pt, coords) => {
  for (let i = 0; i < coords.length - 1; i += 1) {
    const p0 = coords[i];
    const p1 = coords[i + 1];
    if (olCoordinateEqual(pt, p0) || olCoordinateEqual(pt, p1)) {
      return { index: 1, segment: [p0, p1] };
    }
    const d0 = olCoordinateDist2d(p0, p1);
    const v0 = [(p1[0] - p0[0]) / d0, (p1[1] - p0[1]) / d0];
    const d1 = olCoordinateDist2d(p0, pt);
    const v1 = [(pt[0] - p0[0]) / d1, (pt[1] - p0[1]) / d1];
    if (Math.abs((v0[0] * v1[1]) - (v0[1] * v1[0])) < 1e-10) {
      return { index: 1, segment: [p0, p1] };
    }
  }
  return { index: -1 };
};

/**
 * Split a Polygon geom with horizontal lines
 * @param {Array<ol.Coordinate>} geom
 * @param {number} y the y to split
 * @param {number} n contour index
 * @return {Array<Array<ol.Coordinate>>}
 */
const olCoordinateSplitH = (geom, y, n) => {
  let x;
  let abs;
  const list = [];
  for (let i = 0; i < geom.length - 1; i += 1) {
    // Hole separator?
    // if (!geom[i].length || !geom[i + 1].length) continue;
    // Intersect
    if ((geom[i][1] <= y && geom[i + 1][1] > y) || (geom[i][1] >= y && geom[i + 1][1] < y)) {
      abs = (y - geom[i][1]) / (geom[i + 1][1] - geom[i][1]);
      x = (abs * (geom[i + 1][0] - geom[i][0])) + geom[i][0];
      list.push({
        contour: n,
        index: i,
        pt: [x, y],
        abs,
      });
    }
  }
  // Sort x
  list.sort((a, b) => { return a.pt[0] - b.pt[0]; });
  // Horizontal segment
  const result = [];
  for (let j = 0; j < list.length - 1; j += 2) {
    result.push([list[j], list[j + 1]]);
  }
  return result;
};

/** Create a geometry given a type and coordinates */
const olGeomCreateFromType = (type, coordinates) => {
  switch (type) {
    case 'LineString':
      return new OLGeomLineString(coordinates);
    case 'LinearRing':
      return new OLGeomLinearRing(coordinates);
    case 'MultiLineString':
      return new OLGeomMultiLineString(coordinates);
    case 'MultiPoint':
      return new OLGeomMultiPoint(coordinates);
    case 'MultiPolygon':
      return new OLGeomMultiPolygon(coordinates);
    case 'Point':
      return new OLGeomPoint(coordinates);
    case 'Polygon':
      return new OLGeomPolygon(coordinates);
    default:
      /* eslint-disable-next-line no-console */
      console.error(`[createFromType] Unsupported type: ${type}`);
      return null;
  }
};

export { olGeomCreateFromType };
export {
  olCoordinateDist2d,
  olCoordinateEqual,
  olCoordinateFindSegment,
  olCoordinateGetFeatureCenter,
  olCoordinateGetGeomCenter,
  olCoordinateOffsetCoords,
  olCoordinateSplitH,
};

/** Intersect 2 lines
 * @param {Arrar<ol.coordinate>} d1
 * @param {Arrar<ol.coordinate>} d2
 */
const olCoordinateGetIntersectionPoint = (d1, d2) => {
  const d1x = d1[1][0] - d1[0][0];
  const d1y = d1[1][1] - d1[0][1];
  const d2x = d2[1][0] - d2[0][0];
  const d2y = d2[1][1] - d2[0][1];
  const det = (d1x * d2y) - (d1y * d2x);
  if (det !== 0) {
    const k = (((d1x * d1[0][1]) - (d1x * d2[0][1]) - (d1y * d1[0][0])) + (d1y * d2[0][0])) / det;
    return [d2[0][0] + (k * d2x), d2[0][1] + (k * d2y)];
  }
  return false;
};

export { olCoordinateGetIntersectionPoint };

let olExtentIntersection;

(() => {
  // Split at x
  function splitX(pts, x) {
    let pt;
    for (let i = pts.length - 1; i > 0; i -= 1) {
      if ((pts[i][0] > x && pts[i - 1][0] < x) || (pts[i][0] < x && pts[i - 1][0] > x)) {
        pt = [x, (((x - pts[i][0]) / (pts[i - 1][0] - pts[i][0])) *
          (pts[i - 1][1] - pts[i][1])) + pts[i][1]];
        pts.splice(i, 0, pt);
      }
    }
  }
  // Split at y
  function splitY(pts, y) {
    let pt;
    for (let i = pts.length - 1; i > 0; i -= 1) {
      if ((pts[i][1] > y && pts[i - 1][1] < y) || (pts[i][1] < y && pts[i - 1][1] > y)) {
        pt = [(((y - pts[i][1]) / (pts[i - 1][1] - pts[i][1])) *
          (pts[i - 1][0] - pts[i][0])) + pts[i][0], y];
        pts.splice(i, 0, pt);
      }
    }
  }

  /** Fast polygon intersection with an extent (used for area calculation)
   * @param {ol_extent_Extent} extent
   * @param {OLGeomPolygon|OLGeomMultiPolygon} polygon
   * @returns {OLGeomPolygon|OLGeomMultiPolygon|null} return null if not a polygon geometry
   */
  olExtentIntersection = (extent, polygon) => {
    const poly = (polygon.getType() === 'Polygon');
    if (!poly && polygon.getType() !== 'MultiPolygon') return null;
    let geom = polygon.getCoordinates();
    if (poly) geom = [geom];
    geom.forEach((g) => {
      g.forEach((c) => {
        splitX(c, extent[0]);
        splitX(c, extent[2]);
        splitY(c, extent[1]);
        splitY(c, extent[3]);
      });
    });
    // Snap geom to the extent
    geom.forEach((g) => {
      g.forEach((c) => {
        c.forEach((p) => {
          const pAux = p;
          if (pAux[0] < extent[0]) pAux[0] = extent[0];
          else if (pAux[0] > extent[2]) pAux[0] = extent[2];
          if (pAux[1] < extent[1]) pAux[1] = extent[1];
          else if (pAux[1] > extent[3]) pAux[1] = extent[3];
        });
      });
    });
    if (poly) {
      return new OLGeomPolygon(geom[0]);
    }
    return new OLGeomMultiPolygon(geom);
  };
})();

export { olExtentIntersection };
export { olExtentIntersection as extentIntersection };

/** Add points along a segment
 * @param {ol_Coordinate} p1
 * @param {ol_Coordinate} p2
 * @param {number} d
 * @param {boolean} start include starting point, default true
 * @returns {Array<ol_Coordinate>}
 */
const olCoordinateSampleAt = (p1, p2, d, start) => {
  const pts = [];
  if (start !== false) pts.push(p1);
  const dl = olCoordinateDist2d(p1, p2);
  if (dl) {
    const nb = Math.round(dl / d);
    if (nb > 1) {
      const dx = (p2[0] - p1[0]) / nb;
      const dy = (p2[1] - p1[1]) / nb;
      for (let i = 1; i < nb; i += 1) {
        pts.push([p1[0] + (dx * i), p1[1] + (dy * i)]);
      }
    }
  }
  pts.push(p2);
  return pts;
};
export { olCoordinateSampleAt };

/** Sample a LineString at a distance
 * @param {number} d
 * @returns {OLGeomLineString}
 */
OLGeomLineString.prototype.sampleAt = (d) => {
  const line = this.getCoordinates();
  let result = [];
  for (let i = 1; i < line.length; i += 1) {
    result = result.concat(olCoordinateSampleAt(line[i - 1], line[i], d, i === 1));
  }
  return new OLGeomLineString(result);
};

/** Sample a MultiLineString at a distance
 * @param {number} d
 * @returns {OLGeomMultiLineString}
 */
OLGeomMultiLineString.prototype.sampleAt = (d) => {
  const lines = this.getCoordinates();
  const result = [];
  lines.forEach((p) => {
    let l = [];
    for (let i = 1; i < p.length; i += 1) {
      l = l.concat(olCoordinateSampleAt(p[i - 1], p[i], d, i === 1));
    }
    result.push(l);
  });
  return new OLGeomMultiLineString(result);
};

/** Sample a Polygon at a distance
 * @param {number} d
 * @returns {OLGeomPolygon}
 */
OLGeomPolygon.prototype.sampleAt = (res) => {
  const poly = this.getCoordinates();
  const result = [];
  poly.forEach((p) => {
    let l = [];
    for (let i = 1; i < p.length; i += 1) {
      l = l.concat(olCoordinateSampleAt(p[i - 1], p[i], res, i === 1));
    }
    result.push(l);
  });
  return new OLGeomPolygon(result);
};

/** Sample a MultiPolygon at a distance
 * @param {number} res
 * @returns {OLGeomMultiPolygon}
 */
OLGeomMultiPolygon.prototype.sampleAt = (res) => {
  const mpoly = this.getCoordinates();
  const result = [];
  mpoly.forEach((poly) => {
    const a = [];
    result.push(a);
    poly.forEach((p) => {
      let l = [];
      for (let i = 1; i < p.length; i += 1) {
        l = l.concat(olCoordinateSampleAt(p[i - 1], p[i], res, i === 1));
      }
      a.push(l);
    });
  });
  return new OLGeomMultiPolygon(result);
};

/** Intersect a geometry using a circle
 * @param {ol_geom_Geometry} geom
 * @param {number} resolution circle resolution to sample the polygon on the circle, default 1
 * @returns {ol_geom_Geometry}
 */
OLGeomCircle.prototype.intersection = (geom, resolution) => {
  if (geom.sampleAt) {
    const ext = olExtentBuffer(this.getCenter().concat(this.getCenter()), this.getRadius());
    const geomAux = olExtentIntersection(ext, geom);
    // eslint-disable-next-line no-param-reassign
    geom = geomAux.simplify(resolution);
    const c = this.getCenter();
    const r = this.getRadius();
    // let res = (resolution||1) * r / 100;
    let g = geom.sampleAt(resolution).getCoordinates();
    switch (geom.getType()) {
      case 'Polygon':
        g = [g];
        // fallthrough
      case 'MultiPolygon': {
        let hasout = false;
        // let hasin = false;
        const result = [];
        g.forEach((poly) => {
          const a = [];
          result.push(a);
          poly.forEach((ring) => {
            const l = [];
            a.push(l);
            ring.forEach((p) => {
              const d = olCoordinateDist2d(c, p);
              if (d > r) {
                hasout = true;
                l.push([
                  c[0] + ((r / d) * (p[0] - c[0])),
                  c[1] + ((r / d) * (p[1] - c[1])),
                ]);
              } else {
                // hasin = true;
                l.push(p);
              }
            });
          });
        });
        if (!hasout) return geom;
        if (geom.getType() === 'Polygon') {
          return new OLGeomPolygon(result[0]);
        }
        return new OLGeomMultiPolygon(result);
      }
      default:
        break;
    }
  } else {
    /* eslint-disable-next-line no-console */
    console.warn(`[ol/geom/Circle~intersection] Unsupported geometry type: ${geom.getType()}`);
  }
  return geom;
};
