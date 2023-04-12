"""
See
https://github.com/NHSDigital/pytest-nhsd-apim/blob/main/tests/test_examples.py
for more ideas on how to test the authorization of your API.
"""
import logging
from os import getenv

import pytest
import requests

from .config import interaction_id


@pytest.mark.smoketest
def test_ping(nhsd_apim_proxy_url):
    resp = requests.get(f"{nhsd_apim_proxy_url}/_ping")
    assert resp.status_code == 200


@pytest.mark.smoketest
def test_wait_for_ping(nhsd_apim_proxy_url):
    retries = 0
    resp = requests.get(f"{nhsd_apim_proxy_url}/_ping")
    deployed_commitId = resp.json().get("commitId")

    while (deployed_commitId != getenv('SOURCE_COMMIT_ID')
           and retries <= 30
           and resp.status_code == 200):
        resp = requests.get(f"{nhsd_apim_proxy_url}/_ping")
        deployed_commitId = resp.json().get("commitId")
        retries += 1
        logging.warning(f"Expected commit id {getenv('SOURCE_COMMIT_ID')} but was {deployed_commitId}, retrying")

    if resp.status_code != 200:
        pytest.fail(f"Status code {resp.status_code}, expecting 200")
    elif retries >= 30:
        pytest.fail("Timeout Error - max retries")

    assert deployed_commitId == getenv('SOURCE_COMMIT_ID')


@pytest.mark.smoketest
def test_status(nhsd_apim_proxy_url, status_endpoint_auth_headers):
    resp = requests.get(
        f"{nhsd_apim_proxy_url}/_status", headers=status_endpoint_auth_headers
    )
    assert resp.status_code == 200
    # Make some additional assertions about your status response here!


@pytest.mark.smoketest
def test_wait_for_status(nhsd_apim_proxy_url, status_endpoint_auth_headers):
    retries = 0
    resp = requests.get(f"{nhsd_apim_proxy_url}/_status", headers=status_endpoint_auth_headers)
    deployed_commitId = resp.json().get("commitId")

    while (deployed_commitId != getenv('SOURCE_COMMIT_ID')
           and retries <= 30
           and resp.status_code == 200
           and resp.json().get("version")):
        resp = requests.get(f"{nhsd_apim_proxy_url}/_status", headers=status_endpoint_auth_headers)
        deployed_commitId = resp.json().get("commitId")
        retries += 1
        logging.warning(f"Expected commit id {getenv('SOURCE_COMMIT_ID')} but was {deployed_commitId}, retrying")

    if resp.status_code != 200:
        pytest.fail(f"Status code {resp.status_code}, expecting 200")
    elif retries >= 30:
        pytest.fail("Timeout Error - max retries")
    elif not resp.json().get("version"):
        pytest.fail("version not found")

    assert deployed_commitId == getenv('SOURCE_COMMIT_ID')


@pytest.mark.auth
@pytest.mark.integration
@pytest.mark.user_restricted_separate_nhs_login
@pytest.mark.nhsd_apim_authorization({"access": "application", "level": "level0"})
def test_auth_level0(nhsd_apim_proxy_url, nhsd_apim_auth_headers):
    headers = {"Interaction-ID": interaction_id}
    headers.update(nhsd_apim_auth_headers)

    resp = requests.get(f"{nhsd_apim_proxy_url}/documents/Patient/9000000009", headers=headers)
    assert resp.status_code == 401


@pytest.mark.auth
@pytest.mark.nhsd_apim_authorization(
    {
        "access": "patient",
        "level": "P9",
        "login_form": {"username": "9912003071"}
    }
)
def test_nhs_login_p9(nhsd_apim_proxy_url, nhsd_apim_auth_headers):
    headers = {
        "Interaction-ID": interaction_id,
        "accept": "application/fhir+json",
        "X-Correlation-ID": "11C46F5F-CDEF-4865-94B2-0EE0EDCC26DA",
        "X-Request-ID": "60E0B220-8136-4CA5-AE46-1D97EF59D068",
        "Ssp-TraceID": "09a01679-2564-0fb4-5129-aecc81ea2706",
        "Ssp-From": "200000000359",
        "Ssp-To": "918999198738",
        "Ssp-PatientInteration": "urn:nhs:names:services:gpconnect:documents:fhir:rest:search:patient-1",
    }
    headers.update(nhsd_apim_auth_headers)

    resp = requests.get(
        f"{nhsd_apim_proxy_url}/{getenv('PROXY_BASE_PATH')}/documents/Patient/9000000009",
        headers=headers
    )
    assert resp.status_code == 200
