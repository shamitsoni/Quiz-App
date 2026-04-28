variable "function_name" {
    description = "The name of the lambda function"
    type = string
}   

variable role_name {
    description = "The name of the IAM role for the lambda function"
    type = string
}

variable handler {
    description = "The entry point of the lambda function"
    type = string
}

variable runtime {
    description = "The runtime type and version for the lambda function"
    type = string
}

variable "filename" {
    description = "The filename of the lambda deployment package"
    type = string
}

variable "tags" {
  description = "The tags for the lambda function"
  type        = map(string)
}

variable "region" {
  description = "The AWS region"
  type        = string
}

variable "api_gateway_http_api_id" {
  description = "The ID of the API Gateway HTTP API"
  type        = string
}