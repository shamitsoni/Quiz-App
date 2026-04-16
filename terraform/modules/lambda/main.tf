data "aws_iam_policy_document" "assume_role" {
  statement {
    effect = "Allow"

    principals {
      type        = "Service"
      identifiers = ["lambda.amazonaws.com"]
    }

    actions = ["sts:AssumeRole"]
  }
}

resource "aws_iam_role" "lambda_execution" {
  name               = "lambda_execution_role"
  assume_role_policy = data.aws_iam_policy_document.assume_role.json
}

resource "aws_lambda_function" "example" {
  function_name = "quiz-backend-lambda"
  role          = aws_iam_role.lambda_execution.arn

  handler = "index.handler"
  runtime = "nodejs22.x"

  filename = "${path.module}/bootstrap/placeholder.zip"

  environment {
    variables = {
      ENVIRONMENT = "production"
      LOG_LEVEL   = "info"
    }
  }

  tags = {
    Environment = "production"
    Application = "example"
  }

  lifecycle {
    ignore_changes = [
        filename
    ]
  }

}