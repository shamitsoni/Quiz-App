output "bucket_id" {
  value       = aws_s3_bucket.frontend-bucket.id
  description = "The ID of the S3 bucket"
}

output "bucket_arn" {
  value       = aws_s3_bucket.frontend-bucket.arn
  description = "The ARN of the S3 bucket"
}   