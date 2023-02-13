module "mock-provider" {
  source      = "./mock-provider"
  region      = var.region
  name_prefix = local.name_prefix
  cluster_id    = module.cluster.cluster_id
  container_port = 9000
  subnet_ids    = local.private_subnet_ids
  alb_tg_arn     = module.alb.alb_target_group_arn
  vpc_id        = local.vpc_id
  image_version = local.environment
}
