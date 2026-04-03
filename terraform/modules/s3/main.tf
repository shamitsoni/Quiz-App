resource "aws_s3_bucket" "frontend-bucket" {
  bucket = var.bucket_name
  tags   = var.tags
}