output "zone_domain" {
  value = aws_route53_zone.project_zone.name
}

output "vpc_id" {
  value = local.vpc_id
}

output "private_subnet_ids" {
  value = module.private_subnets[*].subnet_id
}

output "alb_vpc_link_id" {
  value = aws_apigatewayv2_vpc_link.alb_vpc_link.id
}
