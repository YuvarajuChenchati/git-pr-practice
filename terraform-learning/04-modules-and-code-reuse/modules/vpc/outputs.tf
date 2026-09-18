output "vpc_id" {
  description = "ID of created VPC"
  value       = aws_vpc.this.id
}

output "public_subnet_id" {
  description = "ID of created public subnet"
  value       = aws_subnet.public.id
}
