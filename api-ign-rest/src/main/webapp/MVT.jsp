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
    <link type="text/css" rel="stylesheet" href="assets/css/apiign-1.2.0.ol.min.css" />
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
        <label for="selectType">Selector de teselas</label>
        <select name="type" id="selectType">
            <option value="estatal">Teselas vectoriales de ámbito Estatal</option>
            <option value="regional" selected="selected">Teselas vectoriales de ámbito Regional</option>
            <option value="osm">Teselas vectoriales de ámbito global</option>
        </select>
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign-1.2.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-1.2.0.js"></script>
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

        let map = M.map({
            container: 'mapjs',
            getfeatureinfo: 'plain',
        });

        const estatal = new M.layer.MVT({
            url: 'https://vts.larioja.org/igo/{z}/{x}/{y}.pbf',
            name: 'vectortile',
            projection: 'EPSG:3857',
        });

        const regional = new M.layer.MVT({
            url: 'https://vts.larioja.org/rioja/{z}/{x}/{y}.pbf',
            name: 'vectortile2',
            projection: 'EPSG:3857',
        });

        const osm = new M.layer.MVT({
            url: 'https://vts.larioja.org/osm/{z}/{x}/{y}.pbf',
            name: 'vectortile3',
            projection: 'EPSG:3857',
        });

        const complementarios = new M.layer.MVT({
            url: 'https://vts.larioja.org/srtm/{z}/{x}/{y}.pbf',
            name: 'vectortile4',
            projection: 'EPSG:3857',
        });

        let type = 'regional';
        añadirTeselas(type, 0);

        const selectType = document.getElementById("selectType");

        selectType.addEventListener('change', cambiarTest);

        function cambiarTest() {
            type = selectType.options[selectType.selectedIndex].value;
            map.destroy()
            añadirTeselas(type, 1);
        }

        function añadirTeselas(type, flag) {
            if (flag === 1) {
                map = M.map({
                    container: 'mapjs',
                    getfeatureinfo: 'plain',
                });
            }
            if (type === 'regional') {
                map.addLayers(regional);
            } else if (type === 'estatal') {
                map.addLayers(estatal);
            } else if (type === 'osm') {
                map.addLayers(osm);
            } else if (type === 'complementarios') {
                map.addLayers(complementarios);
            }
        }
    </script>
</body>

</html>