/**
 * @module M/impl/control/TransparentInteraction

 */
export default class TransparentInteraction extends ol.interaction.Pointer {
  /**
   * @classdesc
   * Main constructor of the TransparentInteraction.
   *
   * @constructor
   * @extends {ol.interaction.Pointer}
   * @api stable
   */
  constructor(options) {
    super(options);
    this.layers_ = [];
    ol.interaction.Pointer.call(this, {
      handleDownEvent: this.setPosition,
      handleMoveEvent: this.setPosition,
    });

    // Default options
    const optionsE = options || {};

    this.pos = false;
    this.radius = (optionsE.radius || 100);

    if (optionsE.layers) {
      optionsE.layers = [optionsE.layers];
      const layer = optionsE.layers.map(layer => layer.getImpl().getOL3Layer())
        .filter(layer => layer != null);
      this.addLayer(layer);
    }
  }

  /** Set the map > start postcompose
   */
  setMap(map) {
    let i;
    if (this.getMap()) {
      for (i = 0; i < this.layers_.length; i += 1) {
        if (this.layers_[i].precompose) ol.Observable.unByKey(this.layers_[i].precompose);
        if (this.layers_[i].postcompose) ol.Observable.unByKey(this.layers_[i].postcompose);
        /* eslint-disable */
        this.layers_[i].precompose = this.layers_[i].postcompose = null;
        /* eslint-enable */
      }

      this.getMap().renderSync();
    }

    ol.interaction.Pointer.prototype.setMap.call(this, map);
    if (map) {
      for (i = 0; i < this.layers_.length; i += 1) {
        this.layers_[i].precompose = this.layers_[i].on('precompose', this.precompose_.bind(this));
        this.layers_[i].postcompose = this.layers_[i].on('postcompose', this.postcompose_.bind(this));
      }

      map.renderSync();
    }
  }

  /** Set clip radius
   * @param {integer} radius
   */
  setRadius(radius) {
    this.radius = radius;
    if (this.getMap()) this.getMap().renderSync();
  }

  /** Add a layer to clip
   * @param {ol.layer|Array<ol.layer>} layer to clip
   */
  addLayer(layers) {
    /* eslint-disable */
    if (!(layers instanceof Array)) layers = [layers];
    /* eslint-enable */
    for (let i = 0; i < layers.length; i += 1) {
      const l = { layer: layers[i] };
      if (this.getMap()) {
        l.precompose = layers[i].on('precompose', this.precompose_.bind(this));
        l.postcompose = layers[i].on('postcompose', this.postcompose_.bind(this));
        this.getMap().renderSync();
      }
      this.layers_.push(layers[i]);
    }
  }

  /** Remove a layer to clip
   * @param {ol.layer|Array<ol.layer>} layer to clip
   */
  removeLayer(layers) {
    /* eslint-disable */
    if (!(layers instanceof Array)) layers = [layers];
    /* eslint-enable */
    for (let i = 0; i < layers.length; i += 1) {
      let k;
      for (k = 0; k < this.layers_.length; k += 1) {
        if (this.layers_[k] === layers[i]) {
          break;
        }
      }

      if (k !== this.layers_.length && this.getMap()) {
        if (this.layers_[k].precompose) ol.Observable.unByKey(this.layers_[k].precompose);
        if (this.layers_[k].postcompose) ol.Observable.unByKey(this.layers_[k].postcompose);
        this.layers_.splice(k, 1);
        this.getMap().renderSync();
      }
    }
  }

  /** Set position of the clip
   * @param {ol.Pixel|ol.MapBrowserEvent}
   */
  setPosition(e) {
    if (e.pixel) {
      this.pos = e.pixel;
    } else if (e && e instanceof Array) {
      this.pos = e;
    } else {
      /* eslint-disable */
      e = [-10000000, -10000000];
      /* eslint-enable */
    }

    if (this.getMap()) this.getMap().renderSync();
  }

  /* @private
   */
  precompose_(e) {
    const ctx = e.context;
    const ratio = e.frameState.pixelRatio;
    ctx.save();
    ctx.beginPath();
    ctx.arc(this.pos[0] * ratio, this.pos[1] * ratio, this.radius * ratio, 0, 2 * Math.PI);
    ctx.clip();
  }

  /* @private
   */
  postcompose_(e) {
    e.context.restore();
  }

  /**
   * Activate or deactivate the interaction.
   * @param {boolean} active Active.
   * @observable
   * @api
   */
  setActive(b) {
    super.setActive(b);
  }
}
