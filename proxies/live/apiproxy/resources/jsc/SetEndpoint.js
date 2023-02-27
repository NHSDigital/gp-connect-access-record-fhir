const queryString = context.getVariable("request.querystring")
const pathSuffix = context.getVariable("proxy.pathsuffix")

const endpoint = context.getVariable("endpoint")

if (endpoint) {
  context.setVariable("target.url", endpoint + pathSuffix + queryString ? "?" + queryString : "")
} else {
  context.setVariable("endpointNotFound", true)
}
