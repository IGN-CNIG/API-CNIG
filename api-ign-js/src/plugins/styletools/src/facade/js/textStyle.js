/**
 * @module M/control/TextStyle
 */

import TextStyleImpl from 'impl/textStyle';
import template from 'templates/styletext';

export default class TextStyle extends M.Control {
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
    if (M.utils.isUndefined(TextStyleImpl)) {
      M.exception('La implementación usada no puede crear controles TextStyleImpl');
    }

    // 2. implementation of this control
    const impl = new TextStyleImpl();
    super(impl, 'TextStyle');
    this.plugin = plugin;
    this.feature = feature;
    this.textOriginal = [];
    this.textOriginal[0] = feature.getStyle().getText().font_.includes('bold') ? 'bold' : '';
    this.textOriginal[1] = feature.getStyle().getText().font_.includes('italic') ? 'italic' : '';
    this.textOriginal[2] = feature.getStyle().getText().font_.replace(/\D/g, '');
    this.textOriginal[3] = feature.getStyle().getText().font_.split('px ');
    this.textOriginal[3] = this.textOriginal[3][1];
    this.texto = this.feature.getStyle().getText().getText();
    this.color = this.feature.getStyle().getText().getFill().getColor();
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
    const bold = html.querySelector('button#m-feature-freedrawing-fbold');
    if (this.textOriginal[0] === 'bold') {
      bold.classList.toggle('m-freedrawig-dialog-button-active');
    }
    const cursive = html.querySelector('button#m-feature-freedrawing-fcursive');
    if (this.textOriginal[1] === 'italic') {
      cursive.classList.toggle('m-freedrawig-dialog-button-active');
    }
    const texto = html.querySelector('input#m-feature-freedrawing-ftext');
    texto.value = this.texto;
    const font = html.querySelector('select#m-feature-freedrawing-ffont');
    font.value = this.textOriginal[3];
    const sizeFont = html.querySelector('input#m-feature-freedrawing-fsizefont');
    sizeFont.value = this.textOriginal[2];
    const colorFont = html.querySelector('input#m-feature-freedrawing-fcolorfont');
    colorFont.value = this.color;
    const destroyPlugin = html.querySelector('button#destroy-plugin');
    const changeBold = function(event) {
      bold.classList.toggle('m-freedrawig-dialog-button-active');
      if (this.textOriginal[0] == '') {
        this.feature.setStyle(new ol.style.Style({
          text: new ol.style.Text({
            text: this.texto,
            font: 'bold ' + this.textOriginal[1] + ' ' + this.textOriginal[2] + 'px ' + this.textOriginal[3],
            fill: new ol.style.Fill({ color: this.color }),
          }),
        }));
        this.textOriginal[0] = 'bold';
      } else {
        this.feature.setStyle(new ol.style.Style({
          text: new ol.style.Text({
            text: this.texto,
            font: this.textOriginal[1] + ' ' + this.textOriginal[2] + 'px ' + this.textOriginal[3],
            fill: new ol.style.Fill({ color: this.color }),
          }),
        }));
        this.textOriginal[0] = '';
      }
      this.feature.changed();
    };
    const changeItalic = function(event) {
      cursive.classList.toggle('m-freedrawig-dialog-button-active');
      if (this.textOriginal[1] == '') {
        this.feature.setStyle(new ol.style.Style({
          text: new ol.style.Text({
            text: this.texto,
            font: this.textOriginal[0] + ' italic ' + this.textOriginal[2] + 'px ' + this.textOriginal[3],
            fill: new ol.style.Fill({ color: this.color }),
          }),
        }));
        this.textOriginal[1] = 'italic';
      } else {
        this.feature.setStyle(new ol.style.Style({
          text: new ol.style.Text({
            text: this.texto,
            font: this.textOriginal[0] + ' ' + this.textOriginal[2] + 'px ' + this.textOriginal[3],
            fill: new ol.style.Fill({ color: this.color }),
          }),
        }));
        this.textOriginal[1] = '';
      }
      this.feature.changed();
    };
    const functionDestroyPlugin = function(event) {
      this.plugin.destroyControl();
    };
    destroyPlugin.addEventListener('click', functionDestroyPlugin.bind(this));
    bold.addEventListener('click', changeBold.bind(this, bold));
    cursive.addEventListener('click', changeItalic.bind(this, cursive));
    const changeText = function(event) {
      this.feature.setStyle(new ol.style.Style({
        text: new ol.style.Text({
          text: texto.value,
          font: this.textOriginal[0] + ' ' + this.textOriginal[1] + ' ' + this.textOriginal[2] + 'px ' + this.textOriginal[3],
          fill: new ol.style.Fill({ color: this.color }),
        }),
      }));
      this.feature.changed();
      this.texto = texto.value;
    };

    const changeFont = function(event) {
      this.feature.setStyle(new ol.style.Style({
        text: new ol.style.Text({
          text: this.texto,
          font: this.textOriginal[0] + ' ' + this.textOriginal[1] + ' ' + this.textOriginal[2] + 'px ' + font.value,
          fill: new ol.style.Fill({ color: this.color }),
        }),
      }));
      this.feature.changed();
      this.textOriginal[3] = font.value;
    };

    const changeSize = function(event) {
      this.feature.setStyle(new ol.style.Style({
        text: new ol.style.Text({
          text: this.texto,
          font: this.textOriginal[0] + ' ' + this.textOriginal[1] + ' ' + sizeFont.value + 'px ' + this.textOriginal[3],
          fill: new ol.style.Fill({ color: this.color }),
        }),
      }));
      this.feature.changed();
      this.textOriginal[2] = sizeFont.value;
    };

    const changeColor = function(event) {
      this.feature.setStyle(new ol.style.Style({
        text: new ol.style.Text({
          text: this.texto,
          font: this.textOriginal[0] + ' ' + this.textOriginal[1] + ' ' + this.textOriginal[2] + 'px ' + this.textOriginal[3],
          fill: new ol.style.Fill({ color: colorFont.value }),
        }),
      }));
      this.feature.changed();
      this.color = colorFont.value;
    };
    colorFont.addEventListener('change', changeColor.bind(this, colorFont));
    texto.addEventListener('keyup', changeText.bind(this, texto));
    font.addEventListener('change', changeFont.bind(this, font));
    sizeFont.addEventListener('change', changeSize.bind(this, sizeFont));
    return html;
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
    return control instanceof TextStyle;
  }

  // Add your own functions
}
