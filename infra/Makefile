-include .env
environment = dev
aws_profile = apim-dev
tf_opt=
tf_state=-backend-config="key=gpconnectInfra"
tf_vars=-var="environment=$(environment)"
mock_receiver_repository_name = gpconnect-infra-dev
mock_receiver_repository_url = $(aws_account_no).dkr.ecr.eu-west-2.amazonaws.com/$(mock_receiver_repository_name)
build_version=latest
dockerImageName=$(mock_receiver_repository_url):$(build_version)
tf_cmd = AWS_PROFILE=$(aws_profile) terraform 
dockerFilePath=../PrismMockReceiver/Dockerfile
dockerContext=../PrismMockReceiver


init:
	$(tf_cmd) init $(tf_state) $(tf_vars)

plan:
	$(tf_cmd) plan

apply:
	 $(tf_cmd) apply -auto-approve

destroy:
	$(tf_cmd) destroy

docker-login:
	 aws ecr get-login-password --profile $(aws_profile) --region eu-west-2 | docker login --username AWS --password-stdin $(aws_account_no).dkr.ecr.eu-west-2.amazonaws.com

docker-build:
	make -C .. publish
	docker build -t $(dockerImageName) -f $(dockerFilePath) $(dockerContext)


docker-deploy: docker-login 
	 docker push $(dockerImageName)

