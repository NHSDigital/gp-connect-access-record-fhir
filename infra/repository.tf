resource "aws_ecr_repository" "mock_provider_registry" {
  name = local.name_prefix
}
