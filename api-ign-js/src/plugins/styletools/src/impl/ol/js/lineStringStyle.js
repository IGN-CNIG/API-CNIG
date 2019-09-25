/**
 * @module M/impl/control/LineStringStyleImpl
 */
export default class LineStringStyleImpl extends M.impl.Control {
  constructor() {
    super();

    this.features = null;
    /**
     * Interaction modify
     * @public
     * @type {ol.interaction.Select}
     * @api stable
     */
    this.select = null;
    this.edit = null;
    this.currentFeature_ = null;
  }
}
