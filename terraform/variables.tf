variable "project" {
  default = "gpconnectpfs"
}

variable "service" {
  default = "mock-provider"
}

variable "domain_name" {
  default = "gpconnectpfs.dev.api.platform.nhs.uk"
}

locals {
  environment         = terraform.workspace
  name_prefix         = "${var.project}-${var.service}-${local.environment}"
  service_domain_name = "${local.environment}.${var.domain_name}"

tags = {
    Project     = var.project
    Environment = local.environment
    Service     = var.service
    }
}