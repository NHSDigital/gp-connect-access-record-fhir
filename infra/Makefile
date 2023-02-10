-include .env
environment = dev
aws_profile = apim-dev
tf_opt=
tf_state=
tf_vars=
tr_cmd = AWS_PROFILE=$(aws_profile) terraform

.SILENT:
workspace:
	$(tr_cmd) workspace new $(environment) || $(tr_cmd) workspace select $(environment) && echo "Switched to workspace/environment: $(environment)"

init:
	$(tr_cmd) init $(tf_state) $(tf_vars)

plan: workspace
	$(tr_cmd) plan

apply: workspace
	 $(tr_cmd) apply -auto-approve

destroy:
	$(tr_cmd) destroy



