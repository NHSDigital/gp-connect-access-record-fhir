resource "aws_ecr_repository" "mock_provider_registry" {
  name = "${local.prefix}-mock-provider"
}

resource "aws_ecr_repository" "token_validator_registry" {
    name = "${local.prefix}-token-validator"
}

resource "aws_ecr_repository" "lambda_image_registry" {
  name = local.validation_ecr_name
}
