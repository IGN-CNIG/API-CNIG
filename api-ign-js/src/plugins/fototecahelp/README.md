# M.plugin.BackImgLayer

Muestra información enlace a ayuda, contacto y condiciones del servicio de fototeca.

# Dependencias

- fototecahelp.ol.min.js
- fototecahelp.ol.min.css

```html
 <link href="../../plugins/fototecahelp/fototecahelp.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/fototecahelp/fototecahelp.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- *position*.  Ubicación del plugin sobre el mapa (Default = 'BL')
  - 'BL' = Bottom left
  - 'BR' = Bottom right
- *helpLink*. Enlace al manual de uso.
- *contactEmail*. Dirección de email de contacto.


# Ejemplo de uso

```javascript
   const map = M.map({
     container: 'map'
   });


const mp = new M.plugin.FototecaHelp({
  position: 'TR',
  helpLink: 'http://fototeca.cnig.es/help_es.pdf',
  contactEmail: 'fototeca@cnig.es',
});

   map.addPlugin(mp);
```
