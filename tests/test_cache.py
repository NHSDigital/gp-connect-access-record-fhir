import uuid

import pytest
import requests

interaction_id = "IN150016UK05"


@pytest.mark.nhsd_apim_authorization({"access": "application", "level": "level3"})
def test_cache(nhsd_apim_proxy_url, nhsd_apim_auth_headers):
    headers = {"Interaction-ID": interaction_id}
    headers.update(nhsd_apim_auth_headers)

    resp = requests.get(f"{nhsd_apim_proxy_url}/", headers=headers)

    assert resp.status_code == 200


@pytest.mark.debug
@pytest.mark.nhsd_apim_authorization({"access": "application", "level": "level3"})
def test_cache_miss(nhsd_apim_proxy_url, nhsd_apim_auth_headers):
    headers = {"Interaction-ID": str(uuid.uuid4())}
    headers.update(nhsd_apim_auth_headers)

    resp = requests.get(f"{nhsd_apim_proxy_url}/", headers=headers)

    assert resp.status_code == 404
