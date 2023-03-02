import pytest
import requests

from .config import interaction_id


@pytest.mark.smoketest
@pytest.mark.auth
@pytest.mark.debug
@pytest.mark.integration
@pytest.mark.user_restricted_separate_nhs_login
@pytest.mark.nhsd_apim_authorization({"access": "patient", "level": "P9", "login_form": {"username": "9912003071"}})
def test_mock_receiver_patient_record_path(nhsd_apim_proxy_url, nhsd_apim_auth_headers):
    headers = {
              "Interaction-ID": interaction_id, "X-Request-ID": "60E0B220-8136-4CA5-AE46-1D97EF59D068",
              "Ssp-TraceID": "09a01679-2564-0fb4-5129-aecc81ea2706", "Ssp-From": "200000000359",
              "Ssp-To": "918999198738",
              "Ssp-PatientInteration": "urn:nhs:names:services:gpconnect:documents:fhir:rest:search:patient-1"}
    headers.update(nhsd_apim_auth_headers)
    resp = requests.get(f"{nhsd_apim_proxy_url}/FHIR/STU3/documents/Patient/9000000009", headers=headers)
    assert resp.status_code == 200
