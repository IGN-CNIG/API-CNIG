# M.plugin.OverviewMap

Muestra una previsualización de la zona donde está centrado el mapa.

# Dependencias

- overviewmap.ol.min.js
- overviewmap.ol.min.css


```html
 <link href="../../plugins/overviewmap/overviewmap.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/overviewmap/overviewmap.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left
  - 'TR':top right
  - 'BL':bottom left (por defecto)
  - 'BR':bottom right

  
# Ejemplos de uso

```javascript
const mp = new M.plugin.OverviewMap();

map.addPlugin(mp);
```

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.OverviewMap({
        position: 'TL',
      });

   map.addPlugin(mp);
```