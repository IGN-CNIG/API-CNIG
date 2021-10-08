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
    <link href="plugins/popup/popup.ol.min.css" rel="stylesheet" />
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
            <option value="TR" selected="selected">Arriba Derecha (TR)</option>
            <option value="BR">Abajo Derecha (BR)</option>
            <option value="BL">Abajo Izquierda (BL)</option>
        </select>
        <label for="selectCollapsed">Selector de collapsed</label>
        <select name="collapsed" id="selectCollapsed">
            <option value=''></option>
            <option value="true" selected="selected">true</option>
            <option value="false">false</option>
        </select>
        <label for="inputUrl_es">Parámetro url_es</label>
        <input type="text" id="inputUrl_es" list="urlEsSug" />
        <datalist id="urlEsSug">
            <option value="https://raw.githubusercontent.com/irevios/sig/master/iberpixhelp_es.html"></option>
            <option value="https://raw.githubusercontent.com/irevios/sig/master/fototecahelp_es.html"></option>
        </datalist>
        <label for="inputUrl_en">Parámetro url_en</label>
        <input type="text" id="inputUrl_en" list="urlEnSug" />
        <datalist id="urlEnSug">
            <option value="https://raw.githubusercontent.com/irevios/sig/master/iberpixhelp_en.html"></option>
            <option value="https://raw.githubusercontent.com/irevios/sig/master/fototecahelp_en.html"></option>
        </datalist>
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration.js"></script>
    <script type="text/javascript" src="plugins/popup/popup.ol.min.js"></script>
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


        let mp, posicion, url_es, url_en, collapsed;
        crearPlugin({});

        const selectPosicion = document.getElementById("selectPosicion");
        const inputUrl_es = document.getElementById("inputUrl_es");
        const inputUrl_en = document.getElementById("inputUrl_en");
        const selectCollapsed = document.getElementById("selectCollapsed");

        selectPosicion.addEventListener('change', cambiarTest);
        inputUrl_es.addEventListener('change', cambiarTest);
        inputUrl_en.addEventListener('change', cambiarTest);
        selectCollapsed.addEventListener('change', cambiarTest);

        function cambiarTest() {
            let objeto = {}
            objeto.position = selectPosicion.options[selectPosicion.selectedIndex].value;
            url_es = inputUrl_es.value != "" ? objeto.url_es = inputUrl_es.value : "";
            url_en = inputUrl_en.value != "" ? objeto.url_en = inputUrl_en.value : "";
            collapsed = selectCollapsed.options[selectCollapsed.selectedIndex].value;
            collapsed != '' ? objeto.collapsed = (collapsed === "true") : '';
            map.removePlugins(mp);
            crearPlugin(objeto);
        }

        function crearPlugin(propiedades) {
            mp = new M.plugin.Popup(propiedades);
            map.addPlugin(mp);

        }
        let mp2 = new M.plugin.ShareMap({
            baseUrl: window.location.href.substring(0, window.location.href.indexOf('api-ign')) + "api-ign/",
            position: "TR",
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
