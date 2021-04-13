#! /bin/bash

sed "s/tagVersion/$1/g" rigup-deployment.yml > rigup-config.k8s.yaml