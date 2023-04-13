# M.plugin.OverviewMap

Muestra una previsualización de la zona donde está centrado el mapa.

# Dependencias

Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:

- **overviewmap.ol.min.js**
- **overviewmap.ol.min.css**


```html
 <link href="../../plugins/overviewmap/overviewmap.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/overviewmap/overviewmap.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con dos objetos de opciones. El primero contiene el atributo 'position' y el segundo los atributos 'collapsed' y 'collapsible', descritos a continuación:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.
- **collapsed**: Indica si el plugin aparece abierto por defecto (true/false).  Por defecto: false.
- **collapsible**: Indica si el plugin puede abrirse y cerrarse (true) o si permanece siempre abierto (false).  Por defecto: false.
- **fixed**: Indice si el mapa del plugin permanece a un zoom fijo (true/false).
- **zoom**: Indice el nivel del zoom al que permanecerá fijo el mapa del plugin.
- **baseLayer**: URL de la capa base si se quiere prefijar una en el plugin overviewmap.


# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.OverviewMap({
      position: 'BR',
      fixed: true,
      zoom: 4,
      //baseLayer: 'WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico?*PNOA2017*true*true', Ejemplo WMS
      baseLayer: 'WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true', //Ejemplo WMTS
    }, {
      collapsed: false,
      collapsible: true,
    });

   map.addPlugin(mp);
```
