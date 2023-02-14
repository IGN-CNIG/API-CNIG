# M.plugin.Attributions

Plugin que permite mostrar información de atribuciones sobre las capas que se visualizan en el mapa.

# Archivos de atribuciones cnig

Un primer mecanismo soportado es el uso de archivo de atribuciones definidos en formato kml o geojson según formato predefinido.

- https://componentes.cnig.es/NucleoVisualizador/vectorial_examples/atribucionPNOA.kml
- https://componentes.cnig.es/NucleoVisualizador/vectorial_examples/atribucion.kml

# Dependencias

- attributions.ol.min.js
- attributions.ol.min.css

```html
 <link href="../../plugins/attributions/attributions.ol.min.css" rel="stylesheet" />
 <script type="text/javascript" src="../../plugins/attributions/attributions.ol.min.js"></script>
```

# Parámetros

El constructor se inicializa con un JSON de options con los siguientes atributos:


- *mode*. Modo de uso attributions (Default = 1)
  - *1*. Atribuciones mediante archivo de atribuciones ==DISPONIBLE==
  - *2*. Atribuciones mediante consulta de parámetros de Capabilities de los servicios cargados en el mapa
- *scale*. Escala a partir de la cual se activa la asignación de atribuciones  (Default = 10000)
- *tooltip*. Valor a usar para mostrar en el tooltip del plugin (Por defecto = Reconocimientos)

- Parámetros específicos en modo 1 (Archivo de atribuciones)
  - *url*. Url del archivo de atribuciones a utilizar. (Default = 'https://componentes.ign.es/NucleoVisualizador/vectorial_examples/atribucionPNOA.kml')
  - *type*. Tipo de archivo que se pasa en la url indicada ('kml','geojson') (Default = 'kml')
  - *layerName*. Nombre asociado a la capa de atribuciones (Default = 'attributions')
  - *layer*. Tipo de layer que se remite como archivo de atribuciones {M.layer.GeoJSON | M.layer.KML}
  - *attributionParam*. Nombre del campo de atribución en el archivo. (Default = atribucion)
  - *urlParam*. Nombre del campo de url en el archivo. (Default = url)
- *minWidth*. Mínimo ancho de visualización del plugin (Default = '100px')
- *maxWidth*. Máximo ancho de visualización del plugin (Default = '200px')
- *position*. Ubicación del plugin sobre el mapa (Default = 'BL')
  - 'TL' = Top left
  - 'TR' = Top right
  - 'BL' = Bottom left
  - 'BR' = Bottom right
  
- *urlAttribute*. Nombre de la URL (texto adicional). Por defecto, "Gobierno de España". 

# Configuraciones globales
- *M.config.attributions.defaultAttribution*. Valor por defecto a mostrar en la atribución del mapa.
- *M.config.attributions.defaultUrl*. Valor por defecto a usar como url asociada a la atribución por defecto.
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

