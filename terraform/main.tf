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

resource "aws_s3_bucket" "frontend-bucket" {
  bucket = "ss-quiz-app-bucket"

  tags = {
    Project     = "quiz-app"
    Environment = "dev"
    ManagedBy   = "terraform"
  }
}