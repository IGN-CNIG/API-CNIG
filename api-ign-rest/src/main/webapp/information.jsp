<%@ page language="java" contentType="text/html; charset=UTF-8" pageEncoding="UTF-8"%>
<%@ page import="es.juntadeandalucia.mapea.plugins.PluginsManager"%>
<%@ page import="es.juntadeandalucia.mapea.parameter.adapter.ParametersAdapterV3ToV4"%>
<%@ page import="java.util.Map"%>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="mapea" content="yes">
    <title>Visor base</title>
    <link type="text/css" rel="stylesheet" href="assets/css/apiign-1.2.0.ol.min.css">
    <link href="plugins/information/information.ol.min.css" rel="stylesheet" />
    <link href="plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
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
    <div>
        <label for="selectPosicion">Selector de posición del plugin</label>
        <select name="position" id="selectPosicion">
            <option value="TL">Arriba Izquierda (TL)</option>
            <option value="TR">Arriba Derecha (TR)</option>
            <option value="BR">Abajo Derecha (BR)</option>
            <option value="BL">Abajo Izquierda (BL)</option>
        </select>
        <label for="inputTooltip">Parámetro tooltip</label>
        <input type="text" name="tooltip" id="inputTooltip">
        <label for="inputFormat">Parámetro format</label>
        <input type="text" name="format" id="inputFormat">
        <label for="inputFeatureCount">Parámetro featureCount</label>
        <input type="number" name="featureCount" id="inputFeatureCount">
        <label for="inputBuffer">Parámetro buffer</label>
        <input type="number" name="buffer" id="inputBuffer">
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign-1.2.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-1.2.0.js"></script>
    <script type="text/javascript" src="plugins/information/information.ol.min.js"></script>
    <script type="text/javascript" src="plugins/sharemap/sharemap.ol.min.js"></script>
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

        const map = M.map({
            container: 'mapjs',
            zoom: 5,
            maxZoom: 20,
            minZoom: 4,
            center: [-467062.8225, 4783459.6216],
        });
        let mp;
               
        const layerinicial = new M.layer.WMS({
                url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
                name: 'AU.AdministrativeBoundary',
                legend: 'Limite administrativo',
                tiled: false,
        }, {});

        const layerUA = new M.layer.WMS({
              url: 'https://www.ign.es/wms-inspire/unidades-administrativas?',
              name: 'AU.AdministrativeUnit',
              legend: 'Unidad administrativa',
              tiled: false
             }, {});

        map.addLayers([layerinicial, layerUA]);
        map.addLayers([layerinicial, layerUA]);

        let posicion = "TL", tooltip, formato = 'html', featureCount = 5, buffer = 5;
        crearPlugin(posicion, tooltip, formato, featureCount, buffer);
        
        const selectPosicion = document.getElementById("selectPosicion");
        const inputTooltip = document.getElementById("inputTooltip");
        const inputFormat = document.getElementById("inputFormat");
        const inputFeatureCount = document.getElementById("inputFeatureCount");
        const inputBuffer = document.getElementById("inputBuffer");

        selectPosicion.addEventListener('change', cambiarTest);
        inputTooltip.addEventListener('change', cambiarTest);
        inputFormat.addEventListener('change', cambiarTest);
        inputFeatureCount.addEventListener('change', cambiarTest);
        inputBuffer.addEventListener('change', cambiarTest);

        function cambiarTest(){
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            tooltip = inputTooltip.value;
            formato = inputFormat.value; 
            featureCount = parseInt(inputFeatureCount.value);
            buffer = parseInt(inputBuffer.value);
            map.removePlugins(mp);
			crearPlugin(posicion,tooltip,formato,featureCount,buffer);
        }
        
        function crearPlugin(position,tooltip,format,featureCount,buffer){   
            mp = new M.plugin.Information({
                position: position,
                tooltip:tooltip,
                format:format,
                featureCount:featureCount,
                buffer:buffer,
            });

            map.addPlugin(mp);
        }
        let mp2 = new M.plugin.ShareMap({
            baseUrl: window.location.href.substring(0,window.location.href.indexOf('api-core'))+"api-core/",
            position: "TR",
        });
        map.addPlugin(mp2);
        const botonEliminar = document.getElementById("botonEliminar");
        botonEliminar.addEventListener("click",function(){
            map.removePlugins(mp);
        });
    </script>
</body>

</html>