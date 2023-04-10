# M.plugin.MouseSRS

Muestra las coordenas en el sistema de referencia elegido del puntero del ratón.

# Dependencias

- mousesrs.ol.min.js
- mousesrs.ol.min.css


```html
 <link href="../../plugins/mousesrs/mousesrs.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/mousesrs/mousesrs.ol.min.js"></script>
```


# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **tootltip**. Tooltip que se muestra sobre el plugin (Se muestra al dejar el ratón encima del plugin como información).
- **srs**. Código EPSG del SRS sobre el que se mostrarán las coordenadas del ratón.
- **label**. Nombre del SRS sobre el que se mostrarán las coordenadas del ratón.
- **precision**. Precisión de las coordenadas.
- **geoDecimalDigits**. Cifras decimales para proyecciones geográficas.
- **utmDecimalDigits**. Cifras decimales para proyecciones UTM.

### Plugin sin parámetros

```
const mp = new M.plugin.MouseSRS();
```
### Plugin con parámetros

```
const mp = new M.plugin.MouseSRS({
  position: 'BL',
  tooltip: 'Muestra coordenadas',
  srs: 'EPSG:4326',
  label: 'WGS84',
  precision: 4,
  geoDecimalDigits: 3,
  utmDecimalDigits: 2,
});
```

