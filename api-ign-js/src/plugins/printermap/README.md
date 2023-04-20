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

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha (por defecto).
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.

- **collapsed**: Valor booleano que indica si el plugin aparece colapsado o no.
  - true (por defecto).
  - false.

- **collapsible**: Valor booleano que indica si el plugin puede colapsarse o no.
  - true (por defecto).
  - false.

- **serverUrl**: URL del servidor Geoprint.

- **printTemplateUrl**: URL con las plantillas a utilizar.

- **printStatusUrl**: URL para consultar el estado de la impresión.

- **credits**: URL que indica el estado del servidor Geoprint.

- **georefActive**: Valor booleano que indica si abrir plugin con opciones de descarga de imagen georreferenciada o no.
- true (por defecto).
- false.

- **fototeca**: Valor booleano que indica si añadir por defecto un texto a la descripción específico de fototeca sin posibilidad de edición.
- true.
- false (por defecto).

- **logo**: URL de una imagen para añadir como logo en la esquina superior derecha.

- **headerLegend**: URL de una imagen para añadir como leyenda en la parte central de la cabecera.

- **filterTemplates**: Listado de nombres de plantillas que queremos tener disponibles, si no se manda el parámetro aparecerán todas por defecto.


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
