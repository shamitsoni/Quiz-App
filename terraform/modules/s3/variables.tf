variable "bucket_name" {
  type        = string
  description = "Name to provide for the S3 bucket"
}

variable "tags" {
  type        = map(string)
  default     = {}
  description = "Tags to attach to the S3 bucket"
}