import pytest
import requests
import os
import json


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

    headers.update(nhsd_apim_auth_headers)
    resp = requests.get(
        f"{nhsd_apim_proxy_url}/documents/Patient/9000000009",
        headers=headers
    )
    assert resp.status_code == 200


@pytest.mark.mock_provider_sandbox
def test_mock_provider_sandbox_happy_path():
    
    with open("./200_find_patient.json") as f:
            example_response = json.load(f)
        
    headers = {
        "accept": "application/fhir+json",
        "X-Correlation-ID": "11C46F5F-CDEF-4865-94B2-0EE0EDCC26DA",
        "X-Request-ID": "60E0B220-8136-4CA5-AE46-1D97EF59D068",
    }
    base_path = os.getenv("SERVICE_BASE_PATH")
    apigee_env = os.getenv("APIGEE_ENVIRONMENT")

    url = f"https://{apigee_env}.api.service.nhs.uk/{base_path}"
    resp = requests.get(f"{url}/documents/Patient/9000000009", headers=headers)

    assert resp.status_code == 200
    assert json.loads(resp.text) == example_response
