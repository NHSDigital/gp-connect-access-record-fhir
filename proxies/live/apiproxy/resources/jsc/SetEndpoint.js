var queryString = context.getVariable("request.querystring")
var pathSuffix = context.getVariable("proxy.pathsuffix")
var endpoint = context.getVariable("foundEndpoint")

context.setVariable("target.url", endpoint + pathSuffix + "?" + queryString);
