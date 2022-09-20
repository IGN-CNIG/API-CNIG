import Handlebars from 'handlebars';
import { allowInsecurePrototypeAccess } from '@handlebars/allow-prototype-access';
import { getTextFromHtml } from '../util/Utils';

const helpers = () => {
  const insecureHandlebars = allowInsecurePrototypeAccess(Handlebars);

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
};
// Exec the register helpers
helpers();
