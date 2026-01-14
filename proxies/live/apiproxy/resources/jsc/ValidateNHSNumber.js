//print("nhsd.actor.nhs_number   : " + context.getVariable("nhsd.actor.nhs_number"));
//print("nhsd.subject.nhs_number : " + context.getVariable("nhsd.subject.nhs_number"));

var subNHS = context.getVariable("nhsd.subject.nhs_number");

if (subNHS) {
    var httpverb = String(context.getVariable("request.verb")).toLowerCase();
    var requestNHS = null;

    if (httpverb === 'get') {
        var queryParams = context.getVariable("request.querystring");
        //print(queryParams);
        var normalizedParams = {};

        if (queryParams) {
            var pairs = queryParams.split("&");
            pairs.forEach(function(pair) {
                var parts = pair.split("=");
                if (parts.length === 2) {
                    normalizedParams[parts[0].toLowerCase()] = decodeURIComponent(parts[1]);
                }
            });
        }
        var queryNHSNumber = normalizedParams["patientnhsnumber"];
        if (queryNHSNumber) {
            requestNHS = String(queryNHSNumber).trim();
            //print("NHS from query: " + requestNHS);
        }
        else {
            var pathSuffix = context.getVariable("proxy.pathsuffix");
            if (pathSuffix) {
                var parts = pathSuffix.split('/').filter(Boolean);
                requestNHS = parts.length ? parts[parts.length - 1] : null;
                //print("NHS from route: " + requestNHS);
            }
        }
    }
    else if (httpverb === 'post') {
        var reqContent = context.getVariable("request.content");
        var validJSON = 'true';
        if (!reqContent) {
            validJSON = 'false';
            context.setVariable('trigger.raiseNHSNumberFault', true);
            var errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
        var jsonContent;
        try {
            jsonContent = JSON.parse(reqContent);
        } catch (e) {
            validJSON = 'false';
            context.setVariable('trigger.raiseNHSNumberFault', true);
            var errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
        if (!jsonContent.parameter || !Array.isArray(jsonContent.parameter)) {
            validJSON = 'false';
            context.setVariable('trigger.raiseNHSNumberFault', true);
            var errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
        if(validJSON === 'true') {
            for (var i = 0; i < jsonContent.parameter.length; i++) {
                var p = jsonContent.parameter[i];
                if ( p.name === "patientNHSNumber" && p.valueIdentifier && p.valueIdentifier.value ) {
                    requestNHS = String(p.valueIdentifier.value).trim();
                    break;
                }
            }
        }
    }
    requestNHS = requestNHS.trim();
    if(requestNHS !== subNHS) {
        context.setVariable('trigger.raiseNHSNumberFault', true);
        var errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
        context.setVariable('validation.errorMessage', errorObject.error);
        context.setVariable('validation.errorDescription', errorObject.errorDescription);
        context.setVariable('validation.statusCode', errorObject.statusCode);
        context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
    }
}