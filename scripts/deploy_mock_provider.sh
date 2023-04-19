#!/bin/bash

set -e

service_name=$FULLY_QUALIFIED_SERVICE_NAME
introspection_client_id_int=$INTROSPECTION_CLIENT_ID_INT
introspection_client_secret_int=$INTROSPECTION_CLIENT_SECRET_INT

pr_no=$(echo $service_name | grep -oE '[0-9]+$')
if [ -z ${pr_no} ]; then
    workspace=$APIGEE_ENVIRONMENT
else
    workspace=pr-${workspace}
fi


echo Deploy mock provider with following parameters
echo service_name: $service_name
echo workspace: $workspace
echo Apigee environment: $APIGEE_ENVIRONMENT
echo pr_no: $pr_no

aws_account_no="$(aws sts get-caller-identity --query Account --output text)"

cd terraform
make init
make apply aws_account_no=${aws_account_no} environment=$workspace) \
  client_id=$introspection_client_id \
  client_secret=$introspection_client_secret \
  keycloak_environment=$APIGEE_ENVIRONMENT
cd ..

if [ -n "$pr_no" ]; then
    echo add KVM for PR-$pr_no
    source .venv/bin/activate
    domain_name=https://$(make -C terraform -s output name=service_domain_name)
    oauth_endpoint="https://identity.ptl.api.platform.nhs.uk/auth/realms/gpconnect-pfs-mock-$APIGEE_ENVIRONMENT/protocol/openid-connect/token"
    python scripts/apigee_kvm.py --env $APIGEE_ENVIRONMENT --access-token $(secret.AccessToken) populate-interaction-ids gp-connect-access-record-endpoints-pr-$pr_no --ods REPC --provider-endpoint $domain_name --oauth-endpoint $oauth_endpoint
fi
