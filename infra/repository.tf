resource "aws_ecr_repository" "mock_receiver_registry" {
  name = local.name_prefix
}
