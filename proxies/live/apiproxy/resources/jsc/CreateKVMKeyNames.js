var ods = context.getVariable("jwt.DecodeJWT.DecodeIDToken.claim.ods_code")
var interactionId = context.getVariable("request.header.Interaction-ID")

var endpointKey = ods + "_" + interactionId
var endpointConfigEncryptedKey= ods + "_private_key"


context.setVariable("endpointKey", endpointKey)
context.setVariable("endpointConfigKey", ods)
context.setVariable("endpointConfigEncryptedKey", endpointConfigEncryptedKey)

var GPCAuthinteractionId = properties.GPCAuthInteractionId

var KeyforGPCAuth = ods + "_" + GPCAuthinteractionId

context.setVariable("GPCAuthKey", KeyforGPCAuth)