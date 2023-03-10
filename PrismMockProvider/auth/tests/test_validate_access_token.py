import uuid
from time import time
from os import getenv

import pytest
import jwt
from pytest_nhsd_apim.identity_service import (
    KeycloakUserConfig,
    KeycloakUserAuthenticator
)
import requests

from PrismMockProvider.auth.src.validate_access_token import validate_access_token


# @pytest.mark.mock_provider
@pytest.mark.nhsd_apim_authorization(
    {
        "access": "patient",
        "level": "P9",
        "login_form": {"username": "9912003071"},
    }
)
def test_happy_path(_test_app_credentials, apigee_environment, _jwt_keys, _keycloak_client_credentials):
    """Check that the token validation returns True to signify the access token is valid when we pass a valid token."""
    # TODO - move token generation to a helper method
    # Generate an ID Token
    config = KeycloakUserConfig(
        realm=f"NHS-Login-mock-{apigee_environment}",
        client_id=_keycloak_client_credentials["nhs-login"]["client_id"],
        client_secret=_keycloak_client_credentials["nhs-login"]["client_secret"],
        login_form={"username": "9912003071"},
    )
    authenticator = KeycloakUserAuthenticator(config=config)
    id_token = authenticator.get_token()["access_token"]

    # Need to post the ID Token to GPC's /token endpoint with a signed JWT to get an Access Token
    url = "https://identity.ptl.api.platform.nhs.uk/auth/"
    "realms/gpconnect-pfs-mock-internal-dev/protocol/openid-connect/token"

    with open(getenv("JWT_PRIVATE_KEY_ABSOLUTE_PATH"), "r") as key:
        private_key = key.read()

    data = {
        "client_id": "gpconnect-pfs-access-record",
        "client_assertion": encode_jwt(
            client_id="gpconnect-pfs-access-record",
            audience=url,
            jwt_kid="test-1",
            jwt_private_key=private_key
        ),
        "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        "subject_token": id_token,
        "subject_token_type": "urn:ietf:params:oauth:token-type:access_token",
        "subject_issuer": "nhs-login-mock-internal-dev",
        "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
        "audience": "gpconnect-pfs-access-record"
    }
    resp = requests.post(url, data=data)
    if resp.status_code != 200:
        raise RuntimeError(f"{resp.status_code}: {resp.text}")
    result = resp.json()
    access_token = result.get("access_token")

    assert validate_access_token(access_token)


# @pytest.mark.mock_provider
@pytest.mark.nhsd_apim_authorization(
    {
        "access": "patient",
        "level": "P9",
        "login_form": {"username": "9912003071"},
    }
)
def test_invalid_token(
    nhsd_apim_proxy_url, _test_app_credentials, apigee_environment, _jwt_keys, _keycloak_client_credentials
):
    """Check that the token validation returns False to signify the access token is invalid when we try to validate
    a token that has been revoked."""
    # TODO - move token generation to a helper method
    # Generate an ID Token
    config = KeycloakUserConfig(
        realm=f"NHS-Login-mock-{apigee_environment}",
        client_id=_keycloak_client_credentials["nhs-login"]["client_id"],
        client_secret=_keycloak_client_credentials["nhs-login"]["client_secret"],
        login_form={"username": "9912003071"},
    )
    authenticator = KeycloakUserAuthenticator(config=config)
    id_token = authenticator.get_token()["access_token"]

    # Need to post the ID Token to GPC's /token endpoint with a signed JWT to get an Access Token
    url = "https://identity.ptl.api.platform.nhs.uk/auth/"
    "realms/gpconnect-pfs-mock-internal-dev/protocol/openid-connect/token"

    with open(getenv("JWT_PRIVATE_KEY_ABSOLUTE_PATH"), "r") as key:
        private_key = key.read()

    data = {
        "client_id": "gpconnect-pfs-access-record",
        "client_assertion": encode_jwt(
            client_id="gpconnect-pfs-access-record",
            audience=url,
            jwt_kid="test-1",
            jwt_private_key=private_key
        ),
        "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
        "subject_token": id_token,
        "subject_token_type": "urn:ietf:params:oauth:token-type:access_token",
        "subject_issuer": "nhs-login-mock-internal-dev",
        "grant_type": "urn:ietf:params:oauth:grant-type:token-exchange",
        "audience": "gpconnect-pfs-access-record"
    }
    resp = requests.post(url, data=data)
    if resp.status_code != 200:
        raise RuntimeError(f"{resp.status_code}: {resp.text}")
    result = resp.json()

    access_token = result.get("access_token")

    # Call the revocation endpoint to invalidate the token/session
    requests.post(
        "https://identity.ptl.api.platform.nhs.uk/auth/"
        "realms/gpconnect-pfs-mock-internal-dev/protocol/openid-connect/revoke",
        data={
            "client_id": "gpconnect-pfs-access-record",
            "client_assertion": encode_jwt(
                client_id="gpconnect-pfs-access-record",
                audience=url,
                jwt_kid="test-1",
                jwt_private_key=private_key
            ),
            "client_assertion_type": "urn:ietf:params:oauth:client-assertion-type:jwt-bearer",
            "token": access_token
        }
    )

    assert not validate_access_token(access_token)


def encode_jwt(client_id, audience, jwt_kid, jwt_private_key):
    claims = {
        "sub": client_id,
        "iss": client_id,
        "jti": str(uuid.uuid4()),
        "aud": audience,
        "exp": int(time()) + 300,  # 5 minutes in the future
    }
    additional_headers = {"kid": jwt_kid}
    client_assertion = jwt.encode(
        claims, jwt_private_key, algorithm="RS512", headers=additional_headers
    )
    return client_assertion
