/**
 * @module M/control/LineStringStyle
 */

import LineStringStyleImpl from 'impl/lineStringStyle';
import template from 'templates/styleline';

export default class LineStringStyle extends M.Control {
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
    if (M.utils.isUndefined(LineStringStyleImpl)) {
      M.exception('La implementación usada no puede crear controles LineStringStyleImpl');
    }
    // 2. implementation of this control
    const impl = new LineStringStyleImpl();
    super(impl, 'LineStringStyle');
    this.feature = feature;
    if (Array.isArray(feature.getStyle())) {
      this.color = feature.getStyle()[0].getStroke().getColor();
    } else {
      this.color = feature.getStyle().getStroke().getColor();
      this.feature.setStyle([this.feature.getStyle()]);
    }
    this.plugin = plugin;
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
    const color = html.querySelector('input.color');
    color.value = this.color;
    const cpal = html.querySelector('div.palette');
    const destroyPlugin = html.querySelector('button#destroy-plugin');
    const functionDestroyPlugin = function(event) {
      this.plugin.destroyControl();
    };
    destroyPlugin.addEventListener('click', functionDestroyPlugin.bind(this));
    const currentSize = this.feature.getStyle()[0].getStroke().getWidth();
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
        this.feature.getStyle()[0].getStroke().setWidth(p.data);
        if (this.feature.getStyle().length > 1) {
          switch (this.feature.getStyle()[0].getStroke().strokeEnd) {
            case 'circle':
              this.feature.getStyle()[1].getImage().setRadius(p.data * 2);
              break;
            case 'triangle':
            case 'square':
              this.feature.getStyle()[1].getImage().getStroke().setWidth(p.data * 2);
              break;
            default:
              break;
          }
        }
        this.feature.changed();
      });
    }
    const cpal2 = html.querySelector('div.palette_estilo');
    let i;
    const elem = document.createElement('div');
    const elem2 = document.createElement('div');
    const elem3 = document.createElement('div');
    const elem4 = document.createElement('div');
    elem.classList.add('arrow');
    elem.title = '-';
    cpal2.append(elem);
    elem.addEventListener('click', () => {
      this.setLineArrow(this.feature, null);
    });
    elem2.classList.add('arrow');
    elem2.classList.add('arrowt');
    elem2.title = '->';
    cpal2.append(elem2);
    elem2.addEventListener('click', () => {
      this.setLineArrow(this.feature, 'triangle');
    });
    elem3.classList.add('arrow');
    elem3.classList.add('arrowr');
    elem3.title = '-o';
    cpal2.append(elem3);
    elem3.addEventListener('click', () => {
      this.setLineArrow(this.feature, 'circle');
    });
    elem4.classList.add('arrow');
    elem4.classList.add('arrows');
    elem4.title = '-[]';
    cpal2.append(elem4);
    elem4.addEventListener('click', () => {
      this.setLineArrow(this.feature, 'square');
    });
    const st = [
      'solid',
      'dash',
      'dot',
      'dashdot',
      'longdash',
      'longdashdot',
    ];
    let currentLineStyle = this.feature.getStyle()[0].getStroke().dashStyle;
    if (currentLineStyle === undefined) {
      this.feature.getStyle()[0].getStroke().dashStyle = 'solid';
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
      k.addEventListener('click', () => {
        this.removeSiblingsArrow(k, html);
      });
      if (currentLineStyle == k.data) {
        k.classList.add('active');
      }
    }
    const changeColor = function(event) {
      this.feature.getStyle()[0].getStroke().setColor(color.value);
      if (this.feature.getStyle().length > 1) {
        let arrow;
        if (this.feature.getStyle()[1].getImage() instanceof ol.style.Circle) {
          arrow = 'circle';
        } else if (this.feature.getStyle()[1].getImage().getPoints() === 3) {
          arrow = 'triangle';
        } else {
          arrow = 'square';
        }
        this.feature.setStyle(this.buildArrow(this.feature, arrow));
        this.feature.getStyle()[0].getStroke().strokeEnd = arrow;
      }
      this.feature.changed();
    };
    // color.value = this.color;
    color.addEventListener('change', changeColor.bind(this, color));
    return html;
  }


  setLineArrow(feature, arrow) {
    const featurez = feature;
    const dashStyle = featurez.getStyle()[0].getStroke().dashStyle;
    if (arrow !== null) {
      featurez.setStyle(this.buildArrow(featurez, arrow));
      featurez.getStyle()[0].getStroke().dashStyle = dashStyle;
      featurez.getStyle()[0].getStroke().setLineDash(this.dashStyle(dashStyle, feature.getStyle()[0].getStroke().getWidth()));
      featurez.getStyle()[0].getStroke().strokeEnd = arrow;
    } else if (feature.getStyle().length > 1) {
      feature.getStyle().pop();
      feature.setStyle(feature.getStyle());
      featurez.getStyle()[0].getStroke().strokeEnd = 'none';
    }
  }
  removeSiblingsArrow(element, html) {
    const elements = html.getElementsByClassName('spal');
    Array.prototype.forEach.call(elements, (el) => {
      el.classList.remove('active');
    });
    element.classList.add('active');
    this.setLineStyle(this.feature, element.data);
  }

  setLineStyle(featur, dashStyle) {
    const feature = featur;
    let clase = this.getFeatureClass(feature, true);
    if (clase === 'Flecha' && dashStyle !== 'solid') {
      const geoms = feature.getGeometry().getGeometries();
      if (geoms[0].getType() === 'Point') {
        feature.setGeometry(geoms[1]);
      } else {
        feature.setGeometry(geoms[0]);
      }
      clase = 'Linea';
      feature.getStyle()[0].getStroke().strokeEnd = 'end';
    }
    feature.getStyle()[0].getStroke().dashStyle = dashStyle;
    feature.getStyle()[0].getStroke().setLineDash(this.dashStyle(dashStyle, feature.getStyle()[0].getStroke().getWidth()));
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

  buildArrow(feature, arrow) {
    let coords;
    let l;
    let rotation = 0;
    let clase = this.getFeatureClass(feature, true);
    coords = feature.getGeometry().getCoordinates();
    if (clase === 'Linea' && arrow !== null) {
      l = feature.getGeometry();
      clase = 'Flecha';
    } else if (clase === 'Flecha') {
      if (arrow === null) {
        feature.setGeometry(l);
        clase = 'Linea';
      } else {
        coords = l.getCoordinates();
      }
    }

    if (clase === 'Flecha') {
      rotation = this.angle(coords[coords.length - 2], coords[coords.length - 1]);
    }
    const newStyle = this.buildArrowStyle(
      arrow, feature.getStyle()[0].getStroke().getColor(),
      feature.getStyle()[0].getStroke().getWidth(), rotation, feature,
    );
    newStyle[1].setZIndex(feature.getStyle()[0].getZIndex());

    return newStyle;
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
        case 'MultiLineString':
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

  buildArrowStyle(arrow, col, larg, rotation, feature) {
    let image = null;
    const style = feature.getStyle();
    switch (arrow) {
      case 'circle':
        image = new ol.style.Style({
          geometry: new ol.geom.Point(feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1]),
          image: new ol.style.Circle({
            fill: new ol.style.Fill({ color: col }),
            stroke: new ol.style.Stroke({ color: col, width: larg * 2 }),
            radius: 6,
          }),
        });
        break;
      case 'triangle':
      case 'square':
        image = new ol.style.Style({
          geometry: new ol.geom.Point(feature.getGeometry().getCoordinates()[feature.getGeometry().getCoordinates().length - 1]),
          image: new ol.style.RegularShape({
            fill: new ol.style.Fill({ color: col }),
            stroke: new ol.style.Stroke({ color: col, width: larg * 2 }),
            points: arrow === 'triangle' ?
              3 : 4,
            radius: 6,
            angle: arrow === 'square' ?
              Math.PI / 4 : 0,
            rotation,
          }),
        });
        break;
      default:
        break;
    }
    if (style.length > 1) {
      style[1] = image;
    } else {
      style.push(image);
    }

    return style;
  }

  toRadians(degree) {
    return (degree * Math.PI) / 180;
  }

  angle(p0, p1) {
    const dy = p0[1] - p1[1];
    const dx = p1[0] - p0[0];
    let angle;
    if (dx === 0) {
      angle = (dy < 0 ? 180 : 0);
    } else {
      angle = Math.atan(dy / dx) / (Math.PI / 180);
    }
    if (dx < 0) {
      angle += 180;
    }
    return this.toRadians(Math.round(angle) + 90);
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
    return control instanceof LineStringStyle;
  }
  // Add your own functions
}
