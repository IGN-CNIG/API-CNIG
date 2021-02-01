FROM tomcat:7.0.104-jdk8
MAINTAINER Emilio Martinez <emiliomartinez@guadaltel.com>

# Add certificate
ADD mapama.cer /tmp/mapama.cer
RUN echo yes | keytool -importcert -file /tmp/mapama.cer -keystore /usr/local/openjdk-8/jre/lib/security/cacerts -storepass changeit -alias "mapama"

ADD api-core.war $CATALINA_HOME/webapps/api-core.war

EXPOSE 8080
