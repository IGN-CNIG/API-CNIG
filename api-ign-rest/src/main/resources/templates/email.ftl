<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title>INCIDENCIA</title>
        <link href='http://fonts.googleapis.com/css?family=Muli' rel='stylesheet' type='text/css'>
        <style>
            body { 
			    font-family: Muli; 
			    font-size: 16px; 
			    font-style: normal; 
			    font-variant: normal; 
			    font-weight: 700; 
			} 
			
			
			h2 { 
			    font-family: Muli; 
			    font-size: 24px; 
			    font-style: normal; 
			    font-variant: normal; 
			    font-weight: 700; 
			    line-height: 26.4px;
			} 
			
			.main-form {
			    display: flex;
			    margin-top: 15px;
			    width: 100%;
			    justify-content: center;
			    align-content: center;
			    flex-direction: column;
			    flex-grow: 2;
			    font-size: 15px;
			    align-items: center;
			}
			
			.form-item {
			    display: flex;
			    flex-direction: column;
			    width: 75%;
			    margin-top: 10px;
			}
			
			.form-item input[type=text] {
			    margin: 5px;
			    padding: 5px;
			    background-color: transparent;
			    cursor: auto;
			    border-radius: 4px;
			    border: 1px solid rgba(0,0,0,.5);
			    -webkit-appearance: none;
			    -moz-appearance: none;
			    appearance: none;
			    color: #6c6c6c;
			    font-size: 13px;
			}
			
			.form-item textarea {
			    margin: 5px;
			    padding: 5px;    
			    display: block;
			    border-radius: 4px;
			    border: 1px solid rgba(0,0,0,.5);
			    color: #6c6c6c;
			    resize: none;
			    min-height: 4em;
			}
        </style>
    </head>
    <body>
        <h2>${subject}</h2>
        <div class="main-form">
		    <div class="form-item">
		        <label for="destinatary">Destinatario de la incidencia</label>
		        <input id="destinatary" type="text" name="destinatary" value="${destinatary}"></input>
		    </div>
		    <div class="form-item">
		        <label for="sendername">Remitente incidencia</label>
		        <input id="sendername" type="text" name="sendername" value="${sendername}"></input>
		    </div>
		    <div class="form-item">
		        <label for="senderemail">Email remitente incidencia</label>
		        <input id="senderemail" type="text" name="senderemail" value="${senderemail}"></input>
		    </div>
		    <div class="form-item">
		        <label for="errDescription">Descripción de la incidencia</label>
		        <textarea id="errDescription" type="text" name="errDescription">${errDescription}</textarea>
		    </div>
		    <div class="form-item">
		        <label for="sendergeometry">Geometría (geoJSON)</label>
		        <textarea id="sendergeometry" type="text" name="sendergeometry">${sendergeometry}</textarea>
		    </div>
		    <div class="form-item">
		        <label for="shareURL">URL de la App</label>
		        <input id="shareURL" type="text" name="shareURL" value="${shareURL}"></input>
		    </div>
		</div>
    </body>
</html>
