function json_tryparse(raw) {
  try {
      return JSON.parse(raw);
  }
  catch (e) {
      return raw;
  }
}

var respContent=context.getVariable('GPCPFSKeycloakResponse.content');
const respObject=json_tryparse(respContent);
context.setVariable("authorization_access_token",respObject["access_token"]);


print("===================this is authorization access_token==============================")
print(context.getVariable('authorization_access_token'));

