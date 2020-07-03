FROM docker.guadaltel.es/base/tomcat:7.0.59
MAINTAINER Emilio Martinez <emiliomartinez@guadaltel.com>

ADD api-core.war $CATALINA_HOME/webapps/api-core.war

ADD _idee_es /tmp/_idee_es
RUN echo yes | keytool -importcert -file /tmp/_idee_es -keystore /usr/lib/jvm/java-1.7.0-openjdk-amd64/jre/lib/security/cacerts -storepass changeit -alias "idee_es"

EXPOSE 8080
