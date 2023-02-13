module "cluster" {
  source      = "./cluster"
  name_prefix = local.name_prefix
  short_name_prefix = local.short_name_prefix
}
