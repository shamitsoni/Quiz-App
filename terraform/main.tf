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
  handler = "server.handler"
  runtime = "nodejs22.x"
  filename = "./modules/lambda/bootstrap/placeholder.zip"

  region = "us-east-1"
  api_gateway_http_api_id = module.api_gateway.http_api_id

  tags = {
    Environment = "dev"
  }
}

module "api_gateway" {
  source = "./modules/api_gateway"

  lambda_invoke_arn = module.lambda.lambda_invoke_arn
}

module "vpc" {
  source = "./modules/vpc"

  vpc_cidr_block           = "10.0.0.0/16"
  public_subnet_cidr_blocks  = ["10.0.1.0/24", "10.0.2.0/24"]
  private_subnet_cidr_blocks = ["10.0.3.0/24", "10.0.4.0/24"]
  availability_zones       = ["us-east-1a", "us-east-1b"]

  environment = "dev"
  tags = {
    Project     = "quiz-app"
    ManagedBy   = "terraform"
  }
}