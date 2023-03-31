#!/bin/bash
           
domain_name=$(make -s output name=service_domain_zone)
#removing double quotes
domain_name=`sed -e 's/^"//' -e 's/"$//' <<< $domain_name` 
protocol="https://"
#appending https protocoal before domain name
protocol+=$domain_name  
echo $1   
echo $protocol  
jq --arg key $1 --arg value $protocol '.[ .[]|length ]  += { "NAME" :$key, "VALUE": $value}' ../endpoints/$APIGEE_ENVIRONMENT/endpoints.json > justForthisUse.json
cp -f justForthisUse.json ../endpoints/$APIGEE_ENVIRONMENT/endpoints.json 
rm justForthisUse.json

