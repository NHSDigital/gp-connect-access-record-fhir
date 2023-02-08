import pytest
import requests


@pytest.mark.nhsd_apim_authorization({"access": "patient", "level": "P9"})
def test_mock_provider_happy_path(nhsd_apim_proxy_url, nhsd_apim_auth_headers):
    headers = {"Interaction-ID": "REPC_IN150016UK06"}
    headers.update(nhsd_apim_auth_headers)

    resp = requests.get(f"{nhsd_apim_proxy_url}/", headers=headers)

    assert resp.status_code == 403
