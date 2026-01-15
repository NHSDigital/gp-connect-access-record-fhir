const subNHS = context.getVariable("nhsd.subject.nhs_number");

if (subNHS) {
    const httpverb = String(context.getVariable("request.verb")).toLowerCase();
    var requestNHS = null;
    if (httpverb === 'get') {
        let queryParams = context.getVariable("request.querystring");
        let normalizedParams = {};

        if (queryParams) {
            let pairs = queryParams.split("&");
            pairs.forEach(function(pair) {
                let parts = pair.split("=");
                if (parts.length === 2) {
                    normalizedParams[parts[0].toLowerCase()] = decodeURIComponent(parts[1]);
                }
            });
        }
        let queryNHSNumber = normalizedParams["patientnhsnumber"];
        if (queryNHSNumber) {
            requestNHS = String(queryNHSNumber).trim();
        }
        else {
            let pathSuffix = context.getVariable("proxy.pathsuffix");
            if (pathSuffix) {
                let parts = pathSuffix.split('/').filter(Boolean);
                requestNHS = parts.length ? parts[parts.length - 1] : null;
            }
        }
    }
    else if (httpverb === 'post') {
        let reqContent = context.getVariable("request.content");
        let validJSON = 'true';
        if (!reqContent) {
            validJSON = 'false';
            context.setVariable('trigger.raiseNHSNumberFault', true);
            let errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
        let jsonContent;
        try {
            jsonContent = JSON.parse(reqContent);
        } catch (e) {
            validJSON = 'false';
            context.setVariable('trigger.raiseNHSNumberFault', true);
            let errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
        if (!jsonContent.parameter || !Array.isArray(jsonContent.parameter)) {
            validJSON = 'false';
            context.setVariable('trigger.raiseNHSNumberFault', true);
            let errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
        if(validJSON === 'true') {
            for (let i = 0; i < jsonContent.parameter.length; i++) {
                let p = jsonContent.parameter[i];
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
        let errorObject = { error: 'invalid_token', errorDescription: "NHS ID could not be validated", statusCode: 401, reasonPhrase: "Unauthorized" };
        context.setVariable('validation.errorMessage', errorObject.error);
        context.setVariable('validation.errorDescription', errorObject.errorDescription);
        context.setVariable('validation.statusCode', errorObject.statusCode);
        context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
    }
}