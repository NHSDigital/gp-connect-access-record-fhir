/* Use infra terraform state to populate infra outputs.
We use the infra state file to read the outputs and then reassign them to local names
*/

data "terraform_remote_state" "gp-connect-pfs-access-record-infra" {
  backend = "s3"
  config  = {
    bucket = "terraform-nhsd-apim-bebop-gpconnect-accessrecord-infra"
    key    = "env://dev/infra"
    region = "eu-west-2"
  }
}

locals {
  project_domain_name = data.terraform_remote_state.gp-connect-pfs-access-record-infra.outputs.zone_domain
  public_subnet_ids   = data.terraform_remote_state.gp-connect-pfs-access-record-infra.outputs.public_subnet_ids
  private_subnet_ids  = data.terraform_remote_state.gp-connect-pfs-access-record-infra.outputs.private_subnet_ids
  public_subnet_cidr  = data.aws_subnet.public_subnets.*.cidr_block
  private_subnet_cidr = data.aws_subnet.private_subnets.*.cidr_block
  vpc_id = data.terraform_remote_state.gp-connect-pfs-access-record-infra.outputs.vpc_id
  vpc_link_id  = data.terraform_remote_state.gp-connect-pfs-access-record-infra.outputs.vpc_link_id
}

data "aws_subnet" "public_subnets" {
  count = length(local.public_subnet_ids)
  id    = local.public_subnet_ids[count.index]
}

data "aws_subnet" "private_subnets" {
  count = length(local.private_subnet_ids)
  id    = local.private_subnet_ids[count.index]
}