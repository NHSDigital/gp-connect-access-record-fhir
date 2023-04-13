#!/bin/bash
           
domain_name=$(make -s output name=service_domain_zone)
#removing double quotes
domain_name=`sed -e 's/^"//' -e 's/"$//' <<< $domain_name` 
protocol="https://"
#appending https protocoal before domain name
protocol+=$domain_name
echo $protocol
jq --arg value $protocol '.["urn:nhs:names:services:gpconnect:fhir:operation:gpc.getstructuredrecord-1"] |= $value' ../endpoints/$APIGEE_ENVIRONMENT/endpoints.json > justForthisUse.json
cp -f justForthisUse.json ../endpoints/$APIGEE_ENVIRONMENT/endpoints.json 
rm justForthisUse.json

