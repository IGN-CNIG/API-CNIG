# M.plugin.Mirrorpanel

Plugin que permite comparar varias capas dividiendo la pantalla en varias partes. Los mapas tienen sus vistas sincronizadas, y podemos ver la representación de una misma zona por distintas capas.

![Imagen -  Cortina Vertical](/src/facade/assets/img/capture.jpg)


# Dependencias

- mirrorpanel.ol.min.js
- mirrorpanel.ol.min.css


```html
 <link href="../../plugins/mirrorpanel/mirrorpanel.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/mirrorpanel/mirrorpanel.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **position**. Indica la posición donde se mostrará el plugin.
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right

- **collapsible**. Si es *true*, el botón aparece, y puede desplegarse y contraerse. Si es *false*, el botón no aparece. Por defecto tiene el valor *true*.

- **collapsed**. Si es *true*, el panel aparece cerrado. Si es *false*, el panel aparece abierto. Por defecto tiene el valor *true*.

- **modeViz**. Define el tipo de comparación con la que arranca. Rango 0-7.
  - 0: mapa simple.
  - 1: dos mapas en vertical.
  - 2: dos mapas en horizontal.
  - 3: tres mapas en vertical.
  - 4: cuatro mapas en vertical.
  - 5: mosaico con cuatro mapas.
  - 6: cuatro mapas en horizontal.
  - 7: tres mapas en proporción 2-1-1.

- **enabledPlugins**. Si es *true*, los mapas espejo importan los plugins **M.plugin.FullTOC** y **M.plugin.BackImgLayer** si los hubiera, y en caso de hacerlos los añade a los mapas espejo. Por defecto tiene el valor *true*.

- **enabledKeyFunctions**. Si es *true*, se pueden usar las combinaciones de teclas Ctrl + Shift + [F1-F8] para cambiar entre los distintos modos de visualización. Con la tecla *Escape* se destruye el plugin. Por defecto tiene el valor *true*.

- **showCursors**. Si es *true*, muestra cursores sincronziados en cda unao de los mapas espejo. Por defecto tiene el valor *true*.

- **mirrorLayers**. Es un array de capas para mostrar en los mapas espejo y pdper compararlas entre sí.

- **defaultBaseLyrs**. Es un array de capas para mostrar como mapa por defecto cuando no se importa del mapa principal un plugin **M.plugin.BackImgLayer** o cuando la propiedad *enabledPlugins* es *false*.


# Eventos

# Multi idioma

Actualmente viene preparado para español e inglés. Para definir con qué idioma arranca, hay que ir al fichero test.js y modificar

```javascript
M.language.setLang('es');//Idioma español
M.language.setLang('en');//Idioma inglés
```
Se pueden crear más ficheros de idioma. Basta con copiar la estructura de los ficheros **json** de la carpeta *\src\facade\js\i18n* , renombrar con la abreviatura del nuevo idioma (fr para el fránces), y cambiar los textos, manteniendo las *keywords*.

# Otros métodos

No aplica

# Ejemplos de uso

## Ejemplo báse
Insertar dos capas a través de servicio WMS. La división vertical entre las capas es estática y la marca el punto medio del lienzo.

```javascript

   const map = M.map({
   container: 'mapjs',
   layers: [
      'WMTS*http://www.ign.es/wmts/primera-edicion-mtn?*catastrones*GoogleMapsCompatible*Catastrones de MTN',
      'WMTS*http://www.ign.es/wmts/primera-edicion-mtn?*mtn50-edicion1*GoogleMapsCompatible*MTN50 Primera edición',
      'WMTS*http://www.ign.es/wmts/primera-edicion-mtn?*mtn25-edicion1*GoogleMapsCompatible*MTN25 Primera edición',
      'WMS*SIGPAC*https://www.ign.es/wms/pnoa-historico*SIGPAC',
      'WMS*OLISTAT*https://www.ign.es/wms/pnoa-historico*OLISTAT',
      'WMS*Vuelo Nacional 1981-1986*https://www.ign.es/wms/pnoa-historico*Nacional_1981-1986',
      'WMS*Vuelo Interministerial 1973-1986*https://www.ign.es/wms/pnoa-historico*Interministerial_1973-1986',
      'WMS*Vuelo Americano B 1956-1957*https://www.ign.es/wms/pnoa-historico*AMS_1956-1957',
   ],
   center: {
      x: -667143.31,
      y: 4493011.77,
      draw: true  //Dibuja un punto en el lugar de la coordenada
   },
   controls: ['scale','location'],
   /*projection: "EPSG:25830*m",*/
   projection: "EPSG:3857*m",
   zoom: 15,

   //Ojo, si añado esta capa sin TOC, se ve siempre y no se muestran capas base
   /*layers: ["WMTS*http://www.ign.es/wmts/pnoa-ma?*OI.OrthoimageCoverage*EPSG:25830*PNOA"],*/
   });

   const capasPNOA = [
      'WMS*PNOA 2004*https://www.ign.es/wms/pnoa-historico*PNOA2004',
      'WMS*PNOA 2005*https://www.ign.es/wms/pnoa-historico*PNOA2005',
      'WMS*PNOA 2006*https://www.ign.es/wms/pnoa-historico*PNOA2006',
      'WMS*PNOA 2007*https://www.ign.es/wms/pnoa-historico*PNOA2007',
      'WMS*PNOA 2008*https://www.ign.es/wms/pnoa-historico*PNOA2008',
      'WMS*PNOA 2009*https://www.ign.es/wms/pnoa-historico*PNOA2009',
      'WMS*PNOA 2010*https://www.ign.es/wms/pnoa-historico*PNOA2010',
      'WMS*PNOA 2011*https://www.ign.es/wms/pnoa-historico*PNOA2011',
      'WMS*PNOA 2012*https://www.ign.es/wms/pnoa-historico*PNOA2012',
      'WMS*PNOA 2013*https://www.ign.es/wms/pnoa-historico*PNOA2013',
      'WMS*PNOA 2014*https://www.ign.es/wms/pnoa-historico*PNOA2014',
      'WMS*PNOA 2015*https://www.ign.es/wms/pnoa-historico*PNOA2015',
      'WMS*PNOA 2016*https://www.ign.es/wms/pnoa-historico*PNOA2016',
      'WMS*PNOA 2017*https://www.ign.es/wms/pnoa-historico*PNOA2017',
      'WMS*PNOA 2018*https://www.ign.es/wms/pnoa-historico*PNOA2018',
   ];
    const mpMirrorPanel = new Mirrorpanel({
        position: 'TR',
        collapsible: true,          // El botón para desplegar/replegar el plugin no aparece (false) o sí aparece(true)
        collapsed: false,           // El panel del plugin se muestra desplegado (false) o replegado (true)
        modeViz: 0,
        enabledPlugins: true,       // Si el mapa principal tiene los controles M.plugin.BackImgLayer y M.plugin.FullTOC, se importan en mapas espejo
        mirrorLayers: capasPNOA,    // Array de capas para los mapas espejo
        enabledKeyFunctions: true,  // Están habilitadas los comandos por teclado
        showCursors: true,          // Se muestran los cursores
    });

   map.addPlugin(mpMirrorPanel);
```

## Inclusión de iconos

1. Descargamos el icono en SVG.
2. Si necesitas cambiar la orientación de la imagen la rotamos.
3. Entramos en [https://icomoon.io/app/#/select](https://icomoon.io/app/#/select), importamos el svg, lo seleccionamos de la lista y le das a Generate Font.
4. Entras en [http://fontello.com/](http://fontello.com/) y cargas la fuente que has generado, selecciona el icono
5. Descargar el paquete y copiar los ficheros (transparency.eot, transparency.svg, transparency.ttf, transparency.woff, transparency.woff2) en api-ign-js/src/plugins/transparency/src/facade/assets/css/fonts
6. Copiar el contenido de XXX-embedded.css en el css del plugin, indicando antes de cada regla ".m-plugin-XX" 
7. Cambiar el nombre del icono el panel (XXX.js  [PLUGIN]) y donde se usen los iconos (por ejemplo: document.querySelector('.m-panel.m-plugin-transparency').querySelector('.m-panel-btn.icon-gps4')) y en la plantilla por el actual