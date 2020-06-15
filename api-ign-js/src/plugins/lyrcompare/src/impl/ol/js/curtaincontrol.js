/**
 * @module M/impl/control/CurtainControl
 */
import CurtainInteraction from 'impl/CurtainInteraction';


export default class CurtainControl extends M.impl.Control {
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
    // super addTo - don't delete
    this.map = map;
    this.olMap = map.getMapImpl();

    super.addTo(map, html);
  }

  /**
   * Effects on the layer
   *
   * @public
   * @function
   * @param { M.Layer } layer layer to which to assign an effect
   * @param { Number } opacityVal nivel de opacidad
   * @api stable
   */
  effectSelectedCurtain(lyrA, lyrB, lyrC, lyrD, opacityVal, staticDivision, comparisonMode) {

    lyrA.setVisible(true);
    lyrB.setVisible(true);

    //e2m: access map objects with this.olMap
    this.transparentInteraction_ = new CurtainInteraction({
      opacityVal,
      lyrA,
      lyrB,
      lyrC,
      lyrD,
    });

    //this.setVisibilityLayersCD();//e2m?: si no quito esto, a este procedimiento se le llama dos veces. No sé el motivo. Parece que al crearse el CurtainInteraction ya se hace la llamada

    this.olMap.addInteraction(this.transparentInteraction_); //e2m: Important control number interactions this.olMap.interactions.array_
    this.setOpacity(opacityVal);
    this.setComparisonMode(comparisonMode);
    this.setStaticDivision(staticDivision);
  }

  /**
   * Layer visibility
   *
   * @public
   * @function
   * @param { Number } opacityVal opacidad de las capas
   * @api stable
   */
  setVisibilityLayersCD() {

    if (this.transparentInteraction_ !== undefined) this.transparentInteraction_.setVisibilityLayersCD();

  }

  /**
   * Layers opacity
   *
   * @public
   * @function
   * @param { Number } opacityVal opacidad de las capas
   * @api stable
   */
  setOpacity(opacityVal) {

    if (this.transparentInteraction_ !== undefined) this.transparentInteraction_.setOpacity(opacityVal);

  }

  /**
     * Layers comparison mode
     *
     * @public
     * @function
     * @param { Number } comparisonMode opacidad de las capas
     * @api stable
     */
  setComparisonMode(comparisonMode) {

    if (this.transparentInteraction_ !== undefined) this.transparentInteraction_.setComparisonMode(comparisonMode);
    this.setVisibilityLayersCD();

  }

  /**
   * Set staticDivision
   *
   * @public
   * @function
   * @param { Number } staticDivision establece el tipo de división
   * @api stable
   */

  setStaticDivision(staticDivision) {

    if (this.transparentInteraction_ !== undefined) this.transparentInteraction_.setStaticDivision(staticDivision);

  }

  /**
   * Set layer
   *
   * @public
   * @function
   * @param { M.layer } layer layer to assign effect
   * @api stable
   */
  addLayer(layer) {

    this.transparentInteraction_.addLayer(layer.getImpl().getOL3Layer());

  }

  /**
   * Remove effects
   *
   * @public
   * @function
   * @api stable
   */
  removeEffectsCurtain() {
    this.olMap.removeInteraction(this.transparentInteraction_);
  }


  /**
   * Remove layer
   *
   * @public
   * @function
   * @param { M.layer } layer to remove
   * @api stable
   */
  removeLayer(layer) {

    this.transparentInteraction_.removeLayer(layer.getImpl().getOL3Layer());

  }



}
