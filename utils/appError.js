class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.message = message;
    this.statusCode = statusCode;
    // the first digit of statusCode indicates if the error was a user or server error (400s vs. 500s)
    this.status = `${statusCode}.`.startsWith('4') ? 'fail' : 'error';
    this.isOperational = true;
    // capture stack trace & don't add this object's constructor call to said stack
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
