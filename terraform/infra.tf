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
}
