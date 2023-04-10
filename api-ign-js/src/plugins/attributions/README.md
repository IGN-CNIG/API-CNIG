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
- **M.config.attributions.defaultUrl**: Valor por defecto a usar como url asociada a la atribución por defecto.
# Parámetros
El constructor se inicializa con un JSON con los siguientes atributos:
- **mode**: Modo de uso del plugin Attributions (1 ó 2).
    1. Atribuciones mediante archivo de atribuciones (modo por defecto). Parámetros específicos: ==DISPONIBLE==
        - **url**: Url del archivo de atribuciones a utilizar. Por defecto: 'https://componentes.ign.es/NucleoVisualizador/vectorial_examples/atribucionPNOA.kml'.
        - **type**: Tipo de archivo que se pasa en la url indicada (ejemplos: 'kml','geojson'). Por defecto: 'kml'.
        - **layerName**: Nombre asociado a la capa de atribuciones (nombre de la capa). Se usa para la construcción de la capa. Por defecto: 'attributions'.
        - **layer**: Tipo de capa que se remite como archivo de atribuciones {M.layer.GeoJSON | M.layer.KML}. Se usa para la construcción de la capa.
        - **attributionParam**: Nombre del campo de atribución en el archivo. Por defecto: 'atribucion'.
        - **urlParam**: Nombre del campo de url en el archivo. Por defecto: 'url'.
        - **minWidth**: Mínimo ancho de visualización del plugin. Por defecto: '100px'.
        - **maxWidth**: Máximo ancho de visualización del plugin. Por defecto: '200px'.
        - **position**: Posición del plugin sobre el mapa.
            - 'TL': (top left) - Arriba a la izquierda.
            - 'TR': (top right) - Arriba a la derecha.
            - 'BL': (bottom left) - Abajo a la izquierda (posición por defecto).
            - 'BR': (bottom right) - Abajo a la derecha.
    2. Atribuciones mediante consulta de parámetros de Capabilities de los servicios cargados en el mapa. ==NO DISPONIBLE==
- **scale**: Escala a partir de la cual se activa la asignación de atribuciones. Por defecto 10000.
- **tooltip**: Valor a usar para mostrar en el tooltip del plugin (se muestra al dejar el ratón encima del plugin como información). Por defecto: 'Reconocimientos'. 
- **minWidth**: Mínimo ancho de visualización del plugin. Por defecto '100px'.
- **maxWidth**: Máximo ancho de visualización del plugin. Por defecto '200px'.
- **position**: Posición del plugin sobre el mapa.
  - 'TL': (top left) - Arriba a la izquierda.
  - 'TR': (top right) - Arriba a la derecha.
  - 'BL': (bottom left) - Abajo a la izquierda (posición por defecto).
  - 'BR': (bottom right) - Abajo a la derecha.
- **urlAttribute**: Texto adicional que se añade a la atribución. Por defecto: "Gobierno de España".
# Archivos de atribuciones CNIG
Ejemplos de archivo de atribuciones según formato predefinido (kml o geojson):
- https://componentes.cnig.es/NucleoVisualizador/vectorial_examples/atribucionPNOA.kml
- https://componentes.cnig.es/NucleoVisualizador/vectorial_examples/atribucion.kml
- https://www.ign.es/resources/viewer/data/20200206_atribucionPNOA-3857.geojson
# Ejemplo de uso
```javascript
  M.config.attributions.defaultAttribution = 'Instituto Geográfico Nacional';
  M.config.attributions.defaultUrl = 'https://www.ign.es/' 
   const map = M.map({
     container: 'map'
   });
  
   const mp = new M.plugin.Attributions({ 
      mode: 1,
      scale: 10000,
      url: 'http://www.ign.es/resources/viewer/data/20200206_atribucionPNOA-3857.geojson',
      type: 'geojson',
      position: 'TL',
    });
   map.addPlugin(mp);
```