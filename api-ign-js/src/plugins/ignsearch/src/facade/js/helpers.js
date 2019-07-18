const registerHelpers = () => {
  Handlebars.registerHelper('toUpperCase', (str) => {
    return str.toUpperCase();
  });
  Handlebars.registerHelper('ifCond', (v1, operator, v2, options) => {
    switch (operator) {
      case '===':
        return (v1 === v2) ? options.fn(this) : options.inverse(this);
      case '!==':
        return (v1 !== v2) ? options.fn(this) : options.inverse(this);
      case '<':
        return (v1 < v2) ? options.fn(this) : options.inverse(this);
      case '<=':
        return (v1 <= v2) ? options.fn(this) : options.inverse(this);
      case '>':
        return (v1 > v2) ? options.fn(this) : options.inverse(this);
      case '>=':
        return (v1 >= v2) ? options.fn(this) : options.inverse(this);
      case '&&':
        return (v1 && v2) ? options.fn(this) : options.inverse(this);
      case '||':
        return (v1 || v2) ? options.fn(this) : options.inverse(this);
      default:
        return options.inverse(this);
    }
  });
  Handlebars.registerHelper('printType', (type, address, id, municipality) => {
    let line = `<li id=${id}><span id="info">${address.toUpperCase()}</span>`;
    // add following lines if asked to show entity type again
    // (but not if type's portal, callejero or Codpost)
    // if (type !== 'callejero' && type !== 'portal' && type !== 'Codpost') {
    //   line += ` (${type.toUpperCase()})`;
    // }
    if (municipality !== undefined) {
      line += ` en ${municipality}`;
    }
    return line;
  });
};
export default registerHelpers;
