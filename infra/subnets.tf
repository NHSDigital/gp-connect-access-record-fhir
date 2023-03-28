module "private_subnets" {
  source      = "./subnet"
  name_prefix = local.name_prefix
  vpc_id      = local.vpc_id

  count  = length(local.private_subnet)
  subnet = local.private_subnet[count.index]
}
