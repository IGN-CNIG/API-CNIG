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
  Handlebars.registerHelper('printType', (type, address, id, municipality, cps) => {
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
};
export default registerHelpers;
