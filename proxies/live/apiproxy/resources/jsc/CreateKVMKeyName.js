var ods = "REPC"
var interactionId = context.getVariable("request.header.Interaction-ID")

var key = ods + "_" + interactionId

context.setVariable("endpointKey", key)

var GPCAuthinteractionId = properties.KeyforGPCAuth

var key2 = ods + "_" + GPCAuthinteractionId

context.setVariable("KeyforGPCAuth", key2)