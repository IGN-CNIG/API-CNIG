#!/bin/bash

cd ./mapea-parent;
mvn clean package -P mapea-desarrollo;
cd ../mapea-rest;
mvn docker:build -DdockerImageName=docker.guadaltel.es/cnig/api-core:latest -DdockerHost=http://docker.guadaltel.es:2375/;
sudo docker build -t docker.guadaltel.es/cnig/api-core:latest target/docker; 
sudo docker push docker.guadaltel.es/cnig/api-core:latest;

echo "[SUCCESS] Todo ok!"