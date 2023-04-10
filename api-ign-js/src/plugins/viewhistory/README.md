# M.plugin.ViewHistory

Plugin que permite navegar entre las vistas visitadas del mapa (hacia adelante y atrás).

# Dependencias

- viewhistory.ol.min.js
- viewhistory.ol.min.css


```html
 <link href="../../plugins/viewhistory/viewhistory.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/viewhistory/viewhistory.ol.min.js"></script>
```


# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**: Indica la posición donde se mostrará el plugin.
  - 'TL': (top left) - Arriba a la izquierda (por defecto).
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda.
  - 'BR': (bottom right) - Abajo a la derecha.

# Ejemplos de uso

```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.ViewHistory({
     position: 'TL'
   });

   map.addPlugin(mp);
});
```