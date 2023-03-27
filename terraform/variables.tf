variable "project_name" {
}

variable "service" {
  default = "mock-provider"
}

locals {
  root_domain = "dev.api.platform.nhs.uk"
}

locals {
  short_name          = "gcarf"
  environment         = terraform.workspace
  name_prefix         = "${var.project_name}-${var.service}-${local.environment}"
  short_name_prefix   = "${local.short_name}-${local.environment}"
  service_domain_name = "${local.environment}.${local.project_domain_name}"

  tags = {
    Project     = var.project_name
    Environment = local.environment
    Service     = var.service
  }
}

variable "region" {
  default = "eu-west-2"
}

variable "container_port" {
  default = 9000
}
variable "client_id" {}
variable "client_secret" {}
variable "keycloak_environment" {}
