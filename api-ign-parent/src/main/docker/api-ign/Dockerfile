FROM tomcat:7.0.104-jdk8
MAINTAINER Jesús Díaz <jesusdiaz@guadaltel.com>

# Add certificate
ADD mapama.cer /tmp/mapama.cer
ADD idee.cer /tmp/idee.cer
ADD catastro.cer /tmp/catastro.cer
ADD fototeca.cer /tmp/fototeca.cer
RUN echo yes | keytool -importcert -file /tmp/mapama.cer -keystore /usr/local/openjdk-8/jre/lib/security/cacerts -storepass changeit -alias "mapama"
RUN echo yes | keytool -importcert -file /tmp/idee.cer -keystore /usr/local/openjdk-8/jre/lib/security/cacerts -storepass changeit -alias "idee"
RUN echo yes | keytool -importcert -file /tmp/catastro.cer -keystore /usr/local/openjdk-8/jre/lib/security/cacerts -storepass changeit -alias "catastro"
RUN echo yes | keytool -importcert -file /tmp/fototeca.cer -keystore /usr/local/openjdk-8/jre/lib/security/cacerts -storepass changeit -alias "fototeca"

ADD api-core.war $CATALINA_HOME/webapps/api-core.war
RUN rm -rf $CATALINA_HOME/conf/server.xml
ADD server.xml $CATALINA_HOME/conf/server.xml

EXPOSE 8080
