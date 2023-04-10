/**
 * @module M/impl/style/FlowLine
 */
import { isNullOrEmpty } from 'M/util/Utils';
import OLFeature from 'ol/Feature';
import { unByKey } from 'ol/Observable';
import { toContext as toContextRender } from 'ol/render';
import Simple from './Simple';
import postRender from '../util/render';
import OLStyleFlowLine from '../ext/OLStyleFlowLine';
import '../ext/cspline';
/**
 * @classdesc
 * @api
 * @namespace M.impl.style.FlowLine
 *
 */
class FlowLine extends Simple {
  /**
   * Main constructor of the class.
   * @constructor
   * @implements {M.impl.style.Simple}
   * @api stable
   */
  constructor(options) {
    super(options);
    this.olStyleFn_ = this.updateFacadeOptions(options);
  }

  /**
   * This function se options to ol style
   *
   * @public
   * @param {object} options - options to style
   * @function
   * @api stable
   */
  updateFacadeOptions(options) {
    return (feature) => {
      let featureVariable = feature;
      if (!(featureVariable instanceof OLFeature)) {
        featureVariable = this;
      }
      const flow = options;
      const flowStyle = new OLStyleFlowLine();
      const getValue = Simple.getValue;
      if (!isNullOrEmpty(flow)) {
        flowStyle.setColor(getValue(flow.color, featureVariable));
        flowStyle.setColor2(getValue(flow.color2, featureVariable));
        flowStyle.setArrowColor(getValue(flow.arrowColor, featureVariable));
        flowStyle.setWidth(getValue(flow.width, featureVariable));
        flowStyle.setWidth2(getValue(flow.width2, featureVariable));
        flowStyle.setArrow(getValue(flow.arrow, featureVariable));
        flowStyle.setLineCap(getValue(flow.lineCap, featureVariable));
        flowStyle.setOffset(getValue(flow.offset0, featureVariable), 0);
        flowStyle.setOffset(getValue(flow.offset1, featureVariable), 1);
      }
      return [flowStyle];
    };
  }

  /**
   * This function apply style to layer
   * @public
   * @function
   * @param {M.layer.Vector} layer - Layer
   * @api stable
   */
  applyToLayer(layer) {
    super.applyToLayer(layer);

    const olLayer = layer.getImpl().getOL3Layer();
    if (!isNullOrEmpty(olLayer)) {
      this.postComposeEvtKey_ = olLayer.on('postcompose', postRender, olLayer);
    }
  }

  /**
   * This function apply style
   *
   * @function
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @api stable
   */
  unapply() {
    unByKey(this.postComposeEvtKey_);
  }

  /**
   * TODO
   *
   * @public
   * @function
   * @api stable
   */
  updateCanvas(canvas) {
    this.updateFacadeOptions(this.options_);
    const canvasSize = FlowLine.getCanvasSize();
    const vectorContext = toContextRender(canvas.getContext('2d'), {
      size: canvasSize,
    });
    const applyStyle = this.olStyleFn_()[0];
    vectorContext.setStyle(applyStyle);
  }

  /**
   * TODO
   * @public
   * @function
   * @api stable
   */
  static getCanvasSize() {
    return [25, 15];
  }
}
export default FlowLine;
