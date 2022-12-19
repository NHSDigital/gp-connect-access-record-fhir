var queryString = context.getVariable("request.querystring")
var pathSuffix = context.getVariable("proxy.pathsuffix")

// First get the cache value, if null then, try foundEndpoint which is the ServiceCallout result
const endpoint = context.getVariable("endpoint") || context.getVariable("foundEndpoint")

if (endpoint) {
  context.setVariable("target.url", endpoint + pathSuffix + "?" + queryString)
} else {
  context.setVariable("endpointNotFound", true);
}
