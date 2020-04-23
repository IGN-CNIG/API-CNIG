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
        <label for="inputDescargascnig">Parámetro descargascnig</label>
        <input type="text" name="descargascnig" id="inputDescargascnig" list="descargascnigSug">
        <datalist id="descargascnigSug"><option value="http://centrodedescargas.cnig.es/CentroDescargas/index.jsp"></option></datalist>
        <label for="inputPnoa">Parámetro pnoa</label>
        <input type="text" name="pnoa" id="inputPnoa" list="pnoaSug">
        <datalist id="pnoaSug"><option value="https://www.ign.es/web/comparador_pnoa/index.html"></option></datalist>
        <label for="inputVisualizador3d">Parámetro visualizador3d</label>
        <input type="text" name="visualizador3d" id="inputVisualizador3d" list="visualizador3dSug">
        <datalist id="visualizador3dSug"><option value="https://www.ign.es/3D-Stereo/"></option></datalist>
        <label for="inputFototeca">Parámetro fototeca</label>
        <input type="text" name="fototeca" id="inputFototeca" list="fototecaSug">
        <datalist id="fototecaSug"><option value="https://fototeca.cnig.es/"></option></datalist>
        <label for="inputTwitter">Parámetro twitter</label>
        <input type="text" name="twitter" id="inputTwitter" list="twitterSug">
        <datalist id="twitterSug"><option value="https://twitter.com/IGNSpain"></option></datalist>
        <label for="inputInstagram">Parámetro instagram</label>
        <input type="text" name="instagram" id="inputInstagram" list="instagramSug">
        <datalist id="instagramSug"><option value="https://www.instagram.com/ignspain/"></option></datalist>
        <label for="inputFacebook">Parámetro facebook</label>
        <input type="text" name="facebook" id="inputFacebook" list="facebookSug">
        <datalist id="facebookSug"><option value="https://www.facebook.com/IGNSpain/"></option></datalist>
        <label for="inputPinterest">Parámetro pinterest</label>
        <input type="text" name="pinterest" id="inputPinterest" list="pinterestSug">
        <datalist id="pinterestSug"><option value="https://www.pinterest.es/IGNSpain/"></option></datalist>
        <label for="inputYoutube">Parámetro youtube</label>
        <input type="text" name="youtube" id="inputYoutube" list="youtubeSug">
        <datalist id="youtubeSug"><option value="https://www.youtube.com/user/IGNSpain"></option></datalist>
        <label for="inputMail">Parámetro mail</label>
        <input type="text" name="mail" id="inputMail" list="mailSug">
        
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
        crearPlugin({
            position:posicion,
            descargascnig:descargascnig,
            pnoa:pnoa,
            visualizador3d:visualizador3d,
            fototeca:fototeca,
            twitter:twitter,
            instagram:instagram,
            facebook:facebook,
            pinterest:pinterest,
            youtube:youtube,
            mail:mail
        });

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
            let objeto = {}
            objeto.position = selectPosicion.options[selectPosicion.selectedIndex].value;
            descargascnig = inputDescargascnig.value != "" ? objeto.descargascnig = inputDescargascnig.value : "";
            pnoa = inputPnoa.value!= "" ? objeto.pnoa = inputPnoa.value : "";
            visualizador3d = inputVisualizador3d.value!= "" ? objeto.visualizador3d = inputVisualizador3d.value : "";
            fototeca = inputFototeca.value!= "" ? objeto.fototeca = inputFototeca.value : "";
            twitter = inputTwitter.value!= "" ? objeto.twitter = inputTwitter.value : "";
            instagram = inputInstagram.value!= "" ? objeto.instagram = inputInstagram.value : "";
            facebook = inputFacebook.value!= "" ? objeto.facebook = inputFacebook.value : "";
            pinterest = inputPinterest.value!= "" ? objeto.pinterest = inputPinterest.value : "";
            youtube = inputYoutube.value!= "" ? objeto.youtube = inputYoutube.value : "";
            mail = inputMail.value!= "" ? objeto.mail = inputMail.value : "";
            map.removePlugins(mp);
            crearPlugin(objeto);
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

            window.location.href = 'http://mapea-lite.desarrollo.guadaltel.es/api-core/?contactlink=' + posicion;
        });

        function crearPlugin(propiedades) {
            mp = new M.plugin.ContactLink(propiedades);
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