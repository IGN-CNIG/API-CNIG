package es.cnig.mapea.api;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.io.OutputStream;
import java.util.Properties;
import java.util.ResourceBundle;

import javax.activation.DataHandler;
import javax.activation.FileDataSource;
import javax.mail.BodyPart;
import javax.mail.Message;
import javax.mail.MessagingException;
import javax.mail.Session;
import javax.mail.Transport;
import javax.mail.internet.InternetAddress;
import javax.mail.internet.MimeBodyPart;
import javax.mail.internet.MimeMessage;
import javax.mail.internet.MimeMultipart;
import javax.servlet.ServletContext;
import javax.ws.rs.Consumes;
import javax.ws.rs.POST;
import javax.ws.rs.Path;
import javax.ws.rs.Produces;
import javax.ws.rs.QueryParam;
import javax.ws.rs.core.Context;
import javax.ws.rs.core.MediaType;

import org.json.JSONObject;

import com.sun.jersey.core.header.FormDataContentDisposition;
import com.sun.jersey.multipart.FormDataParam;

import es.cnig.mapea.builder.JSBuilder;



/**
 * This class manages the available actions an user can execute
 * 
 * @author Guadaltel S.A.
 */
@Path("/email")
@Produces("application/javascript")
public class EmailWS {

   @Context
   private ServletContext context;
   
   private ResourceBundle configProperties = ResourceBundle.getBundle("configuration");
   
   /**
    * Send email
    * 
    * @param callbackFn the name of the javascript
    * function to execute as callback
    * 
    * @return the javascript code
    */
   @POST
   @Consumes(MediaType.MULTIPART_FORM_DATA)
   public String sendEmail (@QueryParam("callback") String callback, @FormDataParam("subject") String subject,
		   @FormDataParam("mailto") String mailto, @FormDataParam("body") String body,
		   @FormDataParam("file") InputStream fileStream, @FormDataParam("file") FormDataContentDisposition fileDetail) {
      JSONObject msg = new JSONObject();
      String message = "Email enviado correctamente";
      File file = createFile(fileStream, fileDetail);
      boolean enviado = sendEmailSMTP(mailto, subject, body, file);
      if(!enviado){
    	  message = "Ha ocurrido un error y no se ha podido enviar el email, por favor intentelo más tarde";
      }
      if(file != null){
    	  file.delete();
      }
      msg.put("message", message);
      return JSBuilder.wrapCallback(msg, callback);
   }
   
   private File createFile(InputStream fileStream, FormDataContentDisposition fileDetail){
	   File file = null;
	   if(fileStream != null && fileDetail != null){
		   try {
			    String fileName = fileDetail.getFileName();
			    int index = fileName.lastIndexOf(".");
			    String prefix = fileName.substring(0, index);
			    String suffix = fileName.substring(index+1);
			    file = File.createTempFile(prefix, suffix);
				OutputStream out = new FileOutputStream(file);
				int read = 0;
				byte[] bytes = new byte[1024];
				while ((read = fileStream.read(bytes)) != -1) {
					out.write(bytes, 0, read);
				}
				out.flush();
				out.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
	   }
	   return file;
   }

   private boolean sendEmailSMTP(String destinatario, String asunto, String cuerpo, File fichAdjunto){
	   boolean result = true;
	   // Esto es lo que va delante de @gmail.com en tu cuenta de correo. Es el remitente también.
	   String remitente = configProperties.getString("smtp.remitente");
	   String usuario = configProperties.getString("smtp.user");
	   String host = configProperties.getString("smtp.host");
	   String password = configProperties.getString("smtp.password");
	   String port = configProperties.getString("smtp.port");

	   Properties props = new Properties();
	   props.put("mail.smtp.host", host);//El servidor SMTP
	   props.put("mail.smtp.starttls.enable", "true"); //Para conectar de manera segura al servidor SMTP
	   if(usuario != null && !usuario.isEmpty() &&
			password != null && !password.isEmpty()){
		   props.put("mail.smtp.auth", "true");//Usar autenticación mediante usuario y clave
	   }
	   if(port != null && !port.isEmpty()){
		   props.put("mail.smtp.port", port);//El puerto SMTP
	   }

	   Session session = Session.getDefaultInstance(props);
	   MimeMessage message = new MimeMessage(session);
	   Transport transport = null;
	   try {
		   message.setFrom(new InternetAddress(remitente));
		   message.addRecipients(Message.RecipientType.TO, destinatario); //Se podrían añadir varios de la misma manera
		   message.setSubject(asunto);
		   if(fichAdjunto != null){
			   //Adjunto
			   BodyPart adjunto = new MimeBodyPart();
			   adjunto.setDataHandler(new DataHandler(new FileDataSource(fichAdjunto)));
			   adjunto.setFileName(fichAdjunto.getName());
			   //Texto
			   BodyPart texto = new MimeBodyPart();
			   texto.setContent(cuerpo, "text/html; charset=utf-8");
			   MimeMultipart multiparte = new MimeMultipart();
			   multiparte.addBodyPart(adjunto);
			   multiparte.addBodyPart(texto);
			   message.setContent(multiparte);
		   }else{
			   message.setContent(cuerpo, "text/html; charset=utf-8");
		   }
		   transport = session.getTransport("smtp");
		   if(usuario != null && !usuario.isEmpty() &&
					password != null && !password.isEmpty()){
			   transport.connect(host, usuario, password);
		   }else{
			   transport.connect();
		   }
		   transport.sendMessage(message, message.getAllRecipients());
	   }catch (MessagingException me) {
		   me.printStackTrace();
		   result = false;
	   }finally{
		   if(transport != null){
			   try {
				   transport.close();
			   } catch (MessagingException me2) {
				   me2.printStackTrace();
			   }
		   }
	   }
	   return result;
   }
}
