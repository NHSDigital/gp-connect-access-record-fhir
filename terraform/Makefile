-include .env

interactionId=$(environment)
odsCode="REPC"
key4KVM=$(odsCode)_$(interactionId)

aws_profile = apim-dev
tf_cmd = AWS_PROFILE=$(aws_profile) terraform

project_name = gp-connect-access-record-fhir
short_name = gcarf
state_bucket = $(project_name)-terraform-state
tf_state= -backend-config="bucket=$(state_bucket)"

tf_vars= -var="project_name=$(project_name)" -var="short_name=$(short_name)"

workspace:
	$(tf_cmd) workspace new $(environment) || $(tf_cmd) workspace select $(environment) && echo "Switched to workspace/environment: $(environment)"

init:
	$(tf_cmd) init $(tf_state) $(tf_vars)

plan: workspace
	 $(tf_cmd) plan $(tf_vars)

apply: workspace
	$(tf_cmd) apply $(tf_vars) -auto-approve

clean:
	rm -rf build .terraform upload-key

destroy: workspace
	$(tf_cmd) destroy $(tf_vars) -auto-approve
	teraform workspace select default
	terraform workspace delete $(environment)

add-endpoint: outputs
	chmod +x ./AddEndpoints.sh
	./AddEndpoints.sh $(key4KVM)

outputs:
	$(tf_cmd) output -json > ./outputs.json

mock_provider_repository_name = gp-connect-access-record-fhir-infra-dev-mock-provider
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

lock-provider:
	# Run this only when you install a new terraform provider. This will generate sha code in lock file for all platform
	echo "This may take a while. Be patient!"
	$(tf_cmd) providers lock -platform=darwin_arm64 -platform=darwin_amd64 -platform=linux_amd64 -platform=windows_amd64
