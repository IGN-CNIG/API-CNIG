/* eslint-disable  no-cond-assign */
import OLStyleStyle from 'ol/style/Style';
import { asString as olColorAsString } from 'ol/color';
import { asArray as olColorAsArray } from 'ol/color';
import { olCoordinateDist2d } from './GeomUtils';
import './LineStringSplitAt';

/** Copyright (c) 2016 Jean-Marc VIGLINO,
 * released under the CeCILL-B license (French BSD license)
 * (http://www.cecill.info/licences/Licence_CeCILL-B_V1-en.txt).
 */
/**
 * @classdesc
 * Fill style with named pattern
 *
 */
export default class OLStyleFlowLine extends OLStyleStyle {
  constructor(options = {}) {
    super({
      stroke: options.stroke,
      text: options.text,
      zIndex: options.zIndex,
      geometry: options.geometry,
    });
    this.setRenderer(this._render.bind(this));

    // Draw only visible
    this._visible = (options.visible !== false);

    // Width
    if (typeof options.width === 'function') {
      this._widthFn = options.width;
    } else {
      this.setWidth(options.width);
    }
    this.setWidth2(options.width2);
    // Color
    if (typeof options.color === 'function') {
      this._colorFn = options.color;
    } else {
      this.setColor(options.color);
    }
    this.setColor2(options.color2);
    // LineCap
    this.setLineCap(options.lineCap);
    // Arrow
    this.setArrow(options.arrow);
    this.setArrowSize(options.arrowSize);
    this.setArrowColor(options.arrowColor);
    // Offset
    this._offset = [0, 0];
    this.setOffset(options.offset0, 0);
    this.setOffset(options.offset1, 1);
    // Overlap
    this._noOverlap = options.noOverlap;
  }
  /** Set the initial width
   * @param {number} width width, default 0
   */
  setWidth(width) {
    this._width = width || 0;
  }
  /** Set the final width
   * @param {number} width width, default 0
   */
  setWidth2(width) {
    this._width2 = width;
  }
  /** Get offset at start or end
   * @param {number} where 0=start, 1=end
   * @return {number} width
   */
  getOffset(where) {
    return this._offset[where];
  }
  /** Add an offset at start or end
   * @param {number} width
   * @param {number} where 0=start, 1=end
   */
  setOffset(width, where) {
    const widthAux = Math.max(0, parseFloat(width));
    switch (where) {
      case 0: {
        this._offset[0] = widthAux;
        break;
      }
      case 1: {
        this._offset[1] = widthAux;
        break;
      }
      default: {
        break;
      }
    }
  }
  /** Set the LineCap
   * @param {steing} cap LineCap (round or butt), default butt
   */
  setLineCap(cap) {
    this._lineCap = (cap === 'round' ? 'round' : 'butt');
  }
  /** Get the current width at step
   * @param {ol.feature} feature
   * @param {number} step current drawing step beetween [0,1]
   * @return {number}
   */
  getWidth(feature, step) {
    if (this._widthFn) {
      return this._widthFn(feature, step);
    }
    const w2 = (typeof (this._width2) === 'number') ? this._width2 : this._width;
    return this._width + ((w2 - this._width) * step);
  }
  /** Set the initial color
   * @param {ol.colorLike} color
   */
  setColor(color) {
    try {
      this._color = olColorAsArray(color);
    } catch (e) {
      this._color = [0, 0, 0, 1];
    }
  }
  /** Set the final color
   * @param {ol.colorLike} color
   */
  setColor2(color) {
    try {
      this._color2 = olColorAsArray(color);
    } catch (e) {
      this._color2 = null;
    }
  }
  /** Set the arrow color
   * @param {ol.colorLike} color
   */
  setArrowColor(color) {
    try {
      this._acolor = olColorAsString(color);
    } catch (e) {
      this._acolor = null;
    }
  }
  /** Get the current color at step
   * @param {ol.feature} feature
   * @param {number} step current drawing step beetween [0,1]
   * @return {string}
   */
  getColor(feature, step) {
    if (this._colorFn) {
      return olColorAsString(this._colorFn(feature, step));
    }
    const color = this._color;
    const color2 = this._color2 || this._color;
    return `rgba(${
      +Math.round(color[0] + ((color2[0] - color[0]) * step))},
      ${Math.round(color[1] + ((color2[1] - color[1]) * step))},
      ${Math.round(color[2] + ((color2[2] - color[2]) * step))},
      ${(color[3] + ((color2[3] - color[3]) * step))}
      )`;
  }
  /** Get arrow
   */
  getArrow() {
    return this._arrow;
  }
  /** Set arrow
   * @param {number} n -1 | 0 | 1 | 2, default: 0
   */
  setArrow(n) {
    this._arrow = parseInt(n, 0);
    if (this._arrow < -1 || this._arrow > 2) {
      this._arrow = 0;
    }
  }
  /** getArrowSize
   * @return {ol.size}
   */
  getArrowSize() {
    return this._arrowSize || [16, 16];
  }
  /** setArrowSize
   * @param {number|ol.size} size
   */
  setArrowSize(size) {
    if (Array.isArray(size)) {
      this._arrowSize = size;
    } else if (typeof (size) === 'number') {
      this._arrowSize = [size, size];
    }
  }
  /** drawArrow
   * @param {CanvasRenderingContext2D} ctx
   * @param {ol.coordinate} p0
   * @param ol.coordinate} p1
   * @param {number} width
   * @param {number} ratio pixelratio
   * @private
   */
  drawArrow(ctx, p0, p1, width, ratio) {
    const asize = this.getArrowSize()[0] * ratio;
    const l = olCoordinateDist2d(p0, p1);
    const dx = (p0[0] - p1[0]) / l;
    const dy = (p0[1] - p1[1]) / l;
    const widthAux = Math.max(this.getArrowSize()[1] / 2, width / 2) * ratio;
    ctx.beginPath();
    ctx.moveTo(p0[0], p0[1]);
    ctx.lineTo((p0[0] - (asize * dx)) + (widthAux * dy), (p0[1] - (asize * dy)) - (widthAux * dx));
    ctx.lineTo((p0[0] - (asize * dx)) - (widthAux * dy), (p0[1] - (asize * dy)) + (widthAux * dx));
    ctx.lineTo(p0[0], p0[1]);
    ctx.fill();
  }
  /** Renderer function
   * @param {Array<ol.coordinate>} geom The pixel coordinates of the geometry in GeoJSON notation
   * @param {ol.render.State} e The olx.render.State of the layer renderer
   */
  _render(geom, e) {
    if (e.geometry.getType() === 'LineString') {
      let i;
      let g;
      let p;
      const ctx = e.context;
      // Get geometry used at drawing
      if (!this._visible) {
        const a = e.pixelRatio / e.resolution;
        const cos = Math.cos(e.rotation);
        const sin = Math.sin(e.rotation);
        g = e.geometry.getCoordinates();
        const dx = (geom[0][0] - (g[0][0] * a * cos)) - (g[0][1] * a * sin);
        const dy = (geom[0][1] - (g[0][0] * a * sin)) + (g[0][1] * a * cos);
        // eslint-disable-next-line no-param-reassign
        geom = [];
        for (i = 0; p = g[i]; i += 1) {
          // eslint-disable-next-line no-param-reassign
          geom[i] = [
            (dx + (p[0] * a * cos)) + (p[1] * a * sin),
            (dy + (p[0] * a * sin)) - (p[1] * a * cos),
            p[2],
          ];
        }
      }

      const asize = this.getArrowSize()[0] * e.pixelRatio;

      ctx.save();
      // Offsets
      if (this.getOffset(0)) {
        this._splitAsize(geom, this.getOffset(0) * e.pixelRatio);
      }
      if (this.getOffset(1)) {
        this._splitAsize(geom, this.getOffset(1) * e.pixelRatio, true);
      }
      // Arrow 1
      if (geom.length > 1 && (this.getArrow() === -1 || this.getArrow() === 2)) {
        p = this._splitAsize(geom, asize);
        if (this._acolor) {
          ctx.fillStyle = this._acolor;
        } else {
          ctx.fillStyle = this.getColor(e.feature, 0);
        }
        this.drawArrow(ctx, p[0], p[1], this.getWidth(e.feature, 0), e.pixelRatio);
      }
      // Arrow 2
      if (geom.length > 1 && this.getArrow() > 0) {
        p = this._splitAsize(geom, asize, true);
        if (this._acolor) {
          ctx.fillStyle = this._acolor;
        } else {
          ctx.fillStyle = this.getColor(e.feature, 1);
        }
        this.drawArrow(ctx, p[0], p[1], this.getWidth(e.feature, 1), e.pixelRatio);
      }

      // Split into
      const geoms = this._splitInto(geom, 255, 2);
      let k = 0;
      const nb = geoms.length;

      // Draw
      ctx.lineJoin = 'round';
      ctx.lineCap = this._lineCap || 'butt';

      if (geoms.length > 1) {
        for (k = 0; k < geoms.length; k += 1) {
          const step = k / nb;
          g = geoms[k];
          ctx.lineWidth = this.getWidth(e.feature, step) * e.pixelRatio;
          ctx.strokeStyle = this.getColor(e.feature, step);
          ctx.beginPath();
          ctx.moveTo(g[0][0], g[0][1]);
          for (i = 1; p = g[i]; i += 1) {
            ctx.lineTo(p[0], p[1]);
          }
          ctx.stroke();
        }
      }
      ctx.restore();
    }
  }
  /** Split extremity at
   * @param {ol.geom.LineString} geom
   * @param {number} asize
   * @param {boolean} end start=false or end=true, default false (start)
   */
  _splitAsize(geom, asize, end) {
    let p;
    let p1;
    let p0;
    let dl;
    let d = 0;
    if (end) {
      p0 = geom.pop();
    } else {
      p0 = geom.shift();
    }
    p = p0;
    while (geom.length) {
      if (end) {
        p1 = geom.pop();
      } else {
        p1 = geom.shift();
      }
      dl = olCoordinateDist2d(p, p1);
      if (d + dl > asize) {
        p = [p[0] + (((p1[0] - p[0]) * (asize - d)) / dl),
          p[1] + (((p1[1] - p[1]) * (asize - d)) / dl),
        ];
        dl = olCoordinateDist2d(p, p0);
        if (end) {
          geom.push(p1);
          geom.push(p);
          geom.push([p[0] + ((p0[0] - p[0]) / dl), p[1] + ((p0[1] - p[1]) / dl)]);
        } else {
          geom.unshift(p1);
          geom.unshift(p);
          geom.unshift([p[0] + ((p0[0] - p[0]) / dl), p[1] + ((p0[1] - p[1]) / dl)]);
        }
        break;
      }
      d += dl;
      p = p1;
    }
    return [p0, p];
  }
  /** Split line geometry into equal length geometries
   * @param {Array<ol.coordinate>} geom
   * @param {number} nb number of resulting geometries, default 255
   * @param {number} nim minimum length of the resulting geometries, default 1
   */
  _splitInto(geom, nb, min) {
    let i;
    let p;
    const dt = this._noOverlap ? 1 : 0.9;
    // Split geom into equal length geoms
    const geoms = [];
    let dl;
    let l = 0;
    for (i = 1; p = geom[i]; i += 1) {
      l += olCoordinateDist2d(geom[i - 1], p);
    }
    const length = Math.max(min || 2, l / (nb || 255));
    let p0 = geom[0];
    l = 0;
    let g = [p0];
    i = 1;
    p = geom[1];
    while (i < geom.length) {
      const dx = p[0] - p0[0];
      const dy = p[1] - p0[1];
      dl = Math.sqrt((dx * dx) + (dy * dy));
      if (l + dl > length) {
        const d = (length - l) / dl;
        g.push([
          p0[0] + (dx * d),
          p0[1] + (dy * d),
        ]);
        geoms.push(g);
        p0 = [
          p0[0] + (dx * d * dt),
          p0[1] + (dy * d * dt),
        ];
        g = [p0];
        l = 0;
      } else {
        l += dl;
        p0 = p;
        g.push(p0);
        i += 1;
        p = geom[i];
      }
    }
    geoms.push(g);
    return geoms;
  }
}
