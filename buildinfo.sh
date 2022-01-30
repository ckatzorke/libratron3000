#!/bin/sh
echo "{ \"buildnumber\": \"$(date +%F-%T)\" }" > src/buildinfo.json