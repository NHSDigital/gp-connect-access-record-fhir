resource "aws_iam_role" "task_role" {
  name               = "${var.short_name_prefix}-task-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role" "task_execution_role" {
  name               = "${var.short_name_prefix}-execution-role"
  assume_role_policy = <<EOF
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Action": "sts:AssumeRole",
      "Principal": {
        "Service": "ecs-tasks.amazonaws.com"
      },
      "Effect": "Allow",
      "Sid": ""
    }
  ]
}
EOF
}

resource "aws_iam_role_policy" "main_ecs_tasks" {
  name = "${var.name_prefix}-policy"
  role = aws_iam_role.task_execution_role.id

  policy = <<EOF
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Effect": "Allow",
            "Action": [
                "s3:Get*",
                "s3:List*"
            ],
            "Resource": ["*"]
        },
        {
            "Effect": "Allow",
            "Resource": [
              "*"
            ],
            "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchCheckLayerAvailability",
                "ecr:GetDownloadUrlForLayer",
                "ecr:BatchGetImage",
                "logs:CreateLogStream",
                "logs:PutLogEvents",
                "logs:CreateLogGroup",
                "logs:DescribeLogStreams"
            ]
        }
    ]

}
EOF
}

resource "aws_iam_role" lambda_role {
  name = "${var.short_name_prefix}-lambda-role"
  assume_role_policy = <<EOF
    {
      "Version": "2012-10-17",
      "Statement": [
        {
          "Action": "sts:AssumeRole",
          "Principal": {
            "Service": "lambda.amazonaws.com"
          },
          "Effect": "Allow",
          "Sid": ""
        }
      ]
    }
    EOF
}

data aws_iam_policy_document lambda_policy_doc {
  statement {
    actions = [
        "logs:CreateLogGroup",
        "logs:CreateLogStream",
        "logs:PutLogEvents"
    ]
    effect = "Allow"
    resources = [ "*" ]
    sid = "CreateCloudWatchLogs"
  }

  statement {
    actions = [
        "codecommit:GitPull",
        "codecommit:GitPush",
        "codecommit:GitBranch",
        "codecommit:ListBranches",
        "codecommit:CreateCommit",
        "codecommit:GetCommit",
        "codecommit:GetCommitHistory",
        "codecommit:GetDifferences",
        "codecommit:GetReferences",
        "codecommit:BatchGetCommits",
        "codecommit:GetTree",
        "codecommit:GetObjectIdentifier",
        "codecommit:GetMergeCommit"
    ]
    effect = "Allow"
    resources = [ "*" ]
    sid = "CodeCommit"
  }
}

resource aws_iam_policy lambda {
  name = "${var.short_name_prefix}-lambda-policy"
  path = "/"
  policy = data.aws_iam_policy_document.lambda_policy_doc.json
}
