var endpoints = JSON.parse(context.getVariable("endpoints").content)
var endpointKey = context.getVariable("endpointKey")

var endpoint = endpoints[endpointKey]
context.setVariable("fetchedEndpoint", endpoint)
