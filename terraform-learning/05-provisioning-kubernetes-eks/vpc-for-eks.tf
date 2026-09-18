# Dedicated VPC for AWS EKS
resource "aws_vpc" "eks_vpc" {
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true

  tags = {
    Name                                           = "eks-production-vpc"
    "kubernetes.io/cluster/production-eks-cluster" = "shared"
  }
}

# Public Subnet 1 (us-east-1a)
resource "aws_subnet" "public_1" {
  vpc_id                  = aws_vpc.eks_vpc.id
  cidr_block              = "10.0.1.0/24"
  availability_zone       = "us-east-1a"
  map_public_ip_on_launch = true

  tags = {
    Name                                           = "eks-public-1"
    "kubernetes.io/cluster/production-eks-cluster" = "shared"
    "kubernetes.io/role/elb"                       = "1" # Required for Public Ingress ALBs
  }
}

# Private Subnet 1 (us-east-1a - Where Worker Nodes Live!)
resource "aws_subnet" "private_1" {
  vpc_id            = aws_vpc.eks_vpc.id
  cidr_block        = "10.0.10.0/24"
  availability_zone = "us-east-1a"

  tags = {
    Name                                           = "eks-private-1"
    "kubernetes.io/cluster/production-eks-cluster" = "shared"
    "kubernetes.io/role/internal-elb"              = "1" # Required for Internal Services
  }
}
