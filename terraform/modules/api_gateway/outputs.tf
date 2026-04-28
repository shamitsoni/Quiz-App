output "http_api_id" {
  value = aws_apigatewayv2_api.http_api.id
}

output "http_api_url" {
  value = aws_apigatewayv2_stage.default_stage.invoke_url
}