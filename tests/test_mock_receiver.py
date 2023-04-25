from urllib.parse import parse_qs, urlparse

import pytest
import requests
from lxml import html


@pytest.mark.smoketest
@pytest.mark.auth
@pytest.mark.integration
@pytest.mark.user_restricted_separate_nhs_login
@pytest.mark.nhsd_apim_authorization({"access": "patient", "level": "P9", "login_form": {"username": "9912003071"}})
def test_mock_receiver_patient_record_path(nhsd_apim_proxy_url, nhsd_apim_auth_headers):
    headers = {
        "Interaction-ID": "urn:nhs:names:services:gpconnect:fhir:operation:gpc.getstructuredrecord-1",
        "X-Request-ID": "60E0B220-8136-4CA5-AE46-1D97EF59D068",
    }
    headers.update(nhsd_apim_auth_headers)
    resp = requests.get(
        f"{nhsd_apim_proxy_url}/documents/Patient/9000000009",
        headers=headers
    )
    assert resp.status_code == 200


@pytest.mark.debug
def test_token(nhsd_apim_proxy_url):
    headers = {
        "Interaction-ID": "urn:nhs:names:services:gpconnect:fhir:operation:gpc.getstructuredrecord-1",
        "X-Request-ID": "60E0B220-8136-4CA5-AE46-1D97EF59D068",
    }
    auth_data = {
        "username": "testuser",
        "callback_url": "https://oauth.pstmn.io/v1/callback",
        "scope": "nhs-login"
    }
    auth = IntNhsLoginMockAuth(auth_data)
    print(auth.get_token())
    # resp = requests.get(
    #     f"{nhsd_apim_proxy_url}/documents/Patient/9000000009",
    #     headers=headers
    # )
    print("my tesssst")


class IntNhsLoginMockAuth:
    base_url = "https://int.api.service.nhs.uk/oauth2-mock"
    auth_url = f"{base_url}/authorize"
    token_url = f"{base_url}/token"

    def __init__(self, auth_data: dict) -> None:
        self.auth_data = auth_data

    @staticmethod
    def extract_code(response) -> str:
        qs = urlparse(
            response.history[-1].headers["Location"]
        ).query
        auth_code = parse_qs(qs)["code"]
        if isinstance(auth_code, list):
            # in case there's multiple, this was a bug at one stage
            auth_code = auth_code[0]

        return auth_code

    @staticmethod
    def extract_form_url(response) -> str:
        html_str = response.content.decode()
        tree = html.fromstring(html_str)
        authorize_form = tree.forms[0]

        return authorize_form.action

    def get_token(self) -> str:
        login_session = requests.session()

        client_id = self.auth_data["client_id"]
        client_secret = self.auth_data["client_secret"]
        callback_url = self.auth_data["callback_url"]
        scope = self.auth_data["scope"]
        username = self.auth_data["username"]

        # Step1: login page
        authorize_resp = login_session.get(
            self.auth_url,
            params={
                "client_id": client_id,
                "redirect_uri": callback_url,
                "response_type": "code",
                "scope": scope,
                "state": "1234567890",
            },
        )

        # Step2: Submit login form
        form_action_url = self.extract_form_url(authorize_resp)
        form_submission_data = {"username": username}
        code_resp = login_session.post(url=form_action_url, data=form_submission_data)

        # Step3: extract code form redirect
        auth_code = self.extract_code(code_resp)

        # Step4: Post the code to get access token
        token_resp = login_session.post(
            self.token_url,
            data={
                "grant_type": "authorization_code",
                "code": auth_code,
                "redirect_uri": callback_url,
                "client_id": client_id,
                "client_secret": client_secret,
            },
        )

        return token_resp.json()["access_token"]
