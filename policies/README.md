# CI/CD IAM Policies

This directory contains the JSON definitions for the IAM policies attached to the `github-actions-quiz-app-deployer` role.

This role is used by the GitHub Actions CI/CD pipeline to deploy the application's infrastructure via Terraform.

## Manual Setup

These policies are managed manually in the AWS Console as a one-time setup. They are stored here for documentation, versioning, and reproducibility. If the role needs to be recreated, use the JSON in these files to create the corresponding IAM policies.