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
    <link href="plugins/contactlink/contactlink.ol.min.css" rel="stylesheet" />
    <link href="plugins/sharemap/sharemap.ol.min.css" rel="stylesheet" />
    <style type="text/css">
        html,
        body {
            margin: 0;
            padding: 0;
            height: 100%;
            overflow: auto;
        }

        .tooltip {
            position: relative;
            display: inline-block;
            border-bottom: 1px dotted black;
        }

        .tooltip .tooltiptext {
            visibility: hidden;
            background-color: #e1e1e1;
            color: #4d4d4d;
            text-align: center;
            border-radius: 4px;
            padding: 0.2em;
            position: absolute;
            z-index: 1;
            border: 1px solid #0000001c;
            margin-left: 1em;
        }

        .tooltiptext::after {
            content: "";
            display: block;
            position: absolute;
            background: #e1e1e1;
            width: 1em;
            height: 1em;
            transform: rotate(45deg);
            top: .5em;
            border-left: 1px solid #0000001c;
            border-bottom: 1px solid #0000001c;
            margin-left: -0.8em;
            z-index: -1;
        }

        .tooltip:hover .tooltiptext {
            visibility: visible;
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
        <div class="tooltip">
            <label for="inputDescargascnig">Parámetro descargascnig</label>
            <input type="text" name="descargascnig" id="inputDescargascnig">
            <span class="tooltiptext">http://centrodedescargas.cnig.es/CentroDescargas/index.jsp</span>
        </div>
        <label for="inputPnoa">Parámetro pnoa</label>
        <input type="text" name="pnoa" id="inputPnoa">
        <label for="inputVisualizador3d">Parámetro visualizador3d</label>
        <input type="text" name="visualizador3d" id="inputVisualizador3d">
        <label for="inputFototeca">Parámetro fototeca</label>
        <input type="text" name="fototeca" id="inputFototeca">
        <label for="inputTwitter">Parámetro twitter</label>
        <input type="text" name="twitter" id="inputTwitter">
        <label for="inputInstagram">Parámetro instagram</label>
        <input type="text" name="instagram" id="inputInstagram">
        <label for="inputFacebook">Parámetro facebook</label>
        <input type="text" name="facebook" id="inputFacebook">
        <label for="inputPinterest">Parámetro pinterest</label>
        <input type="text" name="pinterest" id="inputPinterest">
        <label for="inputYoutube">Parámetro youtube</label>
        <input type="text" name="youtube" id="inputYoutube">
        <label for="inputMail">Parámetro mail</label>
        <input type="text" name="mail" id="inputMail">
        <input type="submit" id="buttonAPI" value="API Rest" />
        <input type="button" value="Eliminar Plugin" name="eliminar" id="botonEliminar">
    </div>
    <div id="mapjs" class="m-container"></div>
    <script type="text/javascript" src="vendor/browser-polyfill.js"></script>
    <script type="text/javascript" src="js/apiign-1.2.0.ol.min.js"></script>
    <script type="text/javascript" src="js/configuration-1.2.0.js"></script>
    <script type="text/javascript" src="plugins/contactlink/contactlink.ol.min.js"></script>
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


        let mp, posicion;
        let descargascnig, pnoa, visualizador3d, fototeca, twitter, instagram, facebook, pinterest, youtube, mail;
        crearPlugin(posicion, descargascnig, pnoa, visualizador3d, fototeca, twitter, instagram, facebook, pinterest, youtube, mail);

        const selectPosicion = document.getElementById("selectPosicion");
        const inputDescargascnig = document.getElementById("inputDescargascnig");
        const inputPnoa = document.getElementById("inputPnoa");
        const inputVisualizador3d = document.getElementById("inputVisualizador3d");
        const inputFototeca = document.getElementById("inputFototeca");
        const inputTwitter = document.getElementById("inputTwitter");
        const inputInstagram = document.getElementById("inputInstagram");
        const inputFacebook = document.getElementById("inputFacebook");
        const inputPinterest = document.getElementById("inputPinterest");
        const inputYoutube = document.getElementById("inputYoutube");
        const inputMail = document.getElementById("inputMail");
        const buttonApi = document.getElementById("buttonAPI");

        selectPosicion.addEventListener('change', cambiarTest);
        inputDescargascnig.addEventListener('change', cambiarTest);
        inputPnoa.addEventListener('change', cambiarTest);
        inputVisualizador3d.addEventListener('change', cambiarTest);
        inputFototeca.addEventListener('change', cambiarTest);
        inputTwitter.addEventListener('change', cambiarTest);
        inputInstagram.addEventListener('change', cambiarTest);
        inputFacebook.addEventListener('change', cambiarTest);
        inputPinterest.addEventListener('change', cambiarTest);
        inputYoutube.addEventListener('change', cambiarTest);
        inputMail.addEventListener('change', cambiarTest);

        function cambiarTest() {
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            descargascnig = inputDescargascnig.value;
            pnoa = inputPnoa.value;
            visualizador3d = inputVisualizador3d.value;
            fototeca = inputFototeca.value;
            twitter = inputTwitter.value;
            instagram = inputInstagram.value;
            facebook = inputFacebook.value;
            pinterest = inputPinterest.value;
            youtube = inputYoutube.value;
            mail = inputMail.value;
            map.removePlugins(mp);
            crearPlugin(posicion, descargascnig, pnoa, visualizador3d, fototeca, twitter, instagram, facebook, pinterest, youtube, mail);
        }

        buttonApi.addEventListener('click', function() {
            posicion = selectPosicion.options[selectPosicion.selectedIndex].value;
            descargascnig = inputDescargascnig.value;
            pnoa = inputPnoa.value;
            visualizador3d = inputVisualizador3d.value;
            fototeca = inputFototeca.value;
            twitter = inputTwitter.value;
            instagram = inputInstagram.value;
            facebook = inputFacebook.value;
            pinterest = inputPinterest.value;
            youtube = inputYoutube.value;
            mail = inputMail.value;

            window.location.href = 'http://mapea-lite.desarrollo.guadaltel.es/api-core/?contactlink=' + posicion + '*' + descargascnig + '*' + pnoa + '*' + visualizador3d + '*' + fototeca +
                '*' + twitter + '*' + instagram + '*' + pinterest + '*' + youtube + '*' + mail;
        });

        function crearPlugin(posicion, descargascnig, pnoa, visualizador3d, fototeca, twitter, instagram, facebook, pinterest, youtube, mail) {
            mp = new M.plugin.ContactLink({
                position: posicion,
                descargascnig: descargascnig,
                pnoa: pnoa,
                visualizador3d: visualizador3d,
                fototeca: fototeca,
                twitter: twitter,
                instagram: instagram,
                facebook: facebook,
                pinterest: pinterest,
                youtube: youtube,
                mail: mail,
            });

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