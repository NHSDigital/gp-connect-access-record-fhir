data aws_caller_identity current {}

locals {
  ecr_repository_name = "gpconnect-infra-dev-token-validation-lambda"
  ecr_image_tag       = "dev"
}

data aws_ecr_repository lambda_image_registry {
  name = local.ecr_repository_name
}

resource null_resource ecr_image {
  triggers = {
    python_file = md5(file("${path.module}/../../prism_mock_provider/auth/src/validate_access_token.py"))
    docker_file = md5(file("${path.module}/../../prism_mock_provider/auth/Dockerfile"))
  }

  # The local-exec provisioner invokes a local executable after a resource is created.
  # This invokes a process on the machine running Terraform, not on the resource.
  provisioner "local-exec" {
    command = <<EOF
           make docker-deploy-lambda
       EOF
    interpreter = ["bash", "-c"]
    working_dir = "."
  }
}

data aws_ecr_image lambda_image {
  depends_on = [
    null_resource.ecr_image
  ]
  repository_name = local.ecr_repository_name
  image_tag       = local.ecr_image_tag
}

resource aws_lambda_function validate-token-lambda-function {
  depends_on = [
    null_resource.ecr_image
  ]
  function_name = "${var.short_name_prefix}-token-validation-lambda"
  role = aws_iam_role.lambda_role.arn
  timeout = 300
  image_uri = "${data.aws_ecr_repository.lambda_image_registry.repository_url}@${data.aws_ecr_image.lambda_image.id}"
  package_type = "Image"
}

output "lambda_name" {
  value = aws_lambda_function.validate-token-lambda-function.id
}
