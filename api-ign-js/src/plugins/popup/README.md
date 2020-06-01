# M.plugin.Popup

Plugin que muestra información sobre la página y manual de uso.

# Dependencias

- popup.ol.min.js
- popup.ol.min.css

```html
 <link href="../../plugins/popup/popup.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/popup/popup.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- *position*.  Ubicación del plugin sobre el mapa (Default = 'BL')
  - 'BL' = Bottom left
  - 'BR' = Bottom right
- *helpLink*. Enlace al manual de uso.


# Ejemplo de uso

```javascript
   const map = M.map({
     container: 'map'
   });


const mp = new M.plugin.Popup({
  position: 'TR',
  helpLink: 'https://www.ign.es/iberpix2/visor/help/Manual%20de%20Usuario.html?1Introduccion.html',
});

   map.addPlugin(mp);
```
