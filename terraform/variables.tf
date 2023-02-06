variable "project" {
  default = "gp-connect-pfs-access-record"
}

variable "service" {
  default = "mock-provider"
}

locals {
  root_domain = "dev.api.platform.nhs.uk"
}

locals {
  environment         = terraform.workspace
  name_prefix         = "${var.project}-${var.service}-${local.environment}"
  service_domain_name = "${local.environment}.${local.project_domain_name}"

  tags = {
    Project     = var.project
    Environment = local.environment
    Service     = var.service
  }
}
