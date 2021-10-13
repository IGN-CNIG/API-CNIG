# M.plugin.Vectors

Plugin que permite el dibujo y edición de geometrías sobre un mapa, así como su descarga.


# Dependencias

- vectors.ol.min.js
- vectors.ol.min.css


```html
 <link href="../../plugins/vectors/vectors.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/vectors/vectors.ol.min.js"></script>
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
URL_API?vectors=position*collapsed*collapsible
````
Ejemplo:
```javascript
http://cnig-api-cnig.desarrollo.guadaltel.es/api-cnig/?vectors=BL*true*true
```


### Ejemplos de uso

```javascript
const map = M.map({
  container: 'mapjs',
});

const mp = new Vectors();

map.addPlugin(mp);
```

```javascript
const map = M.map({
  container: 'mapjs',
});

const mp = new Vectors({
  collapsed: true,
  collapsible: true,
  position: 'TL',
});

map.addPlugin(mp);
```
