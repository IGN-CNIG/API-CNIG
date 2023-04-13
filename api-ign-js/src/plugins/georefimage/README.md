# M.plugin.Georefimage


Plugin que permite la descarga de la imagen georeferenciada que se muestra en pantalla.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **georefimage.ol.min.js**
- **georefimage.ol.min.css**

```html
 <link href="https://componentes.cnig.es/api-core/plugins/georefimage/georefimage.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/georefimage/georefimage.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.

- **collapsed**: Valor booleano que indica si el plugin aparece colapsado o no.
  - true (por defecto)
  - false

- **collapsible**: Valor booleano que indica si el plugin puede colapsarse o no.
  - true (por defecto)
  - false

- **serverUrl**: URL del servidor Geoprint.

- **printTemplateUrl**: URL con las plantillas.

- **printStatusUrl**: URL que indica el estado del servidor Geoprint.


# Ejemplos de uso

## Configuración por defecto sin parámetros:
```javascript
mapajs = M.map({
  container: "map"
});

mapajs.addPlugin(new M.plugin.Georefimage());
```
## Configuración con parámetros:
```javascript
mapajs = M.map({
  container: "map"
});

mapajs.addPlugin(new M.plugin.Georefimage({
  position: 'TR',
  collapsed: false,
  collapsible: false,
  serverUrl: 'https://geoprint.desarrollo.guadaltel.es',
  printTemplateUrl: 'https://geoprint.desarrollo.guadaltel.es/print/mapexport',
  printStatusUrl: 'https://geoprint.desarrollo.guadaltel.es/print/status',

}));
