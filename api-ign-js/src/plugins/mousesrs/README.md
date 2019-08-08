# M.plugin.MouseSRS

# Dependencias

- mousesrs.ol.min.js
- mousesrs.ol.min.css


```html
 <link href="../../plugins/mousesrs/mousesrs.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/mousesrs/mousesrs.ol.min.js"></script>
```


# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- El constructor se inicializa con un JSON de options con los siguientes atributos:


- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left (default)
  - 'TR':top right 
  - 'BL':bottom left 
  - 'BR':bottom right
- **tootltip**. Tooltip que se muestra sobre el plugin
- **srs**. SRS sobre el que se mostrarán las coordenadas del ratón
- **label**.
- **precision**. Precision of coordinates
- **geoDecimalDigits**. Coordinates decimal digits for geographical projections.
- **utmDecimalDigits**. Coordinates decimal digits for UTM projections.

### Plugin sin parámetros

```
const mp = new MouseSRS();
```
### Plugin con parámetros

```
const mp = new MouseSRS({
  position: 'BL',
  tooltip: 'Muestra coordenadas',
  srs: 'EPSG:4326',
  precision: 4,
  geoDecimalDigits: 3,
  utmDecimalDigits: 2,
});
```

