# M.plugin.Information

Muestra información GetFeatureInfo mediante activación de plugin

# Dependencias

- information.ol.min.js
- information.ol.min.css


```html
 <link href="../../plugins/information/information.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/information/information.ol.min.js"></script>
```


# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:


- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left (default)
  - 'TR':top right
  - 'BL':bottom left
  - 'BR':bottom right
- **tootltip**. Tooltip que se muestra sobre el plugin
- **format**. Formato de respuesta de la consulta GetFeatureInfo.
- **featureCount**. Máximo número de features a los que realizar la consulta.
- **buffer**. Buffer del click para realizar la consulta.
- **opened**. Indica si queremos que la información devuelta esté abierta por defecto si sólo es una capa, abiertas todas si son varias o cerradas (por defecto). Si no se le indica ningún valor tendrá el funcionamiento por defecto, todas cerradas.
  - 'one': abierta la información si sólo es una capa
  - 'all': todas abiertas
  - 'closed': cerradas

### Plugin sin parámetros

```
const mp = new M.plugin.Information();
```
### Plugin con parámetros

```
const mp = new M.plugin.Information({
  position: 'BL',
  tooltip: 'Consultar capas',
  format: 'html',
  featureCount: 5,
  buffer: 5,
  opened: 'one',
});
```
