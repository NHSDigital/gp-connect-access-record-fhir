const queryString = context.getVariable("request.querystring")
const pathSuffix = context.getVariable("proxy.pathsuffix")
const endpoint = context.getVariable("endpoint")

//Parsing hostname and pathname from given url
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

  // Set the endpoint for validating the GPC access token.
  var validation_url = context.getVariable("request.header.validation-url").replace("https://", "")
  // A specific validation endpoint can be specified by passing a Validation-URL header in the request,
  // in our case this is a /validate endpoint on the mock receiver, which we fall back to when no header is passed.
  if (!validation_url) {
    validation_url = url.replace("https://", "") + "/validate"
  }
  // We remove the protocol from the URL because we're using an Apigee ServiceCallout policy to validate the token
  // against the validation endpoint, this policy requires us to explicitly state the protocol outside of any
  // flow variables or templating.
  context.setVariable("validation_endpoint", validation_url)

} else {
  context.setVariable("endpointNotFound", true)
}




function json_tryparse(raw) {
  try {
      return JSON.parse(raw);
  }
  catch (e) {
      return raw;
  }
}

var endpointConfig=context.getVariable("private.config")
const parsedEndpointConfig = json_tryparse(endpointConfig)

Oauth2Config=parsedEndpointConfig["oauth2"]

context.setVariable("client_id_config",Oauth2Config["client_id"])
context.setVariable("kid_config",Oauth2Config["kid"])
context.setVariable("audience_config",Oauth2Config["audience"])
context.setVariable("subject_issuer_config",Oauth2Config["subject_issuer"])


