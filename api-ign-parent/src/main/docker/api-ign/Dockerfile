FROM docker.guadaltel.es/base/tomcat:7.0.59
MAINTAINER Emilio Martinez <emiliomartinez@guadaltel.com>

ADD api-core.war $CATALINA_HOME/webapps/api-core.war

RUN rm /opt/jdk1.7.0_79/jre/lib/security/local_policy.jar
RUN rm /opt/jdk1.7.0_79/jre/lib/security/US_export_policy.jar
ADD local_policy.jar /opt/jdk1.7.0_79/jre/lib/security
ADD US_export_policy.jar /opt/jdk1.7.0_79/jre/lib/security

ADD _idee_es /tmp/_idee_es
RUN echo yes | keytool -importcert -file /tmp/_idee_es -keystore /opt/jdk1.7.0_79/jre/lib/security/cacerts -storepass changeit -alias "idee_es"


EXPOSE 8080
