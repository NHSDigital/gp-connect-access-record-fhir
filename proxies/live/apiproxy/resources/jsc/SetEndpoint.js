const queryString = context.getVariable("request.querystring")
const pathSuffix = context.getVariable("proxy.pathsuffix")

const endpoint = context.getVariable("endpoint")

if (endpoint) {
  url = endpoint + pathSuffix
  if (queryString !== "") {
    url = url + queryString
  }
  context.setVariable("target.url", url)
} else {
  context.setVariable("endpointNotFound", true)
}
