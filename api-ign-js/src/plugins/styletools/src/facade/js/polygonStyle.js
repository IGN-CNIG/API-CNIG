/**
 * @module M/control/PolygonStyle
 */

import PolygonStyleImpl from 'impl/polygonStyle';
import template from 'templates/stylepolygon';

export default class PolygonStyle extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(plugin, feature) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(PolygonStyleImpl)) {
      M.exception('La implementación usada no puede crear controles PolygonStyleImpl');
    }

    // 2. implementation of this control
    const impl = new PolygonStyleImpl();
    super(impl, 'PolygonStyle');
    this.plugin = plugin;
    this.feature = feature;
    this.opacity = 0.2;
    this.colorOriginal = '#0000FF';
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
    const html = M.template.compileSync(template);
    const color = html.querySelector('input.color_dentro');
    // if (this.feature.getStyle().getFill().getColor() == 'rgba(0, 0, 255, 0.1)') {
    //   color.value = this.feature.getStyle().getStroke().getColor();
    // }
    const hexColor = this.feature.getStyle().getStroke().getColor();
    if (this.feature.getStyle().getFill().getColor() == 'rgba(0, 0, 255, 0.2)') {
      color.value = this.colorOriginal;
    } else {
      color.value = this.rgbaToHex(this.feature.getStyle().getFill().getColor());
    }
    const color2 = html.querySelector('input.color_borde');
    color2.value = hexColor;
    // color2.value = this.feature.getStyle().getStroke().getColor();
    const cpal = html.querySelector('div.palette');
    const destroyPlugin = html.querySelector('button#destroy-plugin');
    const functionDestroyPlugin = function(event) {
      this.plugin.destroyControl();
    };
    destroyPlugin.addEventListener('click', functionDestroyPlugin.bind(this));
    const currentSize = this.feature.getStyle().getStroke().getWidth();
    for (let i = 2; i < 10; i += 1) {
      const p = document.createElement('div');
      p.classList.add('lpal');
      p.title = i;
      p.style.height = i + 'px';
      p.data = i;
      cpal.append(p);
      if (currentSize === p.data) {
        p.classList.add('active');
      }

      p.addEventListener('click', () => {
        const elements = html.getElementsByClassName('lpal');
        Array.prototype.forEach.call(elements, (el) => {
          el.classList.remove('active');
        });
        p.classList.add('active');
        this.feature.getStyle().getStroke().setWidth(p.data);
        this.feature.changed();
      });
    }
    const cpal2 = html.querySelector('div.palette_estilo');
    let i;
    const st = [
      'solid',
      'dash',
      'dot',
      'dashdot',
      'longdash',
      'longdashdot',
    ];
    let currentLineStyle = this.feature.getStyle().getStroke().dashStyle;
    if (currentLineStyle === undefined) {
      this.feature.getStyle().getStroke().dashStyle = 'solid';
      currentLineStyle = 'solid';
    }
    for (i = 0; i < st.length; i += 1) {
      const k = document.createElement('div');
      k.classList.add('spal');
      k.classList.add(st[i]);
      k.title = st[i];
      k.data = st[i];
      k.id = st[i];
      cpal2.append(k);
      k.addEventListener('click', () => { this.removeSiblingsStyle(k, html); });

      if (currentLineStyle == k.data) {
        k.classList.add('active');
      }
    }
    const changeColor = function(event) {
      let colorArray = ol.color.asArray(color.value);
      colorArray = colorArray.slice();
      colorArray[3] = this.opacity;
      this.feature.getStyle().getFill().setColor(colorArray);
      this.feature.changed();
    };
    const changeColor2 = function(event) {
      this.feature.getStyle().getStroke().setColor(color2.value);
      this.feature.changed();
    };
    color.addEventListener('change', changeColor.bind(this, color));
    color2.addEventListener('change', changeColor2.bind(this, color2));
    return html;
  }

  removeSiblingsStyle(element, html) {
    const elements = html.getElementsByClassName('spal');
    Array.prototype.forEach.call(elements, (el) => {
      el.classList.remove('active');
    });
    element.classList.add('active');
    this.setLineStyle(this.feature, element.data);
  }
  setLineStyle(featur, dashStyle) {
    const feature = featur;
    feature.getStyle().getStroke().dashStyle = dashStyle;
    feature.getStyle().getStroke().setLineDash(this.dashStyle(dashStyle, feature.getStyle().getStroke().getWidth()));
    feature.changed();
  }

  dashStyle(dashStyle, strokeWidth) {
    const w = strokeWidth;
    const str = dashStyle;
    switch (str) {
      case 'solid':
        return undefined;
      case 'dot':
        return [
          1, 4 * w,
        ];
      case 'dash':
        return [
          4 * w,
          4 * w,
        ];
      case 'dashdot':
        return [
          4 * w,
          4 * w,
          1,
          4 * w,
        ];
      case 'longdash':
        return [
          8 * w,
          4 * w,
        ];
      case 'longdashdot':
        return [
          8 * w,
          4 * w,
          1,
          4 * w,
        ];
      default:
        return null;
    }
  }

  getFeatureClass(feature, geom) {
    if (feature.getGeometry() === undefined) {
      return null;
    }
    let clase = feature.getGeometry().getType();
    if (geom) {
      switch (clase) {
        case 'GeometryCollection':
          clase = 'Flecha';
          break;
        case 'LineString':
          clase = 'Linea';
          break;
        case 'Polygon':
          clase = 'Poligono';
          break;
        case 'Point':
          if (feature.get('type') && feature.get('type') === 'text') {
            clase = 'Texto';
          }
          break;
        default:
          break;
      }
    }
    return clase;
  }

  rgbaToHex(arrayColor) {
    const toHex = function(color) {
      let hex = Number(color).toString(16);
      if (hex.length < 2) {
        hex = '0' + hex;
      }
      return hex;
    };
    const red = toHex(arrayColor[0]);
    const green = toHex(arrayColor[1]);
    const blue = toHex(arrayColor[2]);
    return '#' + red + green + blue;
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
    return control instanceof PolygonStyle;
  }

  // Add your own functions
}
