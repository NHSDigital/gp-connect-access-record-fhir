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

var outerDecoded = decodeJWT(idToken);