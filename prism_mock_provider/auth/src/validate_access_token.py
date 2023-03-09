import logging
import requests
import json

logger = logging.getLogger()
logger.setLevel(logging.INFO)


def validate_access_token(incoming_token: str) -> bool:
    """
    Get the introspection endpoint from the Keycloak realm's discovery document and validate an access token against it.
    """
    # Strip the type away from the incoming token
    # TODO - use regex to account for basic tokens, etc.
    incoming_token = incoming_token.replace("Bearer ", "")

    discovery = requests.get(
        "https://identity.ptl.api.platform.nhs.uk/auth/realms/gpconnect-pfs-mock-internal-dev/.well-known/uma2-configuration",
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
            'token': incoming_token
        }
    ).json()

    is_valid: bool = validation_response.get("active") or False

    return is_valid


def handler(event, context):
    print(f"Event: {event}")

    access_token = event.get('Authorization')
    print(f'Access token: {access_token}')

    is_valid = validate_access_token(access_token)
    print(f'is_valid = {is_valid}')

    if is_valid:
        return {
          'statusCode': 200,
          'body': json.dumps('Valid access token')
        }
    else:
        return {
          'statusCode': 401,
          'body': json.dumps('Invalid access token')
        }
