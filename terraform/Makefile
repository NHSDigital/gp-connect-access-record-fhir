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

# Token Validation Lambda
lambda_repository_name = gpconnect-infra-dev-token-validation-lambda
lambda_repository_url = $(aws_account_no).dkr.ecr.eu-west-2.amazonaws.com/$(lambda_repository_name)
build_version=$(environment)
lambdaDockerImageName=$(lambda_repository_url):$(build_version)
lambdaDockerFilePath=../PrismMockProvider/auth/Dockerfile
lambdaDockerContext=../PrismMockProvider/auth

docker-build-lambda:
	docker build -t $(lambdaDockerImageName) -f $(lambdaDockerFilePath) $(lambdaDockerContext)

docker-deploy-lambda: docker-build-lambda docker-login
	docker push $(lambdaDockerImageName)
