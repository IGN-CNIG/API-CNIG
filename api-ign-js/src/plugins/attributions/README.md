# M.plugin.Attributions
Plugin que permite mostrar la información de las atribuciones sobre las capas que se visualizan en el mapa.
# Dependencias
Para que el plugin funcione correctamente es necesario importar las siguientes dependencias en el documento html:
- **attributions.ol.min.js**
- **attributions.ol.min.css**
```html
 <link href="https://componentes.cnig.es/api-core/plugins/attributions/attributions.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="https://componentes.cnig.es/api-core/plugins/attributions/attributions.ol.min.js"></script>
``` 
# Configuraciones globales
- **M.config.attributions.defaultAttribution**: Valor por defecto a mostrar en la atribución del mapa.
- **M.config.attributions.defaultURL**: Valor por defecto a usar como url asociada a la atribución por defecto.
# Parámetros
El constructor se inicializa con un JSON con los siguientes atributos:
 * **mode**: Modo de uso del plugin Attributions (1 ó 2).
     a. Atribuciones mediante archivo de atribuciones (modo por defecto). Parámetros específicos: ==DISPONIBLE==
         + **url**: Url del archivo de atribuciones a utilizar. Por defecto: 'https://componentes.ign.es/NucleoVisualizador/vectorial_examples/atribucionPNOA.kml'.
         + **type**: En el caso de no pasar nada por el parámetro layer o pasar una capa que no sea de tipo vectorial, generará la capa de atribuciones con el tipo indicado en este parámetro. Los valores permitidos son ('kml' y 'geojson'). Por defecto: 'kml'.
         + **layerName**: Nombre asociado a la capa de atribuciones (nombre de la capa). Se usa para la construcción de la capa. Por defecto: 'attributions'.
         + **layer**: Capa definida por el usuario para determinar las atribuciones {M.layer.GeoJSON | M.layer.KML}. No requiere los parámetros anteriores (type, url y layerName)
         + **attributionParam**: Nombre del campo de atribución en el archivo. Por defecto: 'atribucion'.
         + **urlParam**: Nombre del campo de url en el archivo. Por defecto: 'url'.
         + **minWidth**: Mínimo ancho de visualización del plugin. Por defecto: '100px'.
         + **maxWidth**: Máximo ancho de visualización del plugin. Por defecto: '200px'.
         + **position**: Posición del plugin sobre el mapa.
            - 'TL': (top left) - Arriba a la izquierda.
            - 'TR': (top right) - Arriba a la derecha.
            - 'BL': (bottom left) - Abajo a la izquierda (posición por defecto).
            - 'BR': (bottom right) - Abajo a la derecha.
     b. Atribuciones mediante consulta de parámetros de Capabilities de los servicios cargados en el mapa. ==NO DISPONIBLE==
* **scale**: Escala a partir de la cual se activa la asignación de atribuciones. Por defecto 10000.
* **tooltip**: Valor a usar para mostrar en el tooltip del plugin (se muestra al dejar el ratón encima del plugin como información). Por defecto: 'Reconocimientos'. 
* **minWidth**: Mínimo ancho de visualización del plugin. Por defecto '100px'.
* **maxWidth**: Máximo ancho de visualización del plugin. Por defecto '200px'.
* **position**: Posición del plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda (posición por defecto).
  - 'BR': (bottom right) - Abajo a la derecha.
* **urlAttribute**: Texto adicional que se añade a la atribución. Por defecto: "Gobierno de España".
### Funcionamiento de los parámetros "defaultURL" y "defaultAttribution".
En el caso de la capa base no se contemple en los casos siguientes, se podra definir un nombre de atribución y una URL por defecto usando los siguientes parámetros:
* **defaultURL**: Valor por defecto a usar como url asociada a la atribución definida por el usuario.
* **defaultAttribution**: Valor por defecto que se mostrará en la atribución del mapa definido por el usuario.

  * Si la capa base es "OI.OrthoimageCoverage" y tiene un nivel de zoom menor a 14:
    - Nombre de la atribución: Copernicus Sentinel 2019.
    - URL de la atribución: https://sentinel.esa.int/web/sentinel/home.
  * Si la capa base es "LC.LandCoverSurfaces" y tiene un nivel de zoom menor a 14:
    - Nombre de la atribución: CORINE-Land Cover. Instituto Geográfico Nacional.
    - URL de la atribución: M.config.attributions.defaultURL o defaultURL si este tiene valor.
  * Si la capa base es "IGNBaseTodo":
    - Nombre de la atribución: Sistema Cartográfico Nacional.
    - URL de la atribución: http://www.scne.es/.
  * Si alguno de los casos anterior supera el zoom 14:
    - Nombre de la atribución: Sistema Cartográfico Nacional.
    - URL de la atribución: http://www.scne.es/.
# Archivos de atribuciones CNIG
Ejemplos de archivo de atribuciones según formato predefinido (kml o geojson):
- https://componentes.cnig.es/NucleoVisualizador/vectorial_examples/atribucionPNOA.kml
- https://componentes.cnig.es/NucleoVisualizador/vectorial_examples/atribucion.kml
- https://www.ign.es/resources/viewer/data/20200206_atribucionPNOA-3857.geojson
# Ejemplo de uso
```javascript
   const map = M.map({
     container: 'map'
   });

   const mp = new M.plugin.Attributions({ 
      mode: 1,
      scale: 10000,
      /*Uso de type, para generar una capa de tipo GeoJSON o KML*/
      type: 'geojson', // En este caso la capa será de tipo GeoJSON
      url: 'http://www.ign.es/resources/viewer/data/20200206_atribucionPNOA-3857.geojson', // URL de la capa
      layerName: 'Ejemplo Attributions', // Nombre de la capa
      /*
      + Se puede defenir una capa directamente sin usar los 
        parámetros anteriores (type, url y layerName).

      layer: new M.layer.GeoJSON({
        name: 'Ejemplo Attributions',
          source: {
            url: 'http://www.ign.es/resources/viewer/data/20200206_atribucionPNOA-3857.geojson',
          type: 'geojson',
        },
      }),
      */
      position: 'TL',
    });
   map.addPlugin(mp);
```
