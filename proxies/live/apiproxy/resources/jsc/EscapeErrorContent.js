// Get the raw error content
var raw = context.getVariable("error.content");

// Default to empty string if null/undefined
if (raw === null || raw === undefined) {
    raw = "";
}

// Escape using JSON.stringify
var escaped = JSON.stringify(raw);

// Strip the outer quotes (since JSON.stringify wraps it in "")
escaped = escaped.substring(1, escaped.length - 1);

// Set the escaped value to a new context variable
context.setVariable("error.content.escaped", escaped);
