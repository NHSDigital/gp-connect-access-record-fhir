var ods = context.getVariable("jwt.DecodeJWT.DecodeIDToken.claim.ods_code")
var interactionId = context.getVariable("request.header.Interaction-ID")

var key = ods + "_" + interactionId

context.setVariable("endpointKey", key)
context.setVariable("endpointConfigKey", ods)

var GPCAuthinteractionId = properties.KeyforGPCAuth

var key2 = ods + "_" + GPCAuthinteractionId

context.setVariable("KeyforGPCAuth", key2)