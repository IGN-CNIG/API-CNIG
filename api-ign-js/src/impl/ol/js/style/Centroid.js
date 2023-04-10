/**
 * @module M/impl/style/Centroid
 */
import OLStyle from 'ol/style/Style';
/**
 * @classdesc
 * Clase para crear estilos en el centroide.
 * @api
 */
class Centroid extends OLStyle {
  /**
   * Constructor principal de la clase.
   * @constructor
   * @struct
   * @param {olx.style.StyleOptions=} opt_options Opciones:
   * - geometry: Geometría.
   * - fill: Relleno.
   * - image: Imagen ("ImageStyle").
   * - renderer: Renderizado.
   * - stroke: Borde.
   * - text: Texto.
   * - zIndex: Indice.
   * @api
   */
  constructor(opt_options = {}) {
    super(opt_options);
  }

  /**
   * Clona el estilo.
   * @public
   * @return {M.impl.style.CentroidStyle} "new Centroid".
   * @api stable
   */
  clone() {
    let geometry = this.getGeometry();
    if (geometry && geometry.clone) {
      geometry = geometry.clone();
    }
    return new Centroid({
      geometry,
      fill: this.getFill() ? this.getFill().clone() : undefined,
      image: this.getImage() ? this.getImage().clone() : undefined,
      stroke: this.getStroke() ? this.getStroke().clone() : undefined,
      text: this.getText() ? this.getText().clone() : undefined,
      zIndex: this.getZIndex(),
    });
  }
}

export default Centroid;
