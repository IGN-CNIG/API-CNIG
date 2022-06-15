<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>GGIS-CLOUD Cambio de contraseña</title>
        <link href='http://fonts.googleapis.com/css?family=Roboto' rel='stylesheet' type='text/css'>
        <style>
            #ggiscloud-email body {
                font-family: 'Roboto', sans-serif;
                font-size: 16px;
            }

            #ggiscloud-email div {
                margin: 0 auto;
                margin-bottom: 2rem;
            }

            #ggiscloud-email .corporation {
                margin-top: 3rem;
            }

            #ggiscloud-email table tbody tr td {
                padding-right: 12px;
            }

            #ggiscloud-email .btn-access {
                color: #ffffff;
                background-color: #0099DD;
                text-decoration: none;
                padding: 10px 20px 10px 20px;
            }

            #ggiscloud-email .app-title {
                border: 0px;
                display: block;
                vertical-align: top;
                width: 166px;
                height: auto;
            }

            #ggiscloud-email .app-logo {
                border: 0px;
                display: block;
                vertical-align: top;
                width: 360px;
                height: auto;
                background-color: #0099DD;
            }

            #ggiscloud-email p span {
                font-weight: bold;
            }
        </style>
    </head>
    <body id="ggiscloud-email">
        <div>
            <div class="corporation" style="width: 400px;">
                <img vspace="0" hspace="0" border="0" alt="Logo" style="border: 0px;display: block;width: 400px;" src="${corporation_image}">
            </div>
            <div style="width: 550px;">
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <img border="0" hspace="0" vspace="0" alt="Application logo" class="app-title" src="${domain}/${context}/static/media/logo-circulo.svg">
                            </td>
                            <td>
                                <div>
                                    <img border="0" hspace="0" vspace="0" alt="Application Title" class="app-logo" src="${domain}/${context}/static/media/logo-titulo-negativo.svg">
                                    <p>El administrador del sistema ${admin} ha realizado un cambio de contraseña a su cuenta <span>(${user})</span>. Su nueva contraseña es: <span>${new_password}</span></p>
                                    <p>Por favor, acceda al sistema con su nueva contraseña y cámbiela lo antes posible.</p><br/>
                                    <a class="btn-access" target="_new" href="${url}">ACCEDER</a>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </body>
</html>
