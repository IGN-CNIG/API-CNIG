# M.plugin.Georefimage2


Plugin que permite la descarga de la imagen georeferenciada que se muestra en pantalla.

# Dependencias

- georefimage2.ol.min.js
- georefimage2.ol.min.css

```html
 <link href="../../plugins/georefimage2/georefimage2.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/georefimage2/georefimage2.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin.
  - 'TL':top left 
  - 'TR':top right (por defecto)
  - 'BL':bottom left 
  - 'BR':bottom right

- **collapsed**: Indica si el plugin viene colapsado de entrada (true/false). Por defecto: true.

- **collapsible**: Indica si el plugin puede abrirse y cerrarse (true) o si permanece siempre abierto (false). Por defecto: true.

- **serverUrl**. URL del servidor Geoprint.

- **printTemplateUrl**. URL con las plantillas.

- **printStatusUrl**. URL que indica el estado del servidor Geoprint.

- **tooltip**. Valor a usar para mostrar en el tooltip del plugin.


# Ejemplos de uso

## Configuración por defecto sin parámetros:
```javascript
mapajs = M.map({
  container: "map"
});

mapajs.addPlugin(new M.plugin.Georefimage2());
```
## Configuración con parámetros:
```javascript
mapajs = M.map({
  container: "map"
});

mapajs.addPlugin(new M.plugin.Georefimage2({
  position: 'TR',
  collapsed: false,
  collapsible: false,
  serverUrl: 'https://geoprint.desarrollo.guadaltel.es',
  printTemplateUrl: 'https://geoprint.desarrollo.guadaltel.es/print/mapexport',
  printStatusUrl: 'https://geoprint.desarrollo.guadaltel.es/print/status',

}));