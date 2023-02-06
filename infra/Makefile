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

mock_receiver_repository_name = gpconnect-infra-dev
mock_receiver_repository_url = $(aws_account_no).dkr.ecr.eu-west-2.amazonaws.com/$(mock_receiver_repository_name)
build_version=latest
dockerImageName=$(mock_receiver_repository_url):$(build_version)
dockerFilePath=../PrismMockReceiver/Dockerfile
dockerContext=../PrismMockReceiver

docker-login:
	 aws ecr get-login-password --profile $(aws_profile) --region eu-west-2 | docker login --username AWS --password-stdin $(aws_account_no).dkr.ecr.eu-west-2.amazonaws.com

docker-build:
	make -C .. publish
	docker build -t $(dockerImageName) -f $(dockerFilePath) $(dockerContext)


docker-deploy: docker-login
	 docker push $(dockerImageName)

