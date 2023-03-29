-include .env

APIGEE_ACCESS_TOKEN ?= $(shell export SSO_LOGIN_URL=https://login.apigee.com && eval get_token -u $(APIGEE_USERNAME))

PYTEST_CMD = APIGEE_ACCESS_TOKEN=$(APIGEE_ACCESS_TOKEN) INTERACTION_ID=$(INTERACTION_ID) poetry run pytest -s -v --color=yes --api-name=gp-connect-access-record-fhir --proxy-name=$(PROXY_NAME)

run:
	$(PYTEST_CMD)

#  run tests with certain marker e.g. make run-sandbox runs tests marked with sandbox
run-%:
	$(PYTEST_CMD) -m "$*"

run-ecs-test:
	 CLOUD_DOMAIN_NAME="https://pr-162.gcarf.dev.api.platform.nhs.uk/_status" pytest -s -v --color=yes -m "clouddeploymenttest"