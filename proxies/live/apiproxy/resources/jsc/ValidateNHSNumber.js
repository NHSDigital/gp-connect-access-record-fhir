print("nhsd.actor.nhs_number NUM   : " + context.getVariable("nhsd.actor.nhs_number"));
print("nhsd.subject.nhs_number NUM   : " + context.getVariable("nhsd.subject.nhs_number"));

var httpverb = context.getVariable("request.verb");
var subNHS = context.getVariable("nhsd.subject.nhs_number");
if (httpverb == 'GET') {
    var queryNHSNumber = context.getVariable("request.queryparam.patientNHSNumber");
    print("queryNHSNumber :" +queryNHSNumber);
    if (queryNHSNumber) {
        if (queryNHSNumber !== subNHS) {
            print("NHS Number is not valid");
            context.setVariable('trigger.raiseNHSNumberFault', true);
            var errorObject = { error: 'NHSNumber missmatch', errorDescription: "NHSNumber missmatch in composite ID token and queryparameter", statusCode: 400, reasonPhrase: "Bad Request" };
            print(errorObject);
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
    }
    else {
        var routeParamArray = context.getVariable("proxy.pathsuffix").split('/');
        var routeNHSNumber = routeParamArray[routeParamArray.length - 1];
        print("routeNHSNumber :" +routeNHSNumber);
        if (routeNHSNumber && routeNHSNumber !== subNHS){
            print("NHS Number is not valid");
            context.setVariable('trigger.raiseNHSNumberFault', true);
            var errorObject = { error: 'NHSNumber missmatch', errorDescription: "NHSNumber missmatch in composite ID token and in the path", statusCode: 400, reasonPhrase: "Bad Request" };
            print(errorObject);
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }    
    }
}
else {
    if(httpverb == 'POST') {
        var reqContent = context.getVariable("request.content");
        var jsonContent = JSON.parse(reqContent);
        var postNHSnumber = null;
        for (var i = 0; i < jsonContent.parameter.length; i++) {
            var p = jsonContent.parameter[i];
            if ( p.name === "patientNHSNumber" && p.valueIdentifier && p.valueIdentifier.value) {
                postNHSnumber = p.valueIdentifier.value;
                break;
            }
        }
        print("postNHSnumber :" +postNHSnumber);
        if (postNHSnumber && postNHSnumber !== subNHS){
            print("NHS Number is not valid");
            context.setVariable('trigger.raiseNHSNumberFault', true);
            var errorObject = { error: 'NHSNumber missmatch', errorDescription: "NHSNumber missmatch in composite ID token and in the request content", statusCode: 400, reasonPhrase: "Bad Request" };
            print(errorObject);
            context.setVariable('validation.errorMessage', errorObject.error);
            context.setVariable('validation.errorDescription', errorObject.errorDescription);
            context.setVariable('validation.statusCode', errorObject.statusCode);
            context.setVariable('validation.reasonPhrase', errorObject.reasonPhrase);
        }
    }
}