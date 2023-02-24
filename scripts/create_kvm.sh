#!/bin/bash

create_kvm () {

    ## Create the KVM if it does not exist

    URL="https://api.enterprise.apigee.com/v1/organizations/nhsd-nonprod/environments/$APIGEE_ENVIRONMENT/keyvaluemaps/gp-connect-access-record-endpoints-PR"
    RESPONSE_CODE=$(curl -XGET -s -o /dev/null -w "%{http_code}" -H "Authorization: Bearer $APIGEE_ACCESS_TOKEN" $URL)

    if [ $RESPONSE_CODE -eq "200" ]
    then
      echo "The KVM does already exist."
    else
      echo "The KVM does NOT exist."
      URL="https://api.enterprise.apigee.com/v1/organizations/nhsd-nonprod/environments/$APIGEE_ENVIRONMENT/keyvaluemaps"
      RESPONSE_CODE=$(curl -s -o response.txt -w "%{http_code}" -XPOST -H "Content-Type: application/json" -H "Authorization: Bearer $APIGEE_ACCESS_TOKEN" -d '{"name":"gp-connect-access-record-endpoints-PR"}' $URL)

      if [ $RESPONSE_CODE -eq "201" ]
      then
        echo "Keyvaluemap 'gp-connect-access-record-endpoints-PR' successfully created."
      else
        echo "Something FAILED."
        cat response.txt 
        echo "Stopping..."
        exit 6
      fi
    fi
}


populate_kvm () {

    ## Update the existing KVM (updates the entries if they exist or adds them if not)

    # Looping over each entry
    jq -c '.[]' ./endpoints/$APIGEE_ENVIRONMENT/endpoints.json | while read i; do

      # Extracting keyname and keyvalue
      KEYNAME=$(jq -c -r '.NAME' <<< "$i")
      KEYVALUE=$(jq -c -r '.VALUE' <<< "$i")

      # DELETE FIRST
      URL="https://api.enterprise.apigee.com/v1/organizations/nhsd-nonprod/environments/$APIGEE_ENVIRONMENT/keyvaluemaps/gp-connect-access-record-endpoints-PR/entries/$KEYNAME"
      RESPONSE_CODE=$(curl -s -o response.txt -w "%{http_code}" -X DELETE -H "Content-Type: application/json" -H "Authorization: Bearer $APIGEE_ACCESS_TOKEN" $URL)
      

      if [ $RESPONSE_CODE -eq "200" ]
      then
        echo "Key '$KEYNAME': deleted."
      else 
        echo "Key '$KEYNAME': does NOT exist."
      fi

      # CREATE ENTRY
      URL="https://api.enterprise.apigee.com/v1/organizations/nhsd-nonprod/environments/$APIGEE_ENVIRONMENT/keyvaluemaps/gp-connect-access-record-endpoints-PR/entries"
      RESPONSE_CODE=$(curl -XPOST -s -o response.txt -w "%{http_code}" -H "Content-Type: application/json" -H "Authorization: Bearer $APIGEE_ACCESS_TOKEN" -d '{"name":"'$KEYNAME'","value":"'$KEYVALUE'"}' $URL)

      if [ $RESPONSE_CODE -eq "201" ]
      then
        echo "Keyvaluemap entry '$KEYNAME' successfully updated."
      elif [ $RESPONSE_CODE -eq "409" ]
      then
        echo "Keyvaluemap entry '$KEYNAME' already exists."
      else
        echo "Something FAILED."
        cat response.txt 
        echo "Stopping..."
        exit 6
      fi
    done

}


## First check if KVM exists, if not, create KVM 
create_kvm

## Second, populate KVM
populate_kvm
