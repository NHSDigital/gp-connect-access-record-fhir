var ods = "REPC"
var interactionId = context.getVariable("request.headers")["Interaction-ID"]//"IN150016UK05"
var key = ods + "_" + interactionId

context.setVariable("endpointKey", key)
