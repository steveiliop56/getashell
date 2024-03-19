#!/bin/bash 

docker buildx build -t getashell:ubuntu -f dockerfiles/Dockerfile.ubuntu .
docker buildx build -t getashell:debian -f dockerfiles/Dockerfile.debian .
docker buildx build -t getashell:alpine -f dockerfiles/Dockerfile.alpine .
docker buildx build -t getashell:rockylinux -f dockerfiles/Dockerfile.rockylinux .