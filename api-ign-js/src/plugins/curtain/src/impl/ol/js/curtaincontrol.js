/**
 * @module M/impl/control/CurtainControl
 */
export default class CurtainControl extends M.impl.Control {

  constructor() {
    super();
    /**
     * Facade of the map
     * @private
     * @type {M.Map}
     */
    this.facadeMap = null;
  }
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
    this.facadeMap = map;
    // obtengo la interacción por defecto del dblclick para manejarla
    this.olMap = map.getMapImpl();

    // super addTo - don't delete
    super.addTo(map, html);
  }

  /**
   * @classdesc Swipe Control.
   *
   * @constructor
   * @extends {ol.control.Control}
   * @param {Object=} Control options.
   *  @param {ol.layer} options.layers layer to swipe
   *  @param {ol.layer} options.rightLayer layer to swipe on right side
   *  @param {string} options.className control class name
   *  @param {number} options.position position propertie of the swipe [0,1], default 0.5
   *  @param {string} options.orientation orientation propertie (vertical|horizontal), default vertical
   */

  ol_control_Swipe(options) {
    options = options || {};

    var button = document.createElement('button');

    var element = document.createElement('div');
    element.className = (options.className || "ol-swipe") + " ol-unselectable ol-control";
    element.appendChild(button);

    element.addEventListener("mousedown", this.ol_control_Swipe_prototype_move.bind(this));
    element.addEventListener("touchstart", this.ol_control_Swipe_prototype_move.bind(this));

    ol.control.Control.call(this, {
      element: element
    });

    // An array of listener on layer postcompose
    this.precomposeRight_ = this.ol_control_Swipe_prototype_precomposeRight.bind(this);
    this.precomposeLeft_ = this.ol_control_Swipe_prototype_precomposeLeft.bind(this);
    this.postcompose_ = this.ol_control_Swipe_prototype_postcompose.bind(this);

    this.layers = [];
    if (options.layers) this.ol_control_Swipe_prototype_addLayer(options.layers, false);
    if (options.rightLayers) this.ol_control_Swipe_prototype_addLayer(options.rightLayers, true);

    this.on('propertychange', function() {
      if (this.getMap()) this.getMap().renderSync();
      if (this.get('orientation') === "horizontal") {
        this.element.style.top = this.get('position') * 100 + "%";
        this.element.style.left = "";
      } else {
        if (this.get('orientation') !== "vertical") this.set('orientation', "vertical");
        this.element.style.left = this.get('position') * 100 + "%";
        this.element.style.top = "";
      }
      this.element.classList.remove("horizontal", "vertical");
      this.element.classList.add(this.get('orientation'));
    }.bind(this));

    this.set('position', options.position || 0.5);
    this.set('orientation', options.orientation || 'vertical');
  }

  // ol_ext_inherits(ol_control_Swipe, ol.control.Control);

  /**
   * Set the map instance the control associated with.
   * @param {_ol_Map_} map The map instance.
   */
  ol_control_Swipe_prototype_setMap(map) {
    var i;
    var l;

    if (this.getMap()) {
      for (i = 0; i < this.layers.length; i++) {
        l = this.layers[i];
        if (l.right) l.layer.un(['precompose', 'prerender'], this.precomposeRight_);
        else l.layer.un(['precompose', 'prerender'], this.precomposeLeft_);
        l.layer.un(['postcompose', 'postrender'], this.postcompose_);
      }
      this.getMap().renderSync();
    }

    ol.control.Control.prototype.setMap.call(this, map);

    if (map) {
      this._listener = [];
      for (i = 0; i < this.layers.length; i++) {
        l = this.layers[i];
        if (l.right) l.layer.on(['precompose', 'prerender'], this.precomposeRight_);
        else l.layer.on(['precompose', 'prerender'], this.precomposeLeft_);
        l.layer.on(['postcompose', 'postrender'], this.postcompose_);
      }
      map.renderSync();
    }
  }

  /** @private
   */
  ol_control_Swipe_prototype_isLayer_(layer) {
    for (var k = 0; k < this.layers.length; k++) {
      if (this.layers[k].layer === layer) return k;
    }
    return -1;
  }

  /** Add a layer to clip
   *	@param {ol.layer|Array<ol.layer>} layer to clip
   *	@param {bool} add layer in the right part of the map, default left.
   */
  ol_control_Swipe_prototype_addLayer(layers, right) {
    if (!(layers instanceof Array)) layers = [layers];
    for (var i = 0; i < layers.length; i++) {
      var l = layers[i];
      if (this.ol_control_Swipe_prototype_isLayer_(l) < 0) {
        this.layers.push({ layer: l, right: right });
        if (this.getMap()) {
          if (right) l.on(['precompose', 'prerender'], this.precomposeRight_);
          else l.on(['precompose', 'prerender'], this.precomposeLeft_);
          l.on(['postcompose', 'postrender'], this.postcompose_);
          this.getMap().renderSync();
        }
      }
    }
  }

  /** Remove a layer to clip
   *	@param {ol.layer|Array<ol.layer>} layer to clip
   */
  ol_control_Swipe_prototype_removeLayer(layers) {
    if (!(layers instanceof Array)) layers = [layers];
    for (var i = 0; i < layers.length; i++) {
      var k = this.ol_control_Swipe_prototype_isLayer_(layers[i]);
      if (k >= 0 && this.getMap()) {
        if (this.layers[k].right) layers[i].un(['precompose', 'prerender'], this.precomposeRight_);
        else layers[i].un(['precompose', 'prerender'], this.precomposeLeft_);
        layers[i].un(['postcompose', 'postrender'], this.postcompose_);
        this.layers.splice(k, 1);
        this.getMap().renderSync();
      }
    }
  }

  /** @private
   */
  ol_control_Swipe_prototype_move(e) {
    var self = this;
    var l;
    switch (e.type) {
      case 'touchcancel':
      case 'touchend':
      case 'mouseup': {
        self.isMoving = false;
        ["mouseup", "mousemove", "touchend", "touchcancel", "touchmove"]
        .forEach(function(eventName) {
          document.removeEventListener(eventName, self.move);
        });
        break;
      }
      case 'mousedown':
      case 'touchstart': {
        self.isMoving = true;
        ["mouseup", "mousemove", "touchend", "touchcancel", "touchmove"]
        .forEach(function(eventName) {
          document.addEventListener(eventName, self.move.bind(self));
        });
      }
      // fallthrough
      case 'mousemove':
      case 'touchmove': {
        if (self.isMoving) {
          if (self.get('orientation') === "vertical") {
            var pageX = e.pageX ||
              (e.touches && e.touches.length && e.touches[0].pageX) ||
              (e.changedTouches && e.changedTouches.length && e.changedTouches[0].pageX);
            if (!pageX) break;
            pageX -= self.getMap().getTargetElement().getBoundingClientRect().left +
              window.pageXOffset - document.documentElement.clientLeft;

            l = self.getMap().getSize()[0];
            l = Math.min(Math.max(0, 1 - (l - pageX) / l), 1);
            self.set('position', l);
          } else {
            var pageY = e.pageY ||
              (e.touches && e.touches.length && e.touches[0].pageY) ||
              (e.changedTouches && e.changedTouches.length && e.changedTouches[0].pageY);
            if (!pageY) break;
            pageY -= self.getMap().getTargetElement().getBoundingClientRect().top +
              window.pageYOffset - document.documentElement.clientTop;

            l = self.getMap().getSize()[1];
            l = Math.min(Math.max(0, 1 - (l - pageY) / l), 1);
            self.set('position', l);
          }
        }
        break;
      }
      default:
        break;
    }
  }

  ol_control_Swipe_prototype_drawRect(e, pts) {
    var tr = e.inversePixelTransform;
    if (tr) {
      var r = [
        [pts[0][0], pts[0][1]],
        [pts[0][0], pts[1][1]],
        [pts[1][0], pts[1][1]],
        [pts[1][0], pts[0][1]],
        [pts[0][0], pts[0][1]]
      ];
      r.forEach(function(pt, i) {
        pt = [
          (pt[0] * tr[0] - pt[1] * tr[1] + tr[4]),
          (-pt[0] * tr[2] + pt[1] * tr[3] + tr[5])
        ];
        if (!i) {
          e.context.moveTo(pt[0], pt[1]);
        } else {
          e.context.lineTo(pt[0], pt[1]);
        }
      });
    } else {
      e.context.rect(pts[0][0], pts[0][1], pts[1][0], pts[1][1])
    }
  }


  /** @private
   */
  ol_control_Swipe_prototype_precomposeLeft(e) {
    var ctx = e.context;
    var size = e.frameState.size;
    ctx.save();
    ctx.beginPath();
    var pts = [
      [0, 0],
      [size[0], size[1]]
    ];
    if (this.get('orientation') === "vertical") {
      pts[1] = [
        size[0] * this.get('position'),
        size[1]
      ];
    } else {
      pts[1] = [
        size[0],
        size[1] * this.get('position')
      ];
    }
    this._ol_control_Swipe_prototype_drawRect(e, pts);
    ctx.clip();
  }

  /** @private
   */
  ol_control_Swipe_prototype_precomposeRight(e) {
    var ctx = e.context;
    var size = e.frameState.size;
    ctx.save();
    ctx.beginPath();
    var pts = [
      [0, 0],
      [size[0], size[1]]
    ];
    if (this.get('orientation') === "vertical") {
      pts[0] = [
        size[0] * this.get('position'),
        0
      ];
    } else {
      pts[0] = [
        0,
        size[1] * this.get('position')
      ]
    }
    this._ol_control_Swipe_prototype_drawRect(e, pts);
    ctx.clip();
  }

  /** @private
   */
  ol_control_Swipe_prototype_postcompose(e) {
    e.context.restore();
  }

  // export default ol_control_Swipe
}
