# M.plugin.Stereoscopic

Plugin que muestra una vista 3D, incluye vistas por anaglifos y orbitación 3D.

# Dependencias

- stereoscopic.ol.min.js
- stereoscopic.ol.min.css

Es necesario descargar la librería TR3: https://github.com/accima/TR3-pack

```html
 <link href="../../plugins/stereoscopic/stereoscopic.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/stereoscopic/stereoscopic.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- *position*.  Ubicación del plugin sobre el mapa.
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right
- **collapsed**. Indica si el plugin aparece por defecto colapsado o no.
- **orbitControls**. Valor Boolean, activa "true" o desactiva (default) "false" la imagen que permite orbitar alrededor del mapa en 3D.
- **anaglyphActive**. Valor Boolean, activa "true" o desactiva (default) "false" el efecto anaglifo por defecto cuando se carga el mapa.


# Ejemplo de uso

```javascript
const map = M.map({
  container: 'map',
  layers: ['TMS*PNOA-MA*https://tms-pnoa-ma.idee.es/1.0.0/pnoa-ma/{z}/{x}/{-y}.jpeg*true*false*19'],
  center: [-428106.86611520057, 4884472.25393817],
  minZoom: 8,
  zoom: 8
});

const mp = new Stereoscopic({
  position: 'TL',
  collapsible: true,
  collapsed: false,
  orbitControls: false,
  anaglyphActive: true
});


 map.addPlugin(mp);
```
