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
- **srs**. Código EPSG del SRS sobre el que se mostrarán las coordenadas del ratón.
- **label**. Nombre del SRS sobre el que se mostrarán las coordenadas del ratón.
- **precision**. Precisión de las coordenadas.
- **geoDecimalDigits**. Cifras decimales para proyecciones geográficas.
- **utmDecimalDigits**. Cifras decimales para proyecciones UTM.

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
  label: 'WGS84',
  precision: 4,
  geoDecimalDigits: 3,
  utmDecimalDigits: 2,
});
```

