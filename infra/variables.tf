variable "project_name" {}
variable "project_short_name" {}

locals {
    project_name = "${var.project_name}-infra"
    prefix = "${local.project_name}-${var.environment}"
    short_prefix = "${var.project_short_name}-${var.environment}"
    validation_ecr_name = "gpconnect-${var.service}-${var.environment}-token-validation-lambda"
}

locals {
    vpc_cidr = "10.0.0.0/16"
}
locals {
    private_subnet_cidr = [for subnet in local.private_subnet : subnet.cidr]
    public_subnet_cidr  = [for subnet in local.public_subnet : subnet.cidr]
}

locals {
    public_subnet = [
        {
            cidr              = cidrsubnet(local.vpc_cidr, 8, 0)
            availability_zone = "eu-west-2a"
            is_public         = true
        }, {
            cidr              = cidrsubnet(local.vpc_cidr, 8, 1)
            availability_zone = "eu-west-2b"
            is_public         = true
        }, {
            cidr              = cidrsubnet(local.vpc_cidr, 8, 2)
            availability_zone = "eu-west-2c"
            is_public         = true
        }
    ]
    private_subnet = [
        {
            cidr              = cidrsubnet(local.vpc_cidr, 8, 32)
            availability_zone = "eu-west-2a"
            is_public         = false
        }, {
            cidr              = cidrsubnet(local.vpc_cidr, 8, 33)
            availability_zone = "eu-west-2b"
            is_public         = false
        }, {
            cidr              = cidrsubnet(local.vpc_cidr, 8, 34)
            availability_zone = "eu-west-2c"
            is_public         = false
        }
    ]
}


variable "region" {
    default = "eu-west-2"
}

variable "project_name" {}

variable "root_domain_name" {
    default = "dev.api.platform.nhs.uk"
}

variable "environment" {
    default = "dev"
}


variable "service" {
    default = "infra"
}

variable "registries" {
    default = ["mock-provider"]
}


variable "autoscaling_group_name" {
    default = "target-autoscaling-group"
}

variable "container_port" {
    default = 9000
}

variable "listener_port" {
    default = 80
}
