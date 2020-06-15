# M.plugin.LyrCompare

Plugin que permite comparar varias capas sobre una cartografía base. La extensión de las capas sobre lienzo vienen definidas por la posición del ratón o por el punto medio del lienzo.

![Imagen -  Cortina Vertical](./img/captura1.png)
![Imagen -  Multicortina](./img/captura2.png)

# Dependencias

- lyrcompare.ol.min.js
- lyrcompare.ol.min.css


```html
 <link href="../../plugins/lyrcompare/lyrcompare.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/lyrcompare/lyrcompare.ol.min.js"></script>
```

# Parámetros

- El constructor se inicializa con un JSON de options con los siguientes atributos:

- **layer**. Parámetro obligatorio. Array que puede contener el/los nombre/s de la/s capa/s (que está/n en el mapa), la/s url en formato mapea para insertar una capa a través de servicios WMS ó WMTS, o la capa como objeto.
  A esta/s capa/s se le aplicará el efecto de transparencia.

- **position**. Indica la posición donde se mostrará el plugin.
  - 'TL':top left
  - 'TR':top right (default)
  - 'BL':bottom left
  - 'BR':bottom right

- **collapsible**. Si es *true*, el botón aparece, y puede desplegarse y contraerse. Si es *false*, el botón no aparece. Por defecto tiene el valor *true*.

- **collapsed**. Si es *true*, el panel aparece cerrado. Si es *false*, el panel aparece abierto. Por defecto tiene el valor *true*.

- **staticDivision**. Permite definir si al arrancar la herramienta dividirá laas coas por la posición del ratón *(valor 0)* o por el punto medio del lienzo de cartografía *(valor 1)*.

- **opacityVal**. Define el valor de la opacidad que se aplicará a las capas que se muestran sobre la cartografía base. Rango 0 a 100.

- **comparisonMode**. Define el tipo de comparación con la que arranca. Rango 0,3.
  - 0: arranca con el modo de comparación apagado.
  - 1: arranca con el modo de comparación cortina vertical.
  - 2: arranca con el modo de comparación de cortina horizontal.
  - 3: arranca con el modo de comparación múltiple de cuatro capas.

- **defaultLyrA**. Define la capa uno que se carga por defecto. Valores de 1 al número de capas disponibles.

- **defaultLyrB**. Define la capa uno que se carga por defecto. Valores de 2 al número de capas disponibles.

- **defaultLyrC**. Define la capa uno que se carga por defecto. Valores de 3 al número de capas disponibles.

- **defaultLyrD**. Define la capa uno que se carga por defecto. Valores de 4 al número de capas disponibles.

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

## Ejemplo 1
Insertar dos capas a través de servicio WMS. La división vertical entre las capas es estática y la marca el punto medio del lienzo.

```javascript
  const mp = new M.plugin.LyrCompare({
  position: 'TL',
  layers: [
      'WMS*Redes*http://www.ideandalucia.es/wms/mta400v_2008?*Redes_energeticas',
      'WMS*IGN*http://www.ign.es/wms-inspire/ign-base*IGNBaseTodo'],
      'WMS*SIGPAC*https://www.ign.es/wms/pnoa-historico*SIGPAC',
      'WMS*OLISTAT*https://www.ign.es/wms/pnoa-historico*OLISTAT',
      'WMS*Nacional_1981-1986*https://www.ign.es/wms/pnoa-historico*Nacional_1981-1986',
      'WMS*Interministerial_1973-1986*https://www.ign.es/wms/pnoa-historico*Interministerial_1973-1986',
      'WMS*AMS_1956-1957*https://www.ign.es/wms/pnoa-historico*AMS_1956-1957'
  ],
  collapsible: false,
  staticDivision: 1,
  opacityVal:100,
  comparisonMode: 0,
  defaultLyrA: 1, //Número de capa A que arranca por defecto. Valores 1...nº de capas
  defaultLyrB: 2, //Número de capa B que arranca por defecto. Valores 1...nº de capas
  defaultLyrC: 3, //Número de capa C que arranca por defecto. Valores 1...nº de capas
  defaultLyrD: 4, //Número de capa D que arranca por defecto. Valores 1...nº de capas  
});

   map.addPlugin(mp);
```


## Inclusión de iconos

1. Descargamos el icono en SVG.
2. Si necesitas cambiar la orientación de la imagen la rotamos.
3. Entramos en [https://icomoon.io/app/#/select](https://icomoon.io/app/#/select), importamos el svg, lo seleccionamos de la lista y le das a Generate Font.
4. Entras en [http://fontello.com/](http://fontello.com/) y cargas la fuente que has generado, selecciona el icono
5. Descargar el paquete y copiar los ficheros (transparency.eot, transparency.svg, transparency.ttf, transparency.woff, transparency.woff2) en api-ign-js/src/plugins/transparency/src/facade/assets/css/fonts
6. Copiar el contenido de XXX-embedded.css en el css del plugin, indicando antes de cada regla ".m-plugin-XX" 
7. Cambiar el nombre del icono el panel (XXX.js  [PLUGIN]) y donde se usen los iconos (por ejemplo: document.querySelector('.m-panel.m-plugin-transparency').querySelector('.m-panel-btn.icon-gps4')) y en la plantilla por el actual