resource "aws_api_gateway_rest_api" "rest_api" {
    name = "quiz-rest-api"
}

resource "aws_api_gatewaya_resource" "api_resource" {
    rest_api_id = aws_api_gateway_rest_api.rest_api.id
    parent_id   = aws_api_gateway_rest_api.rest_api.root_resource_id
    path_part   = "quiz-rest-api-resource"
}

resource "aws_api_gateway_method" "api_method" {
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  resource_id   = aws_api_gateway_resource.rest_api.id
  http_method   = "POST"
  authorization = "NONE"
}

resource "aws_api_gateway_integration" "api_integration" {
  rest_api_id          = aws_api_gateway_rest_api.rest_api.id
  resource_id          = aws_api_gateway_resource.api_resource.id
  http_method          = aws_api_gateway_method.api_method.http_method
  type                 = "AWS_PROXY"
  integration_http_method = "POST"
  uri = var.lambda_invoke_arn
}

resource "aws_api_gateway_deployment" "api_deployment" {
  rest_api_id = aws_api_gateway_rest_api.rest_api.id
}

resource "aws_api_gateway_stage" "api_stage" {
  deployment_id = aws_api_gateway_deployment.api_deployment.id
  rest_api_id   = aws_api_gateway_rest_api.rest_api.id
  stage_name    = "dev"
}