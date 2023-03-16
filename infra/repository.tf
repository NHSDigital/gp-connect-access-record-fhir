resource "aws_ecr_repository" "mock_provider_registry" {
  name = local.name_prefix
}

resource "aws_ecr_repository" "lambda_image_registry" {
  name = local.validation_ecr_name
}
