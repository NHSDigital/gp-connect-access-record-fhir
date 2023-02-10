variable "region" {}

variable "name_prefix" {}

variable "image_version" {}

variable "cluster_id" {}

variable "container_port" {
}

locals {
  service_name        = "mock-provider"
}

variable "subnet_ids" {
  type = list(string)
}

variable "alb_tg_arn" {
}

data "aws_subnet" "public_subnets" {
  count = length(var.lb_subnet_ids)
  id    = var.lb_subnet_ids[count.index]
}

variable "lb_subnet_ids" {
  type = list(string)
}

variable "vpc_id" {}