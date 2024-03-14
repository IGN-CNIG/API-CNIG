/**
 * @module M/control/StyleControl
 */
import StyleImplControl from '../../impl/ol/js/stylecontrol';
import template from '../../templates/style';
import { getValue } from './i18n/language';

export default class StyleControl extends M.Control {
  /**
   * @classdesc
   * Main constructor of the class. Creates a PluginControl
   * control
   *
   * @constructor
   * @extends {M.Control}
   * @api stable
   */
  constructor(map, managementControl) {
    // 1. checks if the implementation can create PluginControl
    if (M.utils.isUndefined(StyleImplControl)) {
      M.exception(getValue('exception'));
    }

    // 2. implementation of this control
    const impl = new StyleImplControl();
    super(impl, 'Style');
    impl.facadeControl = this;

    this.map_ = map;

    /**
     * vectorsmanagementcontrol to comunicate with others controls
     */
    this.managementControl_ = managementControl;

    /**
     * Template
     * @public
     * @type { HTMLElement }
     */
    this.template = null;

    /**
     * Selected layer
     */
    this.layer_ = null;
  }

  /**
   * This functions active control
   *
   * @public
   * @function
   * @param {Node} html
   * @api
   */
  active(html) {
    this.template = M.template.compileSync(template, {
      vars: {
        translations: {
          styleColor: getValue('styleColor'),
          styleThickness: getValue('styleThickness'),
          styleFont: getValue('styleFont'),
          styleSize: getValue('styleSize'),
          creationText: getValue('creationText'),
          opacity: getValue('opacity'),
          radius: getValue('radius'),
          style_options_point: getValue('style_options_point'),
          style_options_line: getValue('style_options_line'),
          style_options_polygon: getValue('style_options_polygon'),
          apply_style: getValue('apply_style'),
        },
      },
    });
    html.querySelector('#m-vectorsmanagement-controls').appendChild(this.template);

    this.refreshStyle();
    this.addEvents();
  }

  /**
   * This functions refresh style of template
   *
   * @public
   * @function
   * @api
   */
  refreshStyle() {
    const selection = this.managementControl_.getSelection();
    if (selection === 'layer') {
      this.showLayerStyle();
    } else if (selection === 'feature') {
      this.showFeatureStyle();
    }
  }

  /**
   * This function adds events to template.
   * @public
   * @function
   * @api
   */
  addEvents() {
    this.template.querySelector('#point-options').addEventListener('click', () => this.toggleContent('point'));
    this.template.querySelector('#line-options').addEventListener('click', () => this.toggleContent('line'));
    this.template.querySelector('#polygon-options').addEventListener('click', () => this.toggleContent('polygon'));
    this.template.querySelector('#set-style-btn').addEventListener('click', () => this.applyStyle());
  }

  /**
   * This function show/hide styles sections
   * @public
   * @function
   * @param {String} type style type (point/line/polygon)
   * @api
   */
  toggleContent(type) {
    const elem = this.template.querySelector(`.${type}-content`);
    const span = this.template.querySelector(`#${type}-options`).children[0];
    if (elem.classList.contains('closed')) {
      elem.classList.remove('closed');
      span.classList.remove('g-cartografia-flecha-abajo');
      span.classList.add('g-cartografia-flecha-arriba');
    } else {
      elem.classList.add('closed');
      span.classList.remove('g-cartografia-flecha-arriba');
      span.classList.add('g-cartografia-flecha-abajo');
    }
  }

  /**
   * This function show layer style on template
   * @public
   * @function
   * @api
   */
  showLayerStyle() {
    const style = this.layer_.getStyle();
    let options = {};
    if (style) {
      options = style.getOptions();
    }
    this.showStyle(options);
  }

  /**
   * This function show feature style on template
   * @public
   * @function
   * @api
   */
  showFeatureStyle() {
    const selectedFeatures = this.managementControl_.getSelectedFeatures();
    if (selectedFeatures.length > 0) {
      const options = {};
      for (let i = 0; i < selectedFeatures.length; i += 1) {
        const feature = selectedFeatures[i];
        const style = feature.getStyle();
        if (style && style.getOptions()) {
          if ((feature.getGeometry().type === 'Point' || feature.getGeometry().type === 'MultiPoint') && !options.point) {
            options.point = style.getOptions();
          } else if ((feature.getGeometry().type === 'LineString' || feature.getGeometry().type === 'MultiLineString') && !options.line) {
            options.line = style.getOptions();
          } else if ((feature.getGeometry().type === 'Polygon' || feature.getGeometry().type === 'MultiPolygon') && !options.polygon) {
            options.polygon = style.getOptions();
          }
        }
      }
      if (options.point || options.line || options.polygon) {
        this.showStyle(options);
      } else {
        this.showLayerStyle();
      }
    } else {
      M.dialog.info(getValue('exception.featuresel'));
    }
  }

  /**
   * This function show style on template
   * @public
   * @function
   * @param {Object} styleOptions
   * @api
   */
  showStyle(styleOptions) {
    if (styleOptions) {
      this.setStyle(styleOptions.point, 'point');
      this.setStyle(styleOptions.line, 'line');
      this.setStyle(styleOptions.polygon, 'polygon');
    }
    this.template.classList.remove('closed');
  }

  /**
   * This function set style inputs value
   * @public
   * @function
   * @param {Object} options style options
   * @param {String} type style type (point/line/polygon)
   * @api
   */
  setStyle(options, type) {
    if (options) {
      const colorInput = this.template.querySelector(`#colorSelector-${type}`);
      const widthInput = this.template.querySelector(`#thicknessSelector-${type}`);
      const radiusInput = this.template.querySelector(`#radiusSelector-${type}`);
      const textInput = this.template.querySelector(`#textContent-${type}`);
      const fontInput = this.template.querySelector(`#fontFamily-${type}`);
      const fontSizeInput = this.template.querySelector(`#fontSize-${type}`);
      const opacityInput = this.template.querySelector(`#opacity-${type}`);
      if (options.stroke && options.stroke.color && colorInput) {
        colorInput.value = options.stroke.color;
      }
      if (options.stroke && options.stroke.width && widthInput) {
        widthInput.value = options.stroke.width;
      }
      if (radiusInput) {
        if (options.radius) {
          radiusInput.value = options.radius;
        } else {
          radiusInput.value = 5;
        }
      }
      if (options.label && options.label.text) {
        textInput.value = options.label.text;
      } else {
        textInput.value = '';
      }
      if (options.label && options.label.font) {
        const font = options.label.font.split(' ');
        if (font.length === 2) {
          fontSizeInput.value = Number.parseInt(font[0].replace('px', ''), 10);
          fontInput.value = font[1];
        } else {
          fontSizeInput.value = 12;
          fontInput.value = options.label.font;
        }
      } else {
        fontSizeInput.value = 12;
        fontInput.value = 'Arial';
      }
      if (opacityInput) {
        if (options.fill.opacity) {
          opacityInput.value = options.fill.opacity;
        } else {
          opacityInput.value = 0.4;
        }
      }
    }
  }

  /**
   * This function applies style to layer or features
   * @public
   * @function
   * @api
   */
  applyStyle() {
    const options = {
      point: this.getStyle('point'),
      line: this.getStyle('line'),
      polygon: this.getStyle('polygon'),
    };
    const selection = this.managementControl_.getSelection();
    if (selection === 'layer') {
      this.layer_.setStyle(new M.style.Generic(options));
    } else if (selection === 'feature') {
      const features = this.managementControl_.getSelectedFeatures();
      features.forEach((f) => {
        let style;
        const geometryType = f.getGeometry().type;
        switch (geometryType) {
          case 'Point':
          case 'MultiPoint':
            style = new M.style.Point(options.point);
            break;
          case 'LineString':
          case 'MultiLineString':
            style = new M.style.Line(options.line);
            break;
          case 'Polygon':
          case 'MultiPolygon':
            style = new M.style.Polygon(options.polygon);
            break;
          default:
            break;
        }
        if (style) {
          f.setStyle(style);
        }
      });
    }
  }

  /**
   * This function gets style options from template inputs
   * @public
   * @function
   * @param {String} type style type (point/line/polygon)
   * @api
   */
  getStyle(type) {
    const options = {
      stroke: {},
      fill: {},
      label: {},
    };
    const colorInput = this.template.querySelector(`#colorSelector-${type}`);
    const widthInput = this.template.querySelector(`#thicknessSelector-${type}`);
    const radiusInput = this.template.querySelector(`#radiusSelector-${type}`);
    const textInput = this.template.querySelector(`#textContent-${type}`);
    const fontInput = this.template.querySelector(`#fontFamily-${type}`);
    const fontSizeInput = this.template.querySelector(`#fontSize-${type}`);
    const opacityInput = this.template.querySelector(`#opacity-${type}`);

    if (colorInput) {
      options.stroke.color = colorInput.value;
      options.fill.color = colorInput.value;
    }
    if (widthInput) {
      options.stroke.width = widthInput.value;
    }
    if (radiusInput) {
      options.radius = radiusInput.value;
    }
    if (opacityInput) {
      options.fill.opacity = opacityInput.value;
    }
    if (textInput && textInput.value) {
      options.label.text = textInput.value;
      if (fontInput && fontSizeInput) {
        options.label.font = `${fontSizeInput.value}px ${fontInput.value}`;
      }
    }
    return options;
  }

  /**
   * Sets the layer selected for management
   * @public
   * @function
   * @api
   * @param {M.layer} layer
   */
  setLayer(layer) {
    this.layer_ = layer;
  }


  /**
   * This function destroys this control
   *
   * @public
   * @function
   * @api stable
   */
  destroy() {
  }

  /**
   * This function is called on the control activation
   *
   * @public
   * @function
   * @api stable
   */
  activate() {
    super.activate();
  }

  /**
   * This function is called on the control deactivation
   *
   * @public
   * @function
   * @api stable
   */
  deactivate() {
    this.template.remove();
    // this.getImpl().removeSelectInteraction();
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
    // eslint-disable-next-line no-undef
    return control instanceof EditionControl;
  }
}
