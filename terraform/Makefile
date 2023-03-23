-include .env

aws_profile = apim-dev
tr_vars=
tr_cmd = AWS_PROFILE=$(aws_profile) terraform
interactionId=$(environment)
odsCode="REPC"
key4KVM=$(odsCode)_$(interactionId)

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

destroy:
	$(tr_cmd) destroy

add-endpoint: outputs
	chmod +x ./AddEndpoints.sh
	./AddEndpoints.sh $(key4KVM)

taint: workspace
	$(tr_cmd) taint module.mock-provider.aws_ecs_task_definition.mock-provider

outputs:
	$(tr_cmd) output -json > ./outputs.json

mock_provider_repository_name = gpconnect-infra-dev
mock_provider_repository_url = $(aws_account_no).dkr.ecr.eu-west-2.amazonaws.com/$(mock_provider_repository_name)
build_version=$(environment)
dockerImageName=$(mock_provider_repository_url):$(build_version)
dockerFilePath=../PrismMockProvider/Dockerfile
dockerContext=../PrismMockProvider

docker-login:
	 aws ecr get-login-password --profile $(aws_profile) --region eu-west-2 | docker login --username AWS --password-stdin $(aws_account_no).dkr.ecr.eu-west-2.amazonaws.com

docker-build:
	make -C .. publish
	docker build -t $(dockerImageName) -f $(dockerFilePath) $(dockerContext)


docker-deploy: docker-login
	 docker push $(dockerImageName)
