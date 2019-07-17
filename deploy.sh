#!/bin/bash

cd ./api-ign-parent;
mvn clean package -P desarrollo;
cd ../api-ign-rest;
mvn docker:build -DdockerImageName=docker.guadaltel.es/cnig/api-core:latest -DdockerHost=http://docker.guadaltel.es:2375/;
sudo docker build -t docker.guadaltel.es/cnig/api-core:latest target/docker; 
sudo docker push docker.guadaltel.es/cnig/api-core:latest;

echo "[SUCCESS] Todo ok!"