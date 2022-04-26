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
    <link type="text/css" rel="stylesheet" href="assets/css/apiign.ol.min.css">
    <link href="plugins/overviewmap/overviewmap.ol.min.css" rel="stylesheet" />
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
            <option value="BR" selected="selected">Abajo Derecha (BR)</option>
            <option value="BL">Abajo Izquierda (BL)</option>
        </select>
        <label for="selectFixed">Selector Fixed</label>
        <select name="fixedValue" id="selectFixed">
            <option value=true selected="selected">true</option>
            <option value=false>false</option>
        </select>
        <label for="inputBaseLayer">Parámetro baseLayer</label>
        <input type="text" name="baseLayer" id="inputBaseLayer" list="baseLayerSug">
        <datalist id="baseLayerSug">
            <option value="WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa IGN*false*image/jpeg*false*false*true"></option>
        </datalist>

        <label for="selectCollapsed">Selector collapsed</label>
        <select name="collapsedValue" id="selectCollapsed">
            <option value=true>true</option>
            <option value=false selected="selected">false</option>
        </select>
        <label for="selectCollapsible">Selector collapsible</label>
        <select name="collapsibleValue" id="selectCollapsible">
            <option value=true selected="selected">true</option>
            <option value=false>false</option>
        </select>
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/overviewmap/overviewmap.ol.min.js"></script>
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
            zoom: 6,
            maxZoom: 20,
            minZoom: 5,
            center: [-467062.8225, 4783459.6216],
        });
        let mp;
        let posicion, fixed,
            baseLayer = "WMTS*http://www.ign.es/wmts/ign-base?*IGNBaseTodo*GoogleMapsCompatible*Mapa_IGN*false*image/jpeg*false*false*true",
            collapsible, collapsed;
        crearPlugin(posicion, fixed, baseLayer, collapsed, collapsible);

        const selectPosicion = document.getElementById("selectPosicion");
        const selectFixed = document.getElementById("selectFixed");
        const inputBaseLayer = document.getElementById("inputBaseLayer");
        const selectCollapsed = document.getElementById("selectCollapsed");
        const selectCollapsible = document.getElementById("selectCollapsible");

        selectPosicion.addEventListener('change', cambiarTest);
        selectFixed.addEventListener('change', cambiarTest);
        inputBaseLayer.addEventListener('change', cambiarTest);
        selectCollapsed.addEventListener('change', cambiarTest);
        selectCollapsible.addEventListener('change', cambiarTest);
        setTimeout(() => {
          map.setCenter([-479529.76895509224, 4702535.197017747]);
        }, 50);

        function cambiarTest() {
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            fixed = (selectFixed.options[selectFixed.selectedIndex].value == 'true');
            baseLayer = inputBaseLayer.value;
            collapsed = (selectCollapsed.options[selectCollapsed.selectedIndex].value == 'true');
            collapsible = (selectCollapsible.options[selectCollapsible.selectedIndex].value == 'true');
            map.removePlugins(mp);
            console.log(typeof posicion, posicion);
            console.log(typeof fixed, fixed);
            console.log(typeof baseLayer, baseLayer);
            console.log(typeof collapsed, collapsed);
            console.log(typeof collapsible, collapsible);
            crearPlugin(posicion, fixed, baseLayer, collapsed, collapsible);
        }

        function crearPlugin(position, fixed, baseLayer, collapsed, collapsible) {
            mp = new M.plugin.OverviewMap({
                position: position,
                fixed: fixed,
                zoom: 4,
                baseLayer: baseLayer,
                collapsed: collapsed,
                collapsible: collapsible,
            });
            map.addPlugin(mp);
        }

        let mp2 = new M.plugin.ShareMap({
            baseUrl: window.location.href.substring(0, window.location.href.indexOf('api-core')) + "api-core/",
            position: "BR",
        });
        map.addPlugin(mp2);
        const botonEliminar = document.getElementById("botonEliminar");
        botonEliminar.addEventListener("click", function() {
            map.removePlugins(mp);
        });
    </script>
</body>

<!-- Global site tag (gtag.js) - Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=UA-163660977-1"></script>
<script>
window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'UA-163660977-1');
</script>

</html>
