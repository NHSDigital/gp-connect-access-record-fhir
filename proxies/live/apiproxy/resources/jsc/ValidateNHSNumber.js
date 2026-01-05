// Define the function first
// Pure JS Base64URL decoder (no Java packages needed)
function base64UrlDecode(str) {
    // Replace URL-safe chars
    str = str.replace(/-/g, "+").replace(/_/g, "/");

    // Pad with '='
    while (str.length % 4) {
        str += "=";
    }

    // Decode manually
    var base64chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
    var result = "";
    var buffer = 0, bits = 0;

    for (var i = 0; i < str.length; i++) {
        var c = str.charAt(i);
        if (c === "=") break;
        var idx = base64chars.indexOf(c);
        if (idx === -1) continue;

        buffer = (buffer << 6) + idx;
        bits += 6;

        if (bits >= 8) {
            bits -= 8;
            var code = (buffer >> bits) & 0xFF;
            result += String.fromCharCode(code);
        }
    }
    return result;
}

function decodeJWT(token) {
    var parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
    }
    var header = JSON.parse(base64UrlDecode(parts[0]));
    var payload = JSON.parse(base64UrlDecode(parts[1]));
    var signature = parts[2];
    return { header: header, payload: payload, signature: signature };
}

// Get JWT from Apigee context (depends on your OAuthV2 policy name)
var idToken = context.getVariable("accesstoken.id_token");
// Sometimes it's "oauthv2accesstoken.id_token"
print("idToken", idToken);

// Check for act claim
if (idToken) {
    var outerDecoded = decodeJWT(idToken);
    print("Outer JWT payload: " + JSON.stringify(outerDecoded.payload));
    print("act claim is present: " + JSON.stringify(outerDecoded.payload.act));
    context.setVariable("jwt.actClaim", JSON.stringify(outerDecoded.payload.act));
    // === Decode nested JWT inside act.sub ===
    if(outerDecoded.payload.act){
        if (outerDecoded.payload.act.sub) {
            var innerDecoded = decodeJWT(outerDecoded.payload.act.sub);
            print("Inner JWT payload: " + JSON.stringify(innerDecoded.payload));
        }
    }
}