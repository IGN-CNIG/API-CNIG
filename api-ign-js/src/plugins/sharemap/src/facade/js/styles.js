/**
 * Styles configuration file.
 * This file parameterizes styles of user interfaces plugin.
 *
 * JSS package is used for this task. @url - https://github.com/cssinjs/jss
 */
import jss from 'jss';
import preset from 'jss-preset-default';

/**
 * Initialize the jss package
 */
jss.setup(preset());

/**
 * This function takes primaryColor and secondaryColor
 * and returns an style options.
 * @function
 * @param {object} options - {primaryColor: ..., secondaryColor: ...}
 */
const styles = (options) => {
  return {
    button: {
      backgroundColor: `${options.primaryColor} !important`,
      color: `${options.secondaryColor} !important`,
    },
    content: {
      backgroundColor: `${options.secondaryColor}`,
      border: `1px solid ${options.primaryColor}`,
      boxShadow: `0 2px 4px ${options.primaryColor}, 0 -1px 0px ${options.primaryColor}`,
    },
    message: {
      '&>button': {
        backgroundColor: `${options.primaryColor}`,
        color: `${options.secondaryColor}`,
      },
    },
    modalButton: {
      '&>button': {
        backgroundColor: `${options.primaryColor}`,
        color: `${options.secondaryColor}`,
      },
    },
    title: {
      color: `${options.primaryColor}`,
      '&>span': {
        color: `${options.primaryColor}`,
      },
    },
  };
};

/**
 * This function takes primaryColor and secondaryColor
 * and returns an cascade style sheet (CSS).
 * @function
 * @param {object} options - {primaryColor: ..., secondaryColor: ...}
 */
const createStyle = (options) => {
  const { classes } = jss.createStyleSheet(styles(options)).attach();
  return classes;
};

export default createStyle;
