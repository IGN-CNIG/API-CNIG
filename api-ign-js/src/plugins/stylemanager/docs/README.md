
# M.plugin.StyleManager

Plugin de [API-CNIG](https://github.com/IGN-CNIG/API-CNIG) para la gestión de la simbología de las capas vectoriales del mapa.
 
Los tipos de simbología soportada son: simple (polígono, línea, punto), coropletas, símbolos proporcionales, categorías, estadísticos, cluster y mapas de calor. La capa a modificar se selecciona desde el propio plugin, que mantendrá activos únicamente los tipos de simbología compatibles con la capa según su geometría.  

![Imagen](./images/StyleManager3.PNG)
 
La simbología puede ser Compuesta, y a medida que se van aplicando simbologías concretas, la interfaz desactiva las que no son compatibles.  

![Imagen](./images/StyleManager4.PNG)

En dispositivos móviles, la interfaz se adaptará para ocupar la pantalla completa.

# Dependencias

- stylemanager.ol.js
- stylemanager.min.css

```html
 <link href="../../plugins/stylemanager/stylemanager.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/stylemanager/stylemanager.ol.min.js"></script>
```
# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:

- **collapsed**. Indica si el plugin viene cerrado por defecto (true/false).
- **collapsible**. Indica si el plugin se puede cerrar (true/false).
- **position**. Indica la posición donde se mostrará el plugin.
    - 'TL': top left (default)
    - 'TR': top right
    - 'BL': bottom left
    - 'BR': bottom right
- **layer**. Capa pre seleccionada.<br> Si no tiene o no ha cargado aún sus features, lanzará un error. (Válido sólo para creación del plugin por JS)

# Parámetros API REST
```javascript
URL_API?stylemanager=position*collapsed*collapsible
````

### Ejemplos de uso

```javascript
// Creación por defecto
var mp = new M.plugin.StyleManager({
        collapsed: true,
        collapsible: true,
        position: 'TL'
    });
myMap.addPlugin(mp);
```  

```javascript
// Inicialización con capa
capaVectorial.on(M.evt.LOAD, function() {
    var mp = new M.plugin.StyleManager({
        collapsed: true,
        collapsible: true,
        position: 'TL',
        layer: capaVectorial
    });
    myMap.addPlugin(mp);
});
```  

