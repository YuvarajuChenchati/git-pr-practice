output "vpc_id" {
  description = "Unique Identifier of the provisioned AWS VPC"
  value       = aws_vpc.production_vpc.id
}

output "vpc_cidr_block" {
  description = "CIDR range assigned to the VPC"
  value       = aws_vpc.production_vpc.cidr_block
}

output "web_security_group_id" {
  description = "ID of the web traffic security group"
  value       = aws_security_group.web_traffic.id
}
