#!/bin/bash

# Check the KVM and entry exist
KEYNAME=$1
URL="https://api.enterprise.apigee.com/v1/organizations/nhsd-nonprod/environments/internal-dev/keyvaluemaps/gp-connect-access-record-endpoints-PR/entries/$KEYNAME"
RESPONSE_CODE=$(curl -XGET -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $APIGEE_ACCESS_TOKEN" $URL)

if [ $RESPONSE_CODE -eq "200" ]
    then
      # Delete PR KVM Entry
      URL="https://api.enterprise.apigee.com/v1/organizations/nhsd-nonprod/environments/internal-dev/keyvaluemaps/gp-connect-access-record-endpoints-PR/entries/$KEYNAME"
      RESPONSE_CODE=$(curl -s -o response.txt -w "%{http_code}" -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer $APIGEE_ACCESS_TOKEN" $URL)
    else
      echo "The KVM or entry does not exist."
      exit 1
fi
