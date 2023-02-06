resource "aws_apigatewayv2_api"  "service_api"  {
  name                         = "${var.name_prefix}-api"
  description                  = "GP Connect PFS Acces Record mock-provider service backend api - ${var.environment}"
  protocol_type                = "HTTP"
  disable_execute_api_endpoint = true
}

resource "aws_apigatewayv2_domain_name" "service_api_domain_name" {
  domain_name = var.api_domain_name

  domain_name_configuration {
    certificate_arn = aws_acm_certificate.service_certificate.arn
    endpoint_type   = "REGIONAL"
    security_policy = "TLS_1_2"
  }

  tags = {
    Name = "${var.name_prefix}-api-domain-name"
  }
}

locals {
  api_stage_name = var.environment
}
