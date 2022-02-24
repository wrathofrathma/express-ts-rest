# Exceptions
A collection of exceptions and (maybe) a custom exception handler for Express.js.

# BaseException.ts
A small ``Error`` class extension that attaches an http status code to the error. This way we can throw custom exceptions, and pass the user an HTTP status code, instead of an internal error code.

# ExceptionHandler.ts
The default exception handler in express sends the stack trace as part of the response. Which, outside of development/debugging purposes, I've never once wanted. 

So this is a minimal exception handler that sends a response with the error message as JSON, and a status code (if one exists).