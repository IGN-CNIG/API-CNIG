import { getTextFromHtml } from '../util/Utils';

const helpers = (insecureHandlebars) => {
  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  insecureHandlebars.registerHelper('gt', function gt(arg1, arg2, options) {
    if (arg1 > arg2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  insecureHandlebars.registerHelper('lt', function lt(arg1, arg2, options) {
    if (arg1 < arg2) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  insecureHandlebars.registerHelper('eq', function eq(arg1, arg2, options) {
    if (Object.equals(arg1, arg2)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  /**
   * Helpers for Handlebars wich compares if the
   * first arguments is greater than the second one
   */
  insecureHandlebars.registerHelper('oneword', function oneword(arg1, options) {
    if (!/\s/g.test(getTextFromHtml(arg1))) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  insecureHandlebars.registerHelper('printType', (type, address, id, municipality, cps) => {
    let line = `<li id=${id}><span id="info">${address}</span>`;
    // add following lines if asked to show entity type again
    // (but not if type's portal, callejero or Codpost)
    if (type === 'Municipio' || type === 'provincia' || type === 'comunidad autonoma' || cps === true) {
      line += ` (${type})`;
    }
    if (municipality !== undefined) {
      line += ` en ${municipality}`;
    }
    return line;
  });

  insecureHandlebars.registerHelper('pattern', (options) => {
    let output = '';
    options.data.root.fields.forEach((field) => {
      if (!field.isFormatter) return;
      if (field.typeparam === undefined) return;
      const symbolPattern = field.typeparam;
      const numRepeat = field.value;
      for (let i = 0; i < numRepeat; i += 1) {
        output += symbolPattern;
      }
    });
    return output;
  });

  insecureHandlebars.registerHelper('formatterStr', (item) => {
    let symbolPattern = '';
    let numRepeat = 0;
    let output = '';
    numRepeat = item.value;
    symbolPattern = item.typeparam;
    for (let i = 0; i < numRepeat; i += 1) {
      output += symbolPattern;
    }
    return output;
  });

  insecureHandlebars.registerHelper('ifCond', (v1, v2, options) => {
    return v1 === v2 ? options.fn(this) : options.inverse(this);
  });

  insecureHandlebars.registerHelper('sum', (n1, n2) => {
    return n1 + n2;
  });

  insecureHandlebars.registerHelper('neq', (arg1, arg2, options) => {
    if (!Object.equals(arg1, arg2)) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  insecureHandlebars.registerHelper('unless', (arg1, options) => {
    if (!arg1) {
      return options.fn(this);
    }
    return options.inverse(this);
  });

  insecureHandlebars.registerHelper('get', (index, array) => {
    return array[index];
  });

  insecureHandlebars.registerHelper('uppercase', (string) => {
    return string.toUpperCase();
  });

  insecureHandlebars.registerHelper('lowercase', (string) => {
    return string.toLowerCase();
  });
};

export default helpers;
