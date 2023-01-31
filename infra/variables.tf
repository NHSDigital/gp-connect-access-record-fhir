locals {
    name_prefix = "${var.project}-${var.environment}"
}

variable "region" {
    default = "eu-west-2"
}

variable "project" {
    default = "gpconnect-infra"
}

variable "domain_name" {
    default = "dev.api.platform.nhs.uk"
}

variable "environment" {
    default = "dev"
}

variable "service" {
    default = "infra"
}

variable "registries" {
    default = ["mock-receiver"]
}
