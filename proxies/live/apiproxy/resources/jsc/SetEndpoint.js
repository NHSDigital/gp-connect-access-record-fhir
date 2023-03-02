const queryString = context.getVariable("request.querystring")
const pathSuffix = context.getVariable("proxy.pathsuffix")
const endpoint = context.getVariable("endpoint")
function parseURL(href) {
    var match = href.match(/^(https?\:)\/\/(([^:\/?#]*)(?:\:([0-9]+))?)([\/]{0,1}[^?#]*)(\?[^#]*|)(#.*|)$/);
    return match && {
        hostname: match[3],
        pathname: match[5]
    }
}

var values=parseURL(context.getVariable("EndpointforGPCAuth"));
context.setVariable("GPCAuthHostname",values["hostname"])
context.setVariable("GPCAuthHostpath",values["pathname"])

if (endpoint) {
  url = endpoint + pathSuffix
  if (queryString !== "") {
    url = url + queryString
  }
  context.setVariable("target.url", url)
} else {
  context.setVariable("endpointNotFound", true)
}
