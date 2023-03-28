# NOTE: mock-provider is the same as sandbox

data "archive_file" "mock_provider_archive" {
  type        = "zip"
  source_dir  = "${path.cwd}/../specification"
  output_path = "build/specification"
}

resource "null_resource" "mock_provider_image_push" {
  depends_on = [data.aws_ecr_repository.mock_provider_registry]
  triggers   = {
    src_hash = data.archive_file.mock_provider_archive.output_sha
  }

  provisioner "local-exec" {
    command = <<EOF
           aws ecs update-service --cluster ${var.name_prefix} --service ${var.name_prefix} --force-new-deployment --region eu-west-2 
       EOF
  }
}
