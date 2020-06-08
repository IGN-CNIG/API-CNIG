/**
 * @module M/impl/control/CurtainInteraction

 */
export default class CurtainInteraction extends ol.interaction.Pointer {
  /**
   * @classdesc
   * Main constructor of the CurtainInteraction.
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
    this.opacityVal = (optionsE.opacityVal || 100);

    const layerA = [optionsE.lyrA].map(layer => layer.getImpl().getOL3Layer()).filter(layer => layer != null);
    this.addLayerA(layerA);

    const layerB = [optionsE.lyrB].map(layer => layer.getImpl().getOL3Layer()).filter(layer => layer != null);
    this.addLayerB(layerB);

    const layerC = [optionsE.lyrC].map(layer => layer.getImpl().getOL3Layer()).filter(layer => layer != null);
    this.addLayerC(layerC);

    const layerD = [optionsE.lyrD].map(layer => layer.getImpl().getOL3Layer()).filter(layer => layer != null);
    this.addLayerD(layerD);

  }

  /** Set the map > start postcompose
   */

  setMap(map) {

    //e2m?
    if (this.getMap()) {
      for (let i = 0; i < this.layers_.length; i += 1) {
        if (this.layers_[i].precompose) ol.Observable.unByKey(this.layers_[i].precompose);
        if (this.layers_[i].postcompose) ol.Observable.unByKey(this.layers_[i].postcompose);
        this.layers_[i].precompose = this.layers_[i].postcompose = null;
      }
      this.getMap().renderSync();
    }
    ol.interaction.Pointer.prototype.setMap.call(this, map);
    if (map) {
      this.layers_[0].precompose = this.layers_[0].on('precompose', this.precomposeA_.bind(this));
      this.layers_[0].postcompose = this.layers_[0].on('postcompose', this.postcomposeA_.bind(this));
      this.layers_[1].precompose = this.layers_[1].on('precompose', this.precomposeB_.bind(this));
      this.layers_[1].postcompose = this.layers_[1].on('postcompose', this.postcomposeB_.bind(this));
      this.layers_[2].precompose = this.layers_[2].on('precompose', this.precomposeC_.bind(this));
      this.layers_[2].postcompose = this.layers_[2].on('postcompose', this.postcomposeC_.bind(this));
      this.layers_[3].precompose = this.layers_[3].on('precompose', this.precomposeD_.bind(this));
      this.layers_[3].postcompose = this.layers_[3].on('postcompose', this.postcomposeD_.bind(this));
      map.renderSync();
    }
  }

  /** 
   * Set opacity level
   * 
   * @param {integer} opacityVal
   */
  setOpacity(opacityVal) {

    this.opacityVal = opacityVal;
    if (this.getMap()) {
      for (let i = 0; i < this.layers_.length; i += 1) {
        this.layers_[i].setOpacity(this.opacityVal / 100);
      }
    }
    //e2m?
    //if (this.getMap()) this.getMap().renderSync();

  }

  /** 
   * Set param staticDivision
   * 
   * @param {integer} staticDivision
   */
  setStaticDivision(staticDivision) {

    this.staticDivision = staticDivision;
    //e2m?
    //if (this.getMap()) this.getMap().renderSync();

  }

  /** 
   * Set param comparisonMode
   * 
   * @param {integer} comparisonMode
   */
  setComparisonMode(comparisonMode) {

    this.comparisonMode = comparisonMode;

  }

  /**
   * Set Visibility on layers C & D
   *
   * @public
   * @function
   * @api stable
   */
  setVisibilityLayersCD() {
    if ((this.comparisonMode === 1) || (this.comparisonMode === 2)) {
      this.layers_[2].setVisible(false);
      this.layers_[3].setVisible(false);
    } else {
      this.layers_[2].setVisible(true);
      this.layers_[3].setVisible(true);
    }

  }


  /** 
   * Add Layer A to clip
   * 
   * @param {ol.layer|Array<ol.layer>} layer to clip
   */
  addLayerA(layers) {

    if (!(layers instanceof Array)) layers = [layers];
    const l = {
      layer: layers[0]
    };
    if (this.getMap()) {
      l.precompose = layers[0].on('precompose', this.precomposeA_.bind(this));
      l.postcompose = layers[0].on('postcompose', this.postcomposeA_.bind(this));
      this.getMap().renderSync();
    }
    this.layers_.push(layers[0]);
  }

  /** 
   * Add Layer B to clip
   * 
   * @param {ol.layer|Array<ol.layer>} layer to clip
   */
  addLayerB(layers) {
    if (!(layers instanceof Array)) layers = [layers];
    const l = {
      layer: layers[0]
    };
    if (this.getMap()) {
      l.precompose = layers[0].on('precompose', this.precomposeB_.bind(this));
      l.postcompose = layers[0].on('postcompose', this.postcomposeB_.bind(this));
      this.getMap().renderSync();
    }
    this.layers_.push(layers[0]);
  }

  /** 
   * Add Layer C to clip
   * 
   * @param {ol.layer|Array<ol.layer>} layer to clip
   */
  addLayerC(layers) {
    if (!(layers instanceof Array)) layers = [layers];
    const l = {
      layer: layers[0]
    };
    if (this.getMap()) {
      l.precompose = layers[0].on('precompose', this.precomposeC_.bind(this));
      l.postcompose = layers[0].on('postcompose', this.postcomposeC_.bind(this));
      this.getMap().renderSync();
    }
    this.layers_.push(layers[0]);
  }

  /** 
   * Add Layer C to clip
   * 
   * @param {ol.layer|Array<ol.layer>} layer to clip
   */
  addLayerD(layers) {
    if (!(layers instanceof Array)) layers = [layers];
    const l = {
      layer: layers[0]
    };
    if (this.getMap()) {
      l.precompose = layers[0].on('precompose', this.precomposeD_.bind(this));
      l.postcompose = layers[0].on('postcompose', this.postcomposeD_.bind(this));
      this.getMap().renderSync();
    }
    this.layers_.push(layers[0]);

  }

  /**
   *  Remove a layer to clip
   * 
   * @param {ol.layer|Array<ol.layer>} layer to clip
   */
  removeLayer(layers) {

    if (!(layers instanceof Array)) {
      layers = [layers];
    }
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

  /**
   *  Set position of the clip
   * 
   * @param {ol.Pixel|ol.MapBrowserEvent}
   */
  setPosition(e) {
    if (e.pixel) {
      this.pos = e.pixel;
    } else if (e && e instanceof Array) {
      this.pos = e;
    } else {
      e = [-10000000, -10000000];
    }
    if (this.getMap()) this.getMap().renderSync();
  }

  /* @private
   */
  precomposeA_(e) {

    const ctx = e.context;
    const ratio = e.frameState.pixelRatio;
    const lienzoMapa = this.map_.getSize();
    let margenClip = 0; //Stroke size in pixels.
    //e2m: Canvas size --> lienzoMapa
    //e2m: Mouse coordinates --> this.pos
    ctx.save();
    ctx.beginPath();
    if (this.staticDivision) {
      if (this.comparisonMode == 1) {
        ctx.rect(0, 0, lienzoMapa[0] / 2 * ratio - margenClip * ratio, lienzoMapa[1]); //e2m: left fixed
      } else if (this.comparisonMode == 2) {
        ctx.rect(0, 0, lienzoMapa[0], lienzoMapa[1] * ratio / 2 - margenClip * ratio);//e2m: up fixed
      } else if (this.comparisonMode == 3) {
        ctx.rect(0, 0, lienzoMapa[0] / 2 * ratio - margenClip * ratio, lienzoMapa[1] / 2);//e2m: up&left fixed
      }
    }
    else {
      if (this.comparisonMode == 1) {
        ctx.rect(0, 0, this.pos[0] - margenClip * ratio, lienzoMapa[1]); //e2m: left dynamic
      } else if (this.comparisonMode == 2) {
        ctx.rect(0, 0, ctx.canvas.width, this.pos[1] * ratio - margenClip * ratio);  //e2m: up dynamic
      } else if (this.comparisonMode == 3) {
        ctx.rect(0, 0, this.pos[0] - margenClip * ratio, this.pos[1] - margenClip * ratio);  //e2m: up&left dynamic
      }
    }

    /**
     * 
     * e2m: con esto podemos pintar una línea de color para contornear la capa. Pero no queda bien
     * 
     */
    if (margenClip > 0) {
      ctx.lineWidth = 2 * margenClip * ratio;
      ctx.strokeStyle = 'rgba(0, 102, 204, 0.9)';
      ctx.stroke();
    }
    ctx.clip();
  }

  /* @private
   */
  postcomposeA_(e) {
    e.context.restore();
  }

  /* @private
   */
  precomposeB_(e) {

    const ctx = e.context;
    const ratio = e.frameState.pixelRatio;
    const lienzoMapa = this.map_.getSize();
    let margenClip = 0; //Stroke size in pixels.
    //e2m: Canvas size --> lienzoMapa
    //e2m: Mouse coordinates --> this.pos
    ctx.save();
    ctx.beginPath();
    if (this.staticDivision) {
      if (this.comparisonMode == 1) {
        ctx.rect(lienzoMapa[0] * ratio / 2 + margenClip * ratio, 0, ctx.canvas.width - lienzoMapa[0] * ratio / 2, lienzoMapa[1]); //e2m: Right fixed
      } else if (this.comparisonMode == 2) {
        ctx.rect(0, lienzoMapa[1] * ratio / 2 + margenClip * ratio, ctx.canvas.width, ctx.canvas.height - lienzoMapa[1] * ratio / 2); //e2m: Down fixed
      } else if (this.comparisonMode == 3) {
        ctx.rect(lienzoMapa[0] * ratio / 2, 0, ctx.canvas.width - lienzoMapa[0] * ratio / 2, lienzoMapa[1] / 2); //e2m: up&right fixed
      }
    } else {
      if (this.comparisonMode == 1) {
        ctx.rect(this.pos[0], 0, lienzoMapa[0] - this.pos[0], lienzoMapa[1]); //e2m: Right dynamic
      } else if (this.comparisonMode == 2) {
        ctx.rect(0, this.pos[1], ctx.canvas.width, ctx.canvas.height - this.pos[1]); //e2m: Down dynamic
      } else if (this.comparisonMode == 3) {
        //ctx.rect(this.pos[0], 0, lienzoMapa[0] - this.pos[0], lienzoMapa[1]); //e2m: split screen three. maybe
        ctx.rect(this.pos[0], 0, lienzoMapa[0] - this.pos[0], this.pos[1]); //e2m: up&right dynamic
      }

    }
    if (margenClip > 0) {
      ctx.lineWidth = 2 * margenClip * ratio;
      ctx.strokeStyle = 'rgba(0, 102, 204, 0.9)';
      ctx.stroke();
    }
    ctx.clip();


  }

  /* @private
   */
  postcomposeB_(e) {
    e.context.restore();
  }

  precomposeC_(e) {
    const ctx = e.context;
    const ratio = e.frameState.pixelRatio;
    const lienzoMapa = this.map_.getSize();
    let margenClip = 0; //Stroke size in pixels.
    //e2m: Canvas size --> lienzoMapa
    //e2m: Mouse coordinates --> this.pos

    ctx.save();
    ctx.beginPath();
    if (this.staticDivision) {
      if (this.comparisonMode == 3) {
        ctx.rect(0, lienzoMapa[1] * ratio / 2, lienzoMapa[0] / 2 * ratio - margenClip * ratio, lienzoMapa[1]);  //e2m: down&left fixed
      }
    }
    else {
      if (this.comparisonMode == 3) {
        ctx.rect(0, this.pos[1] * ratio, this.pos[0] * ratio - margenClip * ratio, (lienzoMapa[1] - this.pos[1]) * ratio - margenClip * ratio);  //e2m: down&left dynamic
      }
    }
    if (margenClip > 0) {
      ctx.lineWidth = 2 * margenClip * ratio;
      ctx.strokeStyle = 'rgba(0, 102, 204, 0.9)';
      ctx.stroke();
    }
    ctx.clip();
  }

  /* @private
   */
  postcomposeC_(e) {
    e.context.restore();
  }

  precomposeD_(e) {
    const ctx = e.context;
    const ratio = e.frameState.pixelRatio;
    const lienzoMapa = this.map_.getSize();
    let margenClip = 0; //Stroke size in pixels.
    //e2m: Canvas size --> lienzoMapa
    //e2m: Mouse coordinates --> this.pos

    ctx.save();
    ctx.beginPath();
    if (this.staticDivision) {
      if (this.comparisonMode == 3) {
        ctx.rect(lienzoMapa[0] * ratio / 2, lienzoMapa[1] * ratio / 2, ctx.canvas.width * ratio / 2 - margenClip * ratio, ctx.canvas.height * ratio / 2 - margenClip * ratio); //e2m: down&right fixed
      }
    }
    else {
      if (this.comparisonMode == 3) {
        ctx.rect(this.pos[0] * ratio, this.pos[1] * ratio, (ctx.canvas.width - this.pos[0]) * ratio - margenClip * ratio, (ctx.canvas.height - this.pos[1]) * ratio - margenClip * ratio); //e2m: down&right dynamic
      }
    }
    if (margenClip > 0) {
      ctx.lineWidth = 2 * margenClip * ratio;
      ctx.strokeStyle = 'rgba(0, 102, 204, 0.9)';
      ctx.stroke();
    }
    ctx.clip();
  }

  /* @private
   */
  postcomposeD_(e) {
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
