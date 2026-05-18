variable "vpc_cidr_block" {
  description = "The CIDR block for the VPC."
  type        = string
  default     = "10.0.0.0/16"
}

variable "public_subnet_cidr_blocks" {
  description = "A list of CIDR blocks for the public subnets."
  type        = list(string)
}

variable "private_subnet_cidr_blocks" {
  description = "A list of CIDR blocks for the private subnets."
  type        = list(string)
}

variable "availability_zones" {
  description = "A list of availability zones for the subnets."
  type        = list(string)
}

variable "environment" {
  description = "The environment name (e.g., 'dev', 'prod')."
  type        = string
  default     = "dev"
}

variable "tags" {
  description = "A map of tags to assign to the resources."
  type        = map(string)
  default     = {}
}