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
    <link href="plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
    <style type="text/css">
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: hidden;
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
        <label for="selectURL">Selector URL</label>
        <select name="URL" id="selectURL">
            <option value="http://mapea-lite.desarrollo.guadaltel.es/api-core/">mapea-lite</option>
            <option value="https://componentes.ign.es/api-core/">componentes.ign.es</option>
        </select>

        <label for="selectPosicion">Selector de posición del plugin</label>
        <select name="position" id="selectPosicion">
            <option value="TL">Arriba Izquierda (TL)</option>
            <option value="TR">Arriba Derecha (TR)</option>
            <option value="BR">Abajo Derecha (BR)</option>
            <option value="BL">Abajo Izquierda (BL)</option>
        </select>

        <input type="submit" id="buttonAPI" value="API Rest" />

    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign-1.2.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-1.2.0.js"></script>
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
        const map = M.map({
            container: 'mapjs',
            controls: ['scale*true', 'location', 'backgroundlayers'],
            zoom: 3,
        });

        let mp, posicion = 'BR',
            url = 'http://mapea-lite.desarrollo.guadaltel.es/api-core/';
        crearPlugin(url, posicion);

        const selectURL = document.getElementById("selectURL");
        const selectPosicion = document.getElementById("selectPosicion");
        const buttonApi = document.getElementById("buttonAPI");

        selectURL.addEventListener('change', function() {
            url = selectURL.options[selectURL.selectedIndex].value;
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            map.removePlugins(mp);
            crearPlugin(url, posicion);
        })

        selectPosicion.addEventListener('change', function() {
            url = selectURL.options[selectURL.selectedIndex].value;
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            map.removePlugins(mp);
            crearPlugin(url, posicion);
        })

        buttonApi.addEventListener('click', function() {
            url = selectURL.options[selectURL.selectedIndex].value;
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;

            window.location.href = 'http://mapea-lite.desarrollo.guadaltel.es/api-core/?sharemap=' + url + '*' + posicion;
        })

        function crearPlugin(url, posicion) {
            mp = new M.plugin.ShareMap({
                baseUrl: url,
                position: posicion,
            });

            map.addPlugin(mp);
        }

        M.language.setLang('en');
        map.addPlugin(mp);
        window.map = map;
        const kml = new M.layer.KML('KML*Delegaciones*https://www.ign.es/web/resources/delegaciones/delegacionesIGN.kml*false*false*true');
        map.addLayers(kml);
        const layerinicial = new M.layer.WMS({
            url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
            name: 'AU.AdministrativeBoundary',
            legend: 'Limite administrativo',
            tiled: false,
            version: '1.1.1',
        }, {});

        const layerUA = new M.layer.WMS({
            url: 'http://www.ign.es/wms-inspire/unidades-administrativas?',
            name: 'AU.AdministrativeUnit',
            legend: 'Unidad administrativa'
        }, {});

        const ocupacionSuelo = new M.layer.WMTS({
            url: 'http://wmts-mapa-lidar.idee.es/lidar',
            name: 'EL.GridCoverageDSM',
            legend: 'Modelo Digital de Superficies LiDAR',
            matrixSet: 'GoogleMapsCompatible',
        }, {
            visibility: false,
        });

        map.addLayers([ocupacionSuelo, layerinicial, layerUA]);

        const mp6 = new M.plugin.ZoomExtent();
        const mp7 = new M.plugin.MouseSRS({
            projection: 'EPSG:4326',
        });
        const mp8 = new M.plugin.TOC();

        map.addPlugin(mp6);
        map.addPlugin(mp7);
        map.addPlugin(mp8);
        const mp9 = new M.plugin.TOC();
        map.addPlugin(mp9);

        window.map = map;
    </script>
</body>

</html>