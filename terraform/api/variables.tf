variable "name_prefix" {}
variable "short_name_prefix" {}
variable "environment" {}
variable "zone_id" {}
variable "api_domain_name" {}
variable "lb" {
  type = object({
    vpc_link_id  = string,
    listener_arn = string
  })
}
variable "client_id" {}
variable "client_secret" {}
variable "keycloak_environment" {}
