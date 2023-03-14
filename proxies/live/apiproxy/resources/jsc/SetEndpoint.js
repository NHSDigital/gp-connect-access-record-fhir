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

print("==========endpointConfig==================")
var endpointConfig=context.getVariable("private.config")
print(endpointConfig)


const parsedEndpointConfig = json_tryparse(endpointConfig)

print("==========parsedEndpointConfig===================")
print(parsedEndpointConfig)

print("==========Oauth2==================")
Oauth2Config=parsedEndpointConfig["oauth2"]
print(Oauth2Config)


print("==========clientid==================")
context.setVariable("client_id_config",Oauth2Config["client_id"])
context.setVariable("kid_config",Oauth2Config["kid"])
context.setVariable("audience_config",Oauth2Config["audience"])
context.setVariable("subject_issuer_config",Oauth2Config["subject_issuer"])
context.setVariable("private2.jwt",Oauth2Config["private_key"])

print(context.getVariable("client_id_config"))
print(context.getVariable("kid_config"))
print(context.getVariable("audience_config"))
print(context.getVariable("subject_issuer_config"))
print(context.getVariable("private2.jwt")) 


var fs = require('fs');
var path = context.getVariable('private2.jwt');
var content = fs.readFileSync(path, 'utf8');
context.setVariable('fileContent', content);
print("==========PrivateKEy Content==================")
print(context.getVariable('fileContent'));