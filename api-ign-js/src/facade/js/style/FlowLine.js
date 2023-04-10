/**
 * @module M/style/FlowLine
 */
import StyleFlowLineImpl from 'impl/style/FlowLine';
import Simple from './Simple';
import { isNullOrEmpty, extendsObj } from '../util/Utils';

/**
 * @classdesc
 * TODO Main constructor of the class. Creates a FlowLine Style
 * with parameters specified by the user
 * @api
 */
class FlowLine extends Simple {
  /**
   * @constructor
   * @extends {M.style.Simple}
   * @param {options} userParameters parameters
   * @api
   */
  constructor(optionsVar) {
    let options = optionsVar;
    if (isNullOrEmpty(options)) {
      options = FlowLine.DEFAULT_NULL;
    }
    options = extendsObj({}, options);

    const impl = new StyleFlowLineImpl(options);
    super(options, impl);
  }

  /**
   * This function apply style
   *
   * @function
   * @protected
   * @param {M.layer.Vector} layer - Layer to apply the styles
   * @api
   */
  unapply(layer) {
    this.getImpl().unapply(layer);
  }

  /**
   * TODO
   *
   * @function
   * @private
   */
  getDeserializedMethod_() {
    return "((serializedParameters) => M.style.Simple.deserialize(serializedParameters, 'M.style.FlowLine'))";
  }
}

/**
 * Default options for this style
 * @const
 * @type {object}
 * @public
 * @api
 */
FlowLine.DEFAULT_NULL = {
  color: 'red',
  color2: 'yellow',
  arrowColor: '',
  width: 2,
  width2: 25,
  arrow: 0,
  lineCap: 'butt',
};

export default FlowLine;
