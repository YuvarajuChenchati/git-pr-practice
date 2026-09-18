provider "aws" {
  region = "us-east-1"
}

# Development Environment VPC
module "dev_vpc" {
  source      = "./modules/vpc"
  vpc_name    = "dev-vpc"
  cidr_block  = "10.0.0.0/16"
  environment = "development"
}

# Production Environment VPC
module "production_vpc" {
  source      = "./modules/vpc"
  vpc_name    = "production-vpc"
  cidr_block  = "10.100.0.0/16"
  environment = "production"
}
