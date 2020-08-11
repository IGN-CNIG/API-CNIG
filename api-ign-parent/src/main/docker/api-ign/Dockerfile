FROM tomcat:7.0.104-jdk8
MAINTAINER Emilio Martinez <emiliomartinez@guadaltel.com>

ADD _.desarrollo.guadaltel.es /tmp/_.desarrollo.guadaltel.es
RUN echo yes | keytool -importcert -file /tmp/_.desarrollo.guadaltel.es -keystore /usr/local/openjdk-8/jre/lib/security/cacerts -storepass changeit -alias "_.desarrollo.guadaltel"

ADD api-core.war $CATALINA_HOME/webapps/api-core.war

EXPOSE 8080
