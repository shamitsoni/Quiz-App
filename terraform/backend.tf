terraform {
  backend "s3" {
    bucket         = "ss-quiz-app-terraform-state"
    key            = "global/terraform.tfstate"
    region         = "us-east-1"
    dynamodb_table = "quiz-app-terraform-state-lock"
  }
}