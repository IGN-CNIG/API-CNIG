/**
 * @module M/control/PointStyle
 */
import PointStyleImpl from 'impl/pointStyle';
import template from 'templates/stylepoint';
import ImageCircle from '../assets/css/images/puntoSize.png';
import TiendaSVG from '../assets/css/images/tienda.svg';
import EstrellaSVG from '../assets/css/images/estrella.svg';
import ArbolSVG from '../assets/css/images/arbol.svg';
import AguaSVG from '../assets/css/images/agua.svg';
import AvionSVG from '../assets/css/images/avion.svg';
import CasaSVG from '../assets/css/images/casa.svg';
import CocheSVG from '../assets/css/images/coche.svg';
import EdificioSVG from '../assets/css/images/edificio.svg';
import FuenteSVG from '../assets/css/images/fuente.svg';
import GotaSVG from '../assets/css/images/gota.svg';
import MerenderoSVG from '../assets/css/images/merendero.svg';
import PrismaticosSVG from '../assets/css/images/prismaticos.svg';
import TrianguloSVG from '../assets/css/images/triangulo.svg';
import CastilloSVG from '../assets/css/images/castillo.svg';
import IglesiaSVG from '../assets/css/images/iglesia.svg';
import TemploSVG from '../assets/css/images/templo.svg';
import TorreSVG from '../assets/css/images/torre.svg';
import EsculturaSVG from '../assets/css/images/escultura.svg';
import CafeteriaSVG from '../assets/css/images/cafeteria.svg';
import RapidaSVG from '../assets/css/images/comida-rapida.svg';
import RestauranteSVG from '../assets/css/images/restaurante.svg';
import ColiseoSVG from '../assets/css/images/coliseo.svg';
import CuadradoSVG from '../assets/css/images/rectangle.svg';

export default class PointStyle extends M.Control {
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
    if (M.utils.isUndefined(PointStyleImpl)) {
      M.exception('La implementación usada no puede crear controles StyleToolsControl');
    }


    // 2. implementation of this control
    const impl = new PointStyleImpl();
    super(impl, 'PointStyle');
    this.coding = 'data:image/svg+xml;base64,';
    this.plugin = plugin;
    this.feature = feature;
    if (!(this.feature.getStyle().getImage().fill_ === null || this.feature.getStyle().getImage().fill_ === undefined)) {
      this.icon = null;
    } else {
      const paso2 = this.feature.get('icon');
      this.icon = paso2;
    }

    this.listaDeIconos = null;
    this.listaDeIconos = {
      id: 'Formas base',
      name: 'Formas base',
      icons: [],
    };
    if (this.feature.getStyle().getImage().fill_ != null) {
      this.color = this.feature.getStyle().getImage().getFill().getColor();
    } else {
      this.color = this.feature.get('color');
    }
    if (this.feature.getStyle().getImage().radius_ != undefined && this.feature.getStyle().getImage().radius_ != null) {
      this.size = this.feature.getStyle().getImage().radius_;
    } else {
      this.size = this.feature.get('size');
    }
    const svgList = ['g-cartografia-circulo', 'g-cartografia-cuadrado', 'g-cartografia-estrella', 'g-cartografia-arbol', 'g-cartografia-agua', 'g-cartografia-avion', 'g-cartografia-casa', 'g-cartografia-coche', 'g-cartografia-edificio',
      'g-cartografia-fuente', 'g-cartografia-gota', 'g-cartografia-merendero', 'g-cartografia-prismaticos1', 'g-cartografia-tienda', 'g-cartografia-triangulo', 'g-cartografia-castillo', 'g-cartografia-iglesia',
      'g-cartografia-templo', 'g-cartografia-torre', 'g-cartografia-escultura', 'g-cartografia-cafeteria', 'g-cartografia-comida-rapida', 'g-cartografia-restaurante', 'g-cartografia-coliseo'];
    const classIconList = ['CirculoSVG', CuadradoSVG, EstrellaSVG, ArbolSVG, AguaSVG, AvionSVG, CasaSVG, CocheSVG, EdificioSVG, FuenteSVG, GotaSVG, MerenderoSVG, PrismaticosSVG,
      TiendaSVG, TrianguloSVG, CastilloSVG, IglesiaSVG, TemploSVG, TorreSVG, EsculturaSVG, CafeteriaSVG, RapidaSVG, RestauranteSVG, ColiseoSVG];
    const sourceList = ['CirculoSVG', 'rectangle.svg', 'estrella.svg', 'arbol.svg', 'agua.svg', 'avion.svg', 'casa.svg', 'coche.svg', 'edificio.svg', 'fuente.svg', 'gota.svg', 'merendero.svg', 'prismaticos.svg',
      'tienda.svg', 'triangulo.svg', 'castillo.svg', 'iglesia.svg', 'templo.svg', 'torre.svg', 'escultura.svg', 'cafeteria.svg', 'comida-rapida.svg', 'restaurante.svg', 'coliseo.svg'];
    this.icons = svgList;
    this.classIconList = classIconList;
    this.sourceList = sourceList;
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
    const cpal = html.querySelector('div.size');
    const destroyPlugin = html.querySelector('button#destroy-plugin');
    const functionDestroyPlugin = function(event) {
      this.plugin.destroyControl();
    };
    destroyPlugin.addEventListener('click', functionDestroyPlugin.bind(this));
    for (let i = 3; i <= 24; i *= 2) {
      const p = document.createElement('div');
      p.title = i;
      p.classList.add('ppal');
      p.data = i;
      p.style.backgroundImage = ImageCircle;
      cpal.append(p);
      const sizeIcon = document.createElement('IMG');
      sizeIcon.style.width = (((21 + i) + (8 * (i / 6))) * 0.75) + 'px';
      sizeIcon.style.marginTop = 4 + 'px';
      p.append(sizeIcon);
      let img = p.style.backgroundImage;
      if (img === 'none') {
        img = null;
      } else {
        img = img.replace(/^url\((.+)\)/, '$1').replace(/'/g, '');
      }
      sizeIcon.src = ImageCircle;
      p.style.backgroundImage = 'none';

      if (this.size === p.data) {
        p.classList.add('active');
      }
      p.addEventListener('click', () => {
        this.feature.set('size', p.data);
        const elements = html.getElementsByClassName('ppal');
        Array.prototype.forEach.call(elements, (el) => {
          el.classList.remove('active');
        });
        p.classList.add('active');
        let style2;
        if (this.icon === null) {
          style2 = new ol.style.Style({
            image: new ol.style.Circle({
              radius: p.data,
              stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
              fill: new ol.style.Fill({ color: this.color }),
            }),
          });
        } else {
          let paso2 = this.icon;
          paso2 = paso2.replace('width="' + (this.size * 2) + 'px"', 'width="' + (p.data * 2) + 'px"');
          paso2 = paso2.replace('height="' + (this.size * 2) + 'px"', 'height="' + (p.data * 2) + 'px"');
          const toBTOA = window.btoa(paso2);
          const finalTienda = this.coding + toBTOA;
          style2 = new ol.style.Style({
            image: new ol.style.Icon({
              src: finalTienda,
            }),
          });
          this.icon = paso2;
          this.feature.set('icon', paso2);
        }
        this.feature.setStyle(style2);
        this.feature.changed();
        this.plugin.plugin.changeSquare(this.feature);
        this.size = p.data;
      });
    }
    const cpal2 = html.querySelector('div.style');
    let i;
    cpal2.classList.add('icon-palette');


    const iconList = document.createElement('div');
    iconList.classList.add('ipal-list');
    cpal2.append(iconList);

    // Afficher toutes les icones d'une categorie
    for (i = 0; i < this.icons.length; i += 1) {
      const p = document.createElement('div');
      p.classList.add('ipal');
      p.classList.add(this.icons[i]);
      p.data = this.classIconList[i];
      p.sourceData = this.sourceList[i];
      iconList.append(p);

      p.addEventListener('click', () => {
        this.setIcon(p.data, p.sourceData);
      });
    }
    const changeColor = function(event) {
      let style2;
      if (this.icon === null) {
        style2 = new ol.style.Style({
          image: new ol.style.Circle({
            radius: this.size,
            stroke: new ol.style.Stroke({ color: 'white', width: 2 }),
            fill: new ol.style.Fill({ color: color.value }),
          }),
        });
      } else {
        let paso2 = this.icon;
        const colorString = '<path fill="' + this.color + '"';
        const re = new RegExp(colorString, 'g');
        const polygonString = '<polygon fill="' + this.color + '"';
        const rd = new RegExp(polygonString, 'g');
        const rectString = '<rect fill="' + this.color + '"';
        const rect = new RegExp(rectString, 'g');
        paso2 = paso2.replace(re, '<path fill="' + color.value + '"');
        paso2 = paso2.replace(rd, '<polygon fill="' + color.value + '"');
        paso2 = paso2.replace(rect, '<rect fill="' + color.value + '"');
        const toBTOA = window.btoa(paso2);
        const finalTienda = this.coding + toBTOA;
        style2 = new ol.style.Style({
          image: new ol.style.Icon({
            src: finalTienda,
          }),
        });
        this.feature.set('icon', paso2);
        this.icon = paso2;
      }
      this.feature.setStyle(style2);
      this.feature.set('color', color.value);
      this.feature.changed();
      this.color = color.value;
    };
    color.addEventListener('change', changeColor.bind(this, color));
    return html;
  }

  setIcon(data, sourceData) {
    if (data != 'CirculoSVG') {
      const paso1 = data.replace(this.coding, '');
      const toATOB = window.atob(paso1);
      let paso2 = toATOB.toString();
      paso2 = paso2.replace(/<path/g, '<path fill="' + this.color + '"');
      paso2 = paso2.replace(/<polygon/g, '<polygon fill="' + this.color + '"');
      paso2 = paso2.replace(/<rect/g, '<rect fill="' + this.color + '"');
      paso2 = paso2.replace(/width="10px"/g, 'width="' + (this.size * 2) + 'px"');
      paso2 = paso2.replace(/height="10px"/g, 'height="' + (this.size * 2) + 'px"');
      const toBTOA = window.btoa(paso2);
      const finalTienda = this.coding + toBTOA;
      // if (this.feature.getStyle().getImage() === null) {
      this.feature.setStyle(new ol.style.Style({
        image: new ol.style.Icon({
          src: finalTienda,
          id: data,
        }),
      }));
      this.feature.set('sourceData', sourceData);
      this.feature.set('color', this.color);
      this.feature.set('size', this.size);
      this.feature.set('icon', paso2);
      this.icon = paso2;
    } else {
      const style2 = new ol.style.Style({
        image: new ol.style.Circle({
          radius: this.size,
          stroke: new ol.style.Stroke({
            color: 'white',
            width: 2,
          }),
          fill: new ol.style.Fill({
            color: this.color,
          }),
        }),
      });
      this.feature.setStyle(style2);
      this.feature.set('icon', null);
      this.icon = null;
    }
    // } else {
    //   this.feature.setStyle(new ol.style.Style({
    //     fill: new ol.style.Fill({ color: this.color }),
    //     image: new ol.style.Icon({
    //       src: img + 'width=' + (
    //         this.size * 2) + '&height=' + (
    //         this.size * 2),
    //       size: [
    //         this.size * 2,
    //         this.size * 2,
    //       ],
    //     }),
    //   }));
    // }
    this.feature.changed();
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
    return control instanceof PointStyle;
  }

  // Add your own functions
}
