output "zone_domain" {
  value = aws_route53_zone.project_zone.name
}

output "vpc_id" {
  value = local.vpc_id
}

output "public_subnet_ids" {
  value = module.subnets[*].subnet_id
}

output "private_subnet_ids" {
  value = module.private_subnets[*].subnet_id
}

output "fargate_subnet_ids" {
  value = module.private_subnets[*].subnet_id
}

output "vpc_link_id" {
  value = aws_apigatewayv2_vpc_link.alb_vpc_link.id
}

output "mock_provider_registry_id" {
    value = aws_ecr_repository.mock_provider_registry.id
}

output "validation_ecr_id" {
    value = aws_ecr_repository.lambda_image_registry.id
}
