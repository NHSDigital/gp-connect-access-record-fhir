import logging
import requests
import json
import re
import base64

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def validate_access_token(incoming_token: str) -> bool:
    """
    Get the introspection endpoint from the Keycloak realm's discovery document and validate an access token against it.
    """
    # Extract just the token value from the header
    token = re.sub(r"Bearer\s|Basic\s", "", incoming_token)

    # Get the introspection endpoint from the Keycloak discovery doc
    discovery = requests.get(
        "https://identity.ptl.api.platform.nhs.uk/"
        "auth/realms/gpconnect-pfs-mock-internal-dev/.well-known/uma2-configuration",
    ).json()
    introspection_endpoint = discovery.get('introspection_endpoint')

    # Get an Access Token for the realm using the client_id and client_secret
    client_id = "introspect-test"
    client_secret = "bbdba1d3-678d-4a2c-9781-fb1ff73d836f"

    validation_response = requests.post(
        introspection_endpoint,
        auth=(client_id, client_secret),
        data={
            'token_type_hint': 'requesting_party_token',
            'token': token
        }
    ).json()

    return validation_response.get("active") or False


def handler(event, _context):
    access_token = event.get("headers").get("GPC-Authorization")
    is_valid = validate_access_token(access_token)

    if is_valid:
        return {
            "statusCode": 200,
            "headers": {'Content-Type': 'application/json'},
            "body": json.dumps('Valid access token'),
            "isBase64Encoded": False
        }
    else:
        return {
            "statusCode": 401,
            "headers": {'Content-Type': 'application/json'},
            "body": json.dumps('Invalid access token'),
            "isBase64Encoded": False
        }
