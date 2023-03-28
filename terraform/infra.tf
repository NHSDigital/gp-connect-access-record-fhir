/* Use infra terraform state to populate infra outputs.
We use the infra state file to read the outputs and then reassign them to local names
*/

data "terraform_remote_state" "gp-connect-pfs-access-record-infra" {
  backend = "s3"
  config  = {
    bucket = "${var.project_name}-infra-terraform-state"
    key    = "env://dev/state"
    region = "eu-west-2"
  }
}

locals {
  project_domain_name = data.terraform_remote_state.gp-connect-pfs-access-record-infra.outputs.zone_domain
  private_subnet_ids  = data.terraform_remote_state.gp-connect-pfs-access-record-infra.outputs.private_subnet_ids
  private_subnet_cidr = data.aws_subnet.private_subnets.*.cidr_block
  vpc_id = data.terraform_remote_state.gp-connect-pfs-access-record-infra.outputs.vpc_id
  alb_vpc_link_id  = data.terraform_remote_state.gp-connect-pfs-access-record-infra.outputs.alb_vpc_link_id
}

data "aws_subnet" "private_subnets" {
  count = length(local.private_subnet_ids)
  id    = local.private_subnet_ids[count.index]
}

output "service_domain_zone" {
  value = module.api.service_domain_zone
}
