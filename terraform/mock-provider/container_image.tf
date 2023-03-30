data "archive_file" "specification_archive" {
  type        = "zip"
  source_dir  = "${path.cwd}/../specification"
  output_path = "build/specification.zip"
}

data "archive_file" "prism_archive" {
  type        = "zip"
  source_dir  = "${path.cwd}/../PrismMockProvider"
  output_path = "build/PrismMockProvider.zip"
}

data "aws_caller_identity" "current" {}

resource "null_resource" "mock-provider_image_push" {
  triggers   = {
    specification_src = data.archive_file.specification_archive.output_sha
    prism_src = data.archive_file.prism_archive.output_sha
  }

  provisioner "local-exec" {
    command = <<EOF
           make docker-deploy
       EOF
  }
}
