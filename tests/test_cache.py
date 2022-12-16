import pytest
import requests


@pytest.mark.debug
@pytest.mark.nhsd_apim_authorization({"access": "application", "level": "level3"})
def test_cache(nhsd_apim_proxy_url, nhsd_apim_auth_headers):
    resp = requests.get(f"{nhsd_apim_proxy_url}/", headers=nhsd_apim_auth_headers)
    print(resp.json)
