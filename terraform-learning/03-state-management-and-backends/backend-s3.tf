# 1. Dedicated S3 Bucket for State Storage
resource "aws_s3_bucket" "terraform_state" {
  bucket        = "my-company-tfstate-storage-2026"
  force_destroy = false

  lifecycle {
    prevent_destroy = true # Safeguard: Never accidentally delete state!
  }

  tags = {
    Name        = "Terraform State Storage"
    Environment = "global"
  }
}

# 2. Enable S3 Bucket Versioning (Preserves State History)
resource "aws_s3_bucket_versioning" "state_versioning" {
  bucket = aws_s3_bucket.terraform_state.id
  versioning_configuration {
    status = "Enabled"
  }
}

# 3. Enable Server-Side Encryption (AES-256)
resource "aws_s3_bucket_server_side_encryption_configuration" "state_encryption" {
  bucket = aws_s3_bucket.terraform_state.id

  rule {
    apply_server_side_encryption_by_default {
      sse_algorithm = "AES256"
    }
  }
}

# 4. DynamoDB Table for Distributed State Locking
resource "aws_dynamodb_table" "terraform_locks" {
  name         = "terraform-state-locks"
  billing_mode = "PAY_PER_REQUEST"
  hash_key     = "LockID"

  attribute {
    name = "LockID"
    type = "S"
  }

  tags = {
    Name = "Terraform State Lock Table"
  }
}

# 5. Remote Backend Declaration
# Uncomment after the S3 bucket and DynamoDB table are provisioned:
# terraform {
#   backend "s3" {
#     bucket         = "my-company-tfstate-storage-2026"
#     key            = "production/infrastructure.tfstate"
#     region         = "us-east-1"
#     dynamodb_table = "terraform-state-locks"
#     encrypt        = true
#   }
# }
