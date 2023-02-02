.SILENT:

environment = ryth1
aws_profile = apim-dev
tr_vars=
tr_cmd = AWS_PROFILE=$(aws_profile) terraform

-include .env

workspace:
	$(tr_cmd) workspace new $(environment) || $(tr_cmd) workspace select $(environment) && echo "Switched to workspace/environment: $(environment)"

init:
	$(tr_cmd) init -backend-config="key=gpconnectpfs" $(tr_vars)

plan: workspace
	$(tr_cmd) plan

apply: workspace
	$(tr_cmd) apply -auto-approve

clean:
	rm -rf build .terraform upload-key
