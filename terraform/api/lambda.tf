data aws_caller_identity current {}

data aws_ecr_repository "token_validation_ecr" {
    name = var.token_validator_registry_id
}

locals {
  token_validator_path = "${path.root}/../token_validator"
  validation_ecr_url = data.aws_ecr_repository.token_validation_ecr.repository_url
  validator_image_version = var.environment
  validation_ecr_tag = "${local.validation_ecr_url}:${local.validator_image_version}"
}

data "archive_file" "token_validator_archive" {
  type        = "zip"
  source_dir  = local.token_validator_path
  output_path = "build/token_validator.zip"
}

resource null_resource push_token_validator_image {
  triggers = {
    token_validator_src = data.archive_file.token_validator_archive.output_sha
  }

  # The local-exec provisioner invokes a local executable after a resource is created.
  # This invokes a process on the machine running Terraform, not on the resource.
  provisioner "local-exec" {
    interpreter = ["bash", "-c"]

    command = <<EOF
aws ecr get-login-password --region eu-west-2 | docker login --username AWS --password-stdin ${data.aws_caller_identity.current.account_id}.dkr.ecr.eu-west-2.amazonaws.com
docker build -t ${local.validation_ecr_tag} -f ${local.token_validator_path}/Dockerfile ${local.token_validator_path}
docker push ${local.validation_ecr_tag}
       EOF
  }
}

data aws_ecr_image lambda_image {
  depends_on = [
    null_resource.push_token_validator_image
  ]
  repository_name = data.aws_ecr_repository.token_validation_ecr.name
  image_tag       = local.validator_image_version
}

resource aws_lambda_function validate-token-lambda-function {
  depends_on = [
    null_resource.push_token_validator_image
  ]
  function_name = "${var.short_prefix}-token-validator-lambda"
  role = aws_iam_role.lambda_role.arn
  timeout = 300
  image_uri = "${local.validation_ecr_url}@${data.aws_ecr_image.lambda_image.id}"
  package_type = "Image"
  source_code_hash = data.aws_ecr_image.lambda_image.image_digest

  environment {
      variables = {
          "keycloak_environment": var.keycloak_environment,
          "client_id": var.client_id,
          "client_secret": var.client_secret
      }
  }
}
