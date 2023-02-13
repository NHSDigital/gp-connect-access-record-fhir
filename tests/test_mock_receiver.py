import pytest
import requests

from .config import interaction_id


@pytest.mark.nhsd_apim_authorization({"access": "patient", "level": "P9"})
@pytest.mark.debug
def test_mock_receiver_happy_path(nhsd_apim_proxy_url, nhsd_apim_auth_headers):
    headers = {"Interaction-ID": interaction_id}
    headers.update(nhsd_apim_auth_headers)

    resp = requests.get(f"{nhsd_apim_proxy_url}/", headers=headers)

    assert resp.status_code == 403
