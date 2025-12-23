function decodeJWT(token) {
    var parts = token.split(".");
    if (parts.length !== 3) {
        throw new Error("Invalid JWT format");
    }
    
}

var outerDecoded = decodeJWT("hello");