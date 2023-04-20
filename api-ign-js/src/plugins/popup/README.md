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

- **position**:  Ubicación del plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda (por defecto).
  - 'BR': (bottom right) - Abajo a la derecha.
- **helpLink**: Enlace al manual de uso.
- **collapsed**. Indica si el plugin aparece abierto por defecto (true/false).
- **collapsible**. Indica si el plugin puede abrirse y cerrarse (true) o si permanece siempre abierto (false).
- **tootltip**. Tooltip que se muestra sobre el plugin.


# Ejemplo de uso

```javascript
   const map = M.map({
     container: 'map'
   });


const mp = new M.plugin.Popup({
  position: 'TR',
  helpLink: {
    es: 'https://componentes.cnig.es/ayudaIberpix/es.html',
    en: 'https://componentes.cnig.es/ayudaIberpix/en.html',
  }
});

   map.addPlugin(mp);
```
