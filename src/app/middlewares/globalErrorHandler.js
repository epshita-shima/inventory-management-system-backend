const ApiError = require("../../errors/ApiError");
const handleValidatorError = require("../../errors/handleValidatorError");

const globalErrorHandler = (err, req, res, next) => {
  let statusCode = 500;
  let message = "Somthing went wrong!";
  errorMessages = [{ path, message }];

  if (err.name === "ValidatorError") {
    const simplifiedError = handleValidatorError(err);
    statusCode = simplifiedError.statusCode;
    message = simplifiedError.message;
    errorMessages = simplifiedError.errorMessages;
  } else if (err instanceof ApiError) {
    statusCode = err?.statusCode;
    message = err?.message;
    errorMessages = err.message
      ? [
          {
            path: "",
            message: err.message,
          },
        ]
      : [];
  } else if (err instanceof Error) {
    message = err?.message;
    errorMessages = err?.message ? [{ path: "", message: err.message }] : [];
  }
  res.status().json({
    success: false,
    message,
    errorMessages,
    stack: process.env.NODE_ENV !== "production" ? err?.stack : undefined,
  });
  next(err);
};

module.exports = globalErrorHandler;
