variable "prefix" {}
variable "short_prefix" {}
variable "environment" {}
variable "zone_id" {}
variable "api_domain_name" {}
variable "lb" {
  type = object({
    alb_vpc_link_id  = string,
    listener_arn = string
  })
}
