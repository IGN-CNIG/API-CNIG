# M.plugin.Georefimage


Plugin que permite la descarga de la imagen georeferenciada que se muestra en pantalla.

# Dependencias

- georefimage.ol.min.js
- georefimage.ol.min.css

```html
 <link href="../../plugins/georefimage/georefimage.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/georefimage/georefimage.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left 
  - 'TR':top right (por defecto)
  - 'BL':bottom left 
  - 'BR':bottom right

- **collapsed**. Valor booleano que indica si el plugin aparece colapsado o no.
  - true (por defecto)
  - false

- **collapsible**. Valor booleano que indica si el plugin puede colapsarse o no.
  - true (por defecto)
  - false

- **serverUrl**. URL del servidor Geoprint.

- **printTemplateUrl**. URL con las plantillas.

- **printStatusUrl**. URL que indica el estado del servidor Geoprint.


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
  serverUrl: 'https://componentes.cnig.es', 
  printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/CNIG', 
  printStatusUrl: 'https://componentes.cnig.es/geoprint/print/CNIG/status',

}));
