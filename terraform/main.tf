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
