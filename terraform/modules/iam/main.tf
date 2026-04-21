resource "aws_iam_user" "deployer" {
  name = var.user_name
}

resource "aws_iam_policy" "s3_policy" {
  name        = "${var.user_name}-s3-policy"
  description = "Policy for S3 bucket management"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          # Read permissions
          "s3:Get*",
          "s3:ListAllMyBuckets",
          "s3:ListBucket",
          
          # Write permissions
          "s3:CreateBucket",
          "s3:DeleteBucket",
          "s3:PutObject",
          "s3:DeleteObject",
          "s3:PutBucketTagging",
          "s3:PutBucketPolicy",
        ],
        Resource = [
          var.s3_bucket_arn,
          "${var.s3_bucket_arn}/*",
          "arn:aws:s3:::*"
        ]
      }
    ]
  })
}

resource "aws_iam_policy" "cloudfront_policy" {
  name        = "${var.user_name}-cloudfront-policy"
  description = "Policy for CloudFront management"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          # Read permissions
          "cloudfront:Get*",
          "cloudfront:List*",

          # Write permissions
          "cloudfront:CreateDistribution",
          "cloudfront:UpdateDistribution",
          "cloudfront:DeleteDistribution",
          "cloudfront:TagResource",
          "cloudfront:UntagResource",
          "cloudfront:CreateOriginAccessControl",
          "cloudfront:UpdateOriginAccessControl",
          "cloudfront:DeleteOriginAccessControl"
        ],
        Resource = "*"
      }
    ]
  })
}

resource "aws_iam_policy" "lambda_policy" {
  name        = "${var.user_name}-lambda-policy"
  description = "Policy for Lambda and IAM role management"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          "lambda:CreateFunction",
          "lambda:UpdateFunctionCode",
          "lambda:UpdateFunctionConfiguration",
          "lambda:DeleteFunction",
          "lambda:GetFunction",
          "lambda:ListFunctions",
          "lambda:AddPermission",
          "lambda:RemovePermission",
          "lambda:ListVersionsByFunction",
          "lambda:GetFunctionCodeSigningConfig",
          "lambda:GetPolicy" 
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
          "iam:CreateRole",
          "iam:GetRole",
          "iam:DeleteRole",
          "iam:AttachRolePolicy",
          "iam:DetachRolePolicy",
          "iam:PutRolePolicy",
          "iam:ListAttachedRolePolicies",
          "iam:ListRolePolicies",
          "iam:PassRole",
          "iam:GetUser",
          "iam:GetPolicy",
          "iam:ListPolicies",
          "iam:GetPolicyVersion",
          "iam:ListAttachedUserPolicies"
        ],
        Resource = "*"
      },
      {
        Effect = "Allow",
        Action = [
            "logs:CreateLogGroup",
            "logs:CreateLogStream",
            "logs:PutLogEvents"
        ],
        Resource = "arn:aws:logs:*:*:*"
      }
    ]
  })
}

resource "aws_iam_policy" "api_gateway_policy" {
  name        = "${var.user_name}-apigateway-policy"
  description = "Policy for API Gateway v2 management"
  policy = jsonencode({
    Version = "2012-10-17",
    Statement = [
      {
        Effect = "Allow",
        Action = [
          # Permissions to manage APIs
          "apigateway:CreateApi",
          "apigateway:GetApi",
          "apigateway:UpdateApi",
          "apigateway:DeleteApi",
          "apigateway:GetApis",

          # Permissions to manage routes
          "apigateway:CreateRoute",
          "apigateway:GetRoute",
          "apigateway:UpdateRoute",
          "apigateway:DeleteRoute",
          "apigateway:GetRoutes",

          # Permissions to manage integrations
          "apigateway:CreateIntegration",
          "apigateway:GetIntegration",
          "apigateway:UpdateIntegration",
          "apigateway:DeleteIntegration",
          "apigateway:GetIntegrations",

          # Permissions to manage stages and deployments
          "apigateway:CreateStage",
          "apigateway:GetStage",
          "apigateway:UpdateStage",
          "apigateway:DeleteStage",
          "apigateway:GetStages",
          "apigateway:CreateDeployment",
          "apigateway:GetDeployment",
          "apigateway:UpdateDeployment",
          "apigateway:DeleteDeployment",
          "apigateway:GetDeployments",

          # General read permission
          "apigateway:GET"
        ],
        Resource = "arn:aws:apigateway:*::/apis*"
      }
    ]
  })
}

resource "aws_iam_user_policy_attachment" "s3" {
  user       = aws_iam_user.deployer.name
  policy_arn = aws_iam_policy.s3_policy.arn
}

resource "aws_iam_user_policy_attachment" "cloudfront" {
  user       = aws_iam_user.deployer.name
  policy_arn = aws_iam_policy.cloudfront_policy.arn
}

resource "aws_iam_user_policy_attachment" "lambda" {
  user       = aws_iam_user.deployer.name
  policy_arn = aws_iam_policy.lambda_policy.arn
}

resource "aws_iam_user_policy_attachment" "api_gateway" {
  user       = aws_iam_user.deployer.name
  policy_arn = aws_iam_policy.api_gateway_policy.arn
}