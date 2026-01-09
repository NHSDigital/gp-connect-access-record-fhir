// ---- Debug (trace only) ----
print("nhsd.actor.nhs_number   : " + context.getVariable("nhsd.actor.nhs_number"));
print("nhsd.subject.nhs_number : " + context.getVariable("nhsd.subject.nhs_number"));

var topClaims = context.getVariable('jwt.actClaim'); // JSON string if VerifyJWT set <OutputClaimVariables/>
print("topClaims  :" + topClaims)
var claims = topClaims ? JSON.parse(topClaims) : {};
print("claims : " + claims.act);
var hasAct = !!claims.act;
print("hasAct : " + hasAct);

if (hasAct) {
    // ---- Subject NHS number (from composite ID shared flow) ----
    var subNHS = context.getVariable("nhsd.subject.nhs_number");
    subNHS = String(subNHS).trim();

    // ---- HTTP Verb ----
    var httpverb = context.getVariable("request.verb");
    var requestNHS = null;

    if (httpverb === 'GET') {
        var queryNHSNumber = context.getVariable("request.queryparam.patientNHSNumber");
        if (queryNHSNumber) {
            requestNHS = String(queryNHSNumber).trim();
            print("NHS from query: " + requestNHS);
        }
        else {
            var pathSuffix = context.getVariable("proxy.pathsuffix");
            if (pathSuffix) {
                var parts = pathSuffix.split('/').filter(Boolean);
                requestNHS = parts.length ? parts[parts.length - 1] : null;
                print("NHS from route: " + requestNHS);
            }
        }
    }
    else if (httpverb === 'POST') {
        var reqContent = context.getVariable("request.content");
        if (!reqContent) {
            //raiseNHSFault("Request body missing");
            //return;
        }
        var jsonContent;
        try {
            jsonContent = JSON.parse(reqContent);
        } catch (e) {
            //raiseNHSFault("Invalid JSON payload");
            //return;
        }
        if (!jsonContent.parameter || !Array.isArray(jsonContent.parameter)) {
            //raiseNHSFault("Invalid Parameters structure");
            //return;
        }
        for (var i = 0; i < jsonContent.parameter.length; i++) {
            var p = jsonContent.parameter[i];
            if ( p.name === "patientNHSNumber" && p.valueIdentifier && p.valueIdentifier.value ) {
                requestNHS = String(p.valueIdentifier.value).trim();
                break;
            }
        }
    }
    if (requestNHS && requestNHS !== subNHS) {
        context.setVariable('trigger.raiseNHSNumberFault', true);
        var errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
        context.setVariable('validation.errorMessage', errorObject.error);
        context.setVariable('validation.errorDescription', errorObject.errorDescription);
        context.setVariable('validation.statusCode', errorObject.statusCode);
        context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
    }
}