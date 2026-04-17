terraform {
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 6.0"
    }
  }
}

provider "aws" {
  region = "us-east-1"
}

module "s3" {
  source = "./modules/s3"

  bucket_name = "ss-quiz-app-bucket"
  tags = {
    Project     = "quiz-app"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}

module "cloudfront" {
  source = "./modules/cloudfront"

  s3_bucket_arn                  = module.s3.bucket_arn
  s3_bucket_name                 = module.s3.bucket_name
  s3_bucket_regional_domain_name = module.s3.bucket_regional_domain_name
}

module "lambda" {
  source = "./modules/lambda"

  function_name = "quiz-backend-lambda"
  role_name = "lambda_execution_role"
  handler = "index.handler"
  runtime = "nodejs22.x"
  filename = "./modules/lambda/bootstrap/placeholder.zip"
  tags = {
    Environment = "dev"
  }
}

module "api_gateway" {
  source = "./modules/api_gateway"

  lambda_invoke_arn = module.lambda.lambda_invoke_arn
}