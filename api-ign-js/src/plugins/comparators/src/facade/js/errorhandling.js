export const handlerErrorPluginWindowSync = (err, name) => {
  if (err.message.includes('Converting circular structure to JSON')) {
    if (name === 'Timeline' || name === 'BackImgLayer') {
      M.toast.error(`Error al cargar el plugin ${name} - no se puede cargar las capas como objeto`, null, 6000);
    } else if (name) {
      M.toast.error(`Error al cargar el plugin ${name}`, null, 6000);
    } else {
      M.toast.error('Error al cargar un plugin', null, 6000);
    }

    // eslint-disable-next-line no-console
    console.error('Converting circular structure to JSON');
  }
};

export const handlerErrorURLWindowSync = (style, script, name) => {
  if (!style && name) {
    M.toast.error(`Falta por incluir el link del plugin ${name}`, null, 6000);
    // eslint-disable-next-line no-console
    console.error(`Falta por incluir el link del plugin ${name}`);
  }


  if (!script && name) {
    M.toast.error(`Falta por incluir el script del plugin ${name}`, null, 6000);
    // eslint-disable-next-line no-console
    console.error(`Falta por incluir el link del plugin ${name}`);
  }

  if (!name && !script && !style) {
    M.toast.error('Falta por incluir el script o link de un plugin', null, 6000);
    // eslint-disable-next-line no-console
    console.error('Falta por incluir el script o link de un plugin');
  }
};


export const handlerErrorTileLoadFunction = ({ name }) => {
  if (name) {
    M.toast.error(`La capa ${name} no se puede compartir porque no tiene URL`, null, 6000);
  } else {
    M.toast.error('La capa de tipo MBTiles no tiene tiene URL y no se puede compartir', null, 6000);
  }
};
