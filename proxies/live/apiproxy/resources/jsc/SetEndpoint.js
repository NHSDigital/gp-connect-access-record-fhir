const queryString = context.getVariable("request.querystring")
const pathSuffix = context.getVariable("proxy.pathsuffix")

const endpoint = context.getVariable("endpoint")
// Needed so we can pass the endpoint to a service callout
const endpoint_no_protocol = endpoint.split("://")[1]
context.setVariable("endpoint_no_protocol", endpoint_no_protocol)

if (endpoint) {
  url = endpoint + pathSuffix
  if (queryString !== "") {
    url = url + queryString
  }
  context.setVariable("target.url", url)
} else {
  context.setVariable("endpointNotFound", true)
}
