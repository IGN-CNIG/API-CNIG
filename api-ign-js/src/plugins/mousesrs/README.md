# M.plugin.MouseSRS

Muestra las coordenas del puntero del ratón en el sistema de referencia elegido.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **mousesrs.ol.min.js**
- **mousesrs.ol.min.css**


```html
 <link href="https://componentes.cnig.es/api-core/plugins/mousesrs/mousesrs.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/mousesrs/mousesrs.ol.min.js"></script>
```


# Parámetros

El constructor se inicializa con un JSON con los siguientes atributos:

- **tootltip**: Descripción emergente que se muestra sobre el plugin (Se muestra al dejar el ratón encima del plugin como información).
- **srs**: Código EPSG del SRS sobre el que se mostrarán las coordenadas del ratón.
- **label**: Nombre del SRS sobre el que se mostrarán las coordenadas del ratón.
- **precision**: Precisión de las coordenadas.
- **geoDecimalDigits**: Cifras decimales para proyecciones geográficas.
- **utmDecimalDigits**: Cifras decimales para proyecciones UTM.

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

