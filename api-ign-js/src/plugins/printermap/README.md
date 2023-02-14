# M.plugin.PrinterMap


Plugin de impresión a través del servicio Geoprint. Las capacidades del mismo definen las opciones de impresión disponibles: dpi, formatos y plantillas.

# Dependencias

- printermap.ol.min.js
- printermap.ol.min.css

```html
 <link href="../../plugins/printermap/printermap.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/printermap/printermap.ol.min.js"></script>
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
- **credits**. Texto de créditos para la plantilla.
- **georefActive**. Activar o desactivar la descarga de imágenes georreferenciadas.
- **fototeca**. Activar o desactivar fototeca descripción fija.
- **logo**. URL logo.
- **headerLegend**. Url de la imagen de la leyenda del encabezado.
- **filterTemplates**. Plantillas, por ejemplo "A3 Horizontal".

# Ejemplos de uso

## Configuración por defecto sin parámetros:
```javascript
mapajs = M.map({
  container: "map"
});

mapajs.addPlugin(new M.plugin.PrinterMap());
```
## Configuración con parámetros:
```javascript
mapajs = M.map({
  container: "map"
});

mapajs.addPlugin(new M.plugin.PrinterMap({
  position: 'TR',
  collapsed: false,
  collapsible: false,
  serverUrl: 'https://componentes.cnig.es', 
  printTemplateUrl: 'https://componentes.cnig.es/geoprint/print/CNIG', 
  printStatusUrl: 'https://componentes.cnig.es/geoprint/print/CNIG/status',

}));
