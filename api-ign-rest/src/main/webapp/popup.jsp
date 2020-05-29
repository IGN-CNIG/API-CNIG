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
    <link type="text/css" rel="stylesheet" href="assets/css/apiign-1.2.0.ol.min.css">
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

        <label for="inputHelpLink">Parámetro url</label>
        <input type="text" id="inputHelpLink" list="urlSug" />
        <datalist id="urlSug">
            <option value="http://fototeca.cnig.es/help_es.pdf"></option>
        </datalist>
        <label for="inputContactEmail">Parámetro contactEmail</label>
        <input type="text" id="inputContactEmail" list="contactEmailSug" />
        <datalist id="contactEmailSug">
            <option value="fototeca@cnig.es"></option>
        </datalist>

        <input type="submit" id="buttonAPI" value="API Rest" />
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign-1.2.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-1.2.0.js"></script>
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


        let mp, posicion, url, contactEmail;
        crearPlugin({
            position: posicion,
            url: url,
            contactEmail: contactEmail
        });

        const selectPosicion = document.getElementById("selectPosicion");
        const inputHelpLink = document.getElementById("inputHelpLink");
        const inputContactEmail = document.getElementById("inputContactEmail");
        const buttonApi = document.getElementById("buttonAPI");

        selectPosicion.addEventListener('change', cambiarTest);
        inputHelpLink.addEventListener('change', cambiarTest);
        inputContactEmail.addEventListener('change', cambiarTest);

        buttonApi.addEventListener('click', function() {
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            url = inputHelpLink.value;
            contactEmail = inputContactEmail.value;
            window.location.href = 'http://mapea-lite.desarrollo.guadaltel.es/api-core/?popup=' + posicion + '*' + url + '*' + contactEmail;
        })

        function cambiarTest() {
            let objeto = {}
            objeto.position = selectPosicion.options[selectPosicion.selectedIndex].value;
            url = inputHelpLink.value != "" ? url.srs = inputHelpLink.value : "";
            contactEmail = inputContactEmail.value != "" ? contactEmail.srs = inputContactEmail.value : "";
            map.removePlugins(mp);
            crearPlugin(objeto);
        }

        function crearPlugin(propiedades) {
            mp = new M.plugin.Popup(propiedades);
            map.addPlugin(mp);

        }
        let mp2 = new M.plugin.ShareMap({
            baseUrl: window.location.href.substring(0, window.location.href.indexOf('api-core')) + "api-core/",
            position: "TR",
        });
        map.addPlugin(mp2);
        const botonEliminar = document.getElementById("botonEliminar");
        botonEliminar.addEventListener("click", function() {
            map.removePlugins(mp);
        });
    </script>
</body>

</html>