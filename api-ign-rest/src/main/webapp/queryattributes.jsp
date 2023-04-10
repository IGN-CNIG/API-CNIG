<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="es.cnig.mapea.plugins.PluginsManager"%>
<%@ page import="es.cnig.mapea.parameter.adapter.ParametersAdapterV3ToV4"%>
<%@ page import="java.util.Map"%>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="mapea" content="yes">
    <title>Visor base</title>
    <link type="text/css" rel="stylesheet" href="assets/css/apiign.ol.min.css" />
    <link href="plugins/queryattributes/queryattributes.ol.min.css" rel="stylesheet" />
    <style type="text/css">
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: auto;
        }
    </style>
    <%
      Map<String, String[]> parameterMap = request.getParameterMap();
      PluginsManager.init (getServletContext());
      Map<String, String[]> adaptedParams = ParametersAdapterV3ToV4.adapt(parameterMap);
      String[] cssfiles = PluginsManager.getCSSFiles(adaptedParams);
      for (int i = 0; i < cssfiles.length; i++) {
         String cssfile = cssfiles[i];
   %>
    <link type="text/css" rel="stylesheet" href="plugins/<%=cssfile%>">
    </link>
    <%
      } %>
</head>

<body>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/queryattributes/queryattributes.ol.min.js"></script>

    <%
      String[] jsfiles = PluginsManager.getJSFiles(adaptedParams);
      for (int i = 0; i < jsfiles.length; i++) {
         String jsfile = jsfiles[i];
   %>
    <script type="text/javascript" src="plugins/<%=jsfile%>"></script>

    <%
      }
   %>
    <script type="text/javascript">
        const urlParams = new URLSearchParams(window.location.search);
        M.language.setLang(urlParams.get('language') || 'es');

        const COLORES_PROVINCIA = {
          2: 'olive',
          5: 'green',
          6: 'blue',
          9: 'navy',
          10: 'springgreeen',
          13: 'lightsalmon',
          16: 'steelblue',
          19: 'orangered',
          28: 'red',
          40: 'plum',
          42: 'lime',
          45: 'gold',
          47: 'emerald',
          50: 'turquoise',
        };

        let map = M.map({
            container: 'mapjs',
            zoom: 10 ,
            maxZoom: 20,
            minZoom: 4,
            center: [-409000, 4930000],
        });

        const vertex = new M.layer.GeoJSON({
          name: 'vertices',
          url: 'https://projects.develmap.com/attributestable/roivertexcenterred.geojson',
          extract: true,
        });

        const mp = new M.plugin.QueryAttributes({
          position: 'TL',
          collapsed: true,
          collapsible: true,
          filters: true,
          configuration: {
            layer: 'vertices',
            pk: 'id',
            initialSort: { name: 'nombre', dir: 'asc' },
            columns: [
              { name: 'id', alias: 'Identificador', visible: false, searchable: false, showpanelinfo: true, align: 'right', type: 'string' },
              { name: 'nombre', alias: 'Nombre Vértice', visible: true, searchable: true, showpanelinfo: true, align: 'left', type: 'string' },
              { name: 'xutmetrs89', alias: 'Coordenada X (UTM ETRS89)', visible: false, searchable: false, showpanelinfo: false, align: 'left', type: 'string' },
              { name: 'yutmetrs89', alias: 'Coordenada Y (UTM ETRS89)', visible: false, searchable: false, showpanelinfo: false, align: 'left', type: 'string' },
              { name: 'lat', alias: 'Latitud', visible: false, searchable: false, showpanelinfo: true, align: 'left', type: 'string' },
              { name: 'lng', alias: 'Longitud', visible: false, searchable: false, showpanelinfo: true, align: 'left', type: 'string' },
              { name: 'horto', alias: 'Altitud Ortométrica', visible: false, searchable: false, showpanelinfo: true, align: 'left', type: 'string' },
              { name: 'calidad', alias: 'Calidad señal', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'formatter', typeparam: '⭐️' },
              { name: 'nivel', alias: 'Vida útil', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'percentage' },
              { name: 'urlficha', alias: 'URL PDF Ficha', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'linkURL', typeparam: '📝 Ficha vértice' },
              { name: 'urlcdd', alias: 'URL Centro Descargas', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'buttonURL', typeparam: '🔗 Acceso CdD' },
              { name: 'hojamtn50', alias: 'Hoja MTN50', visible: false, searchable: false, showpanelinfo: true, align: 'right', type: 'string' },
              { name: 'summary', alias: 'Localización', visible: false, searchable: false, showpanelinfo: true, align: 'left', type: 'string' },
              { name: 'imagemtn50', alias: 'Imagen Hoja MTN50', visible: true, searchable: false, showpanelinfo: true, align: 'left', type: 'image' },
              { name: 'description', alias: 'Descripción completa', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string' },
              { name: 'pertenencia', alias: 'Pertenencia', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string' },
              { name: 'municipio', alias: 'Ayuntamiento', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string' },
              { name: 'codigoine', alias: 'Municipio', visible: false, searchable: true, showpanelinfo: true, align: 'left', type: 'string' },
              { name: 'codprov', alias: 'Provincia', visible: false, searchable: false, showpanelinfo: false, align: 'left', type: 'string' },
              { name: 'codauto', alias: 'Autonomía', visible: false, searchable: false, showpanelinfo: false, align: 'left', type: 'string' },
            ],
          },
        });

        const estiloPoint = new M.style.Point({
          icon: {
            form: M.style.form.CIRCLE,
            radius: 5,
            rotation: 3.14159,
            rotate: false,
            offset: [0,0],
            color: '#3e77f7',
            fill: (feature,map) => {
              return COLORES_PROVINCIA[feature.getAttribute('codprov')] || 'green';
            },
            gradientcolor:  '#3e77f7',
            gradient: false,
            opacity: 1,
            snaptopixel: true,
          },
        });

        vertex.setStyle(estiloPoint);
        map.addLayers(vertex);
        map.addPlugin(mp);

    </script>
</body>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-CTLHMMB5YT"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-CTLHMMB5YT');
</script>

</html>
