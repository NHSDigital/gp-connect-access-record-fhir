resource "aws_route53_zone" "main" {
  name = var.domain_name
}

module "api" {
  source = "./api"

  name_prefix     = local.name_prefix
  zone_id         = aws_route53_zone.main.zone_id
  api_domain_name = local.service_domain_name
  environment     = local.environment
}
