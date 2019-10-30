# M.plugin.GeometryDraw

Plugin que permite el dibujo y edición de geometrías sobre un mapa, así como su descarga.


# Dependencias

- geometrydraw.ol.min.js
- geometrydraw.ol.min.css


```html
 <link href="../../plugins/geometrydraw/geometrydraw.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/geometrydraw/geometrydraw.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **collapsed**. Indica si el plugin viene cerrado por defecto (true/false).
- **collapsible**. Indica si el plugin se puede cerrar (true/false).
- **position**. Indica la posición donde se mostrará el plugin
  - 'TL':top left (default)
  - 'TR':top right 
  - 'BL':bottom left 
  - 'BR':bottom right

# Parámetros API REST
```javascript
URL_API?geometrydraw=position*collapsed*collapsible
````
Ejemplo:
```javascript
http://cnig-api-core.desarrollo.guadaltel.es/api-core/?geometrydraw=BL*true*true
```


### Ejemplos de uso

```javascript
const map = M.map({
  container: 'mapjs',
});

const mp = new GeometryDraw();

map.addPlugin(mp);
```

```javascript
const map = M.map({
  container: 'mapjs',
});

const mp = new GeometryDraw({
  collapsed: true,
  collapsible: true,
  position: 'TL',
});

map.addPlugin(mp);
```
