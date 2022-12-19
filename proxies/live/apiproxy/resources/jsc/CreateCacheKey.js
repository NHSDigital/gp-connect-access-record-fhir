var ods = "REPC"
var interactionId = context.getVariable("request.header.Interaction-ID")

var key = ods + "_" + interactionId

context.setVariable("endpointKey", key)
