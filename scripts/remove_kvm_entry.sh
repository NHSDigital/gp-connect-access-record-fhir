#!/bin/bash

delete_kvm () {

 URL="https://api.enterprise.apigee.com/v1/organizations/nhsd-nonprod/environments/$APIGEE_ENVIRONMENT/keyvaluemaps/gp-connect-access-record-endpoints-pr-$TAG"
    
 RESPONSE_CODE=$(curl -XGET -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $APIGEE_ACCESS_TOKEN" $URL)

 if [ $RESPONSE_CODE -eq "200" ]
 then
    URL="https://api.enterprise.apigee.com/v1/organizations/nhsd-nonprod/environments/$APIGEE_ENVIRONMENT/keyvaluemaps/gp-connect-access-record-endpoints-pr-$TAG"
        
    RESPONSE_CODE=$(curl -XDELETE -s  -o response.txt -w "%{http_code}" -H "Content-Type: application/json" -H "Authorization: Bearer $APIGEE_ACCESS_TOKEN" $URL)

    echo $RESPONSE_CODE

    if [ $RESPONSE_CODE -eq "200" ]
    then
            echo "Keyvaluemap 'gp-connect-access-record-endpoints-pr-$TAG' successfully deleted."
        
    else
            echo "Something FAILED."
            cat response.txt 
            echo "Stopping..."
            exit 6
    fi
 else
    echo "Keyvaluemap 'gp-connect-access-record-endpoints-pr-$TAG' does NOT exist."
 fi

} 

delete_kvm