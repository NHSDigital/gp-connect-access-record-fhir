resource "aws_ecr_repository" "mock_provider_registry" {
  name = local.prefix
}

resource "aws_ecr_repository" "lambda_image_registry" {
  name = "${local.prefix}-token-validation-lambda"
}
