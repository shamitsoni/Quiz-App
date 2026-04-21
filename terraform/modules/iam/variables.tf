variable "user_name" {
  description = "The name of the IAM user for Terraform deployment."
  type        = string
  default     = "quiz-app-deployer"
}

variable "s3_bucket_arn" {
  description = "The ARN of the S3 bucket."
  type        = string
}