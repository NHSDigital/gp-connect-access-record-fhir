import requests
import pytest
from os import getenv


@pytest.mark.clouddeploymenttest
def test_ecs_task_status_endpoint():
    domain_name = getenv('CLOUD_DOMAIN_NAME')
    url = domain_name
    response = requests.get(url)
    assert response.status_code == 200
