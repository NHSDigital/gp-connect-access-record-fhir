const queryString = context.getVariable("request.querystring")
const pathSuffix = context.getVariable("proxy.pathsuffix")

const [protocol, endpoint] = context.getVariable("endpoint").split("://")

if (endpoint) {
  url = protocol + endpoint + pathSuffix
  if (queryString !== "") {
    url = url + queryString
  }
  context.setVariable("target.url", url)
  context.setVariable("endpoint", endpoint)
}
else {
  context.setVariable("endpointNotFound", true)
}
