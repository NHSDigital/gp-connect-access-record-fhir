-include .env

APIGEE_ACCESS_TOKEN ?= $(shell export SSO_LOGIN_URL=https://login.apigee.com && eval get_token -u $(APIGEE_USERNAME))

PYTEST_CMD = APIGEE_ACCESS_TOKEN=$(APIGEE_ACCESS_TOKEN) INTERACTION_ID=$(INTERACTION_ID) poetry run pytest -s -v --color=yes --api-name=gp-connect-access-record-fhir --proxy-name=$(PROXY_NAME)
PYTEST_CMD_PROD = APIGEE_ACCESS_TOKEN=$(APIGEE_ACCESS_TOKEN) INTERACTION_ID=$(INTERACTION_ID) poetry run pytest -s -v --color=yes --api-name=gp-connect-access-record-fhir --proxy-name=$(PROXY_NAME) --apigee-app-id=$(APIGEE_APP_ID) --apigee-organization=nhsd-prod

run:
	$(PYTEST_CMD)

#  run tests with certain marker e.g. make run-sandbox runs tests marked with sandbox
run-int:
	$(PYTEST_CMD_PROD)



