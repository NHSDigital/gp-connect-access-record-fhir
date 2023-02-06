module "api" {
  source = "./api"

  name_prefix     = local.name_prefix
  zone_id         = data.aws_route53_zone.project_zone.zone_id
  api_domain_name = local.service_domain_name
  environment     = local.environment
}
