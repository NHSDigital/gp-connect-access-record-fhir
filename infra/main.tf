terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 4"
    }
  }

  backend "s3" {
    key = "state"
    region = "eu-west-2"
  }
}

provider "aws" {
  region  = "eu-west-2"
  profile = "apim-dev"

  default_tags {
    tags = {
      project     = "${var.project_name}-infra"
      environment = var.environment
      tier        = "infrastructure"
    }
  }
}
