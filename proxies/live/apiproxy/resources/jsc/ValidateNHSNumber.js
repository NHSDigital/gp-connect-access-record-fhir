const subNHS = context.getVariable("nhsd.subject.nhs_number");

if (subNHS) {
    const httpverb = String(context.getVariable("request.verb")).toLowerCase();
    const errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
    var requestNHS = null;
    if (httpverb === 'get') {
        const queryParams = context.getVariable("request.querystring");
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
        const queryNHSNumber = normalizedParams["patientnhsnumber"];
        if (queryNHSNumber) {
            requestNHS = String(queryNHSNumber).trim();
        }
        else {
            const pathSuffix = context.getVariable("proxy.pathsuffix");
            if (pathSuffix) {
                var parts = pathSuffix.split('/').filter(Boolean);
                requestNHS = parts.length ? parts[parts.length - 1] : null;
            }
        }
    }
    else if (httpverb === 'post') {
        const reqContent = context.getVariable("request.content");
        var validJSON = 'true';
        if (!reqContent) {
            validJSON = 'false';
            context.setVariable('trigger.raiseNHSNumberFault', true);
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
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
        if (!jsonContent.parameter || !Array.isArray(jsonContent.parameter)) {
            validJSON = 'false';
            context.setVariable('trigger.raiseNHSNumberFault', true);
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
        context.setVariable('validation.errorMessage', errorObject.error);
        context.setVariable('validation.errorDescription', errorObject.errorDescription);
        context.setVariable('validation.statusCode', errorObject.statusCode);
        context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
    }
}