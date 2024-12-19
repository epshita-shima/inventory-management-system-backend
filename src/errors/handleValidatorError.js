const handleValidatorError = (err) => {
  if (err.name === "ValidationError") {
    // Extract validation error details
    const errors = Object.values(err.errors).map((el) => {
      return {
        path: el?.path || "Unknown path",
        message: el?.message || "No message provided",
      };
    });
    const statusCode = 400;
    return {
      statusCode,
      message: "Validation Error",
      errorMessages: errors,
    };
  }

  // Fallback for unexpected errors
  console.error("Unexpected error in handleValidatorError:", err);
  return {
    statusCode: 500,
    message: "Internal Server Error",
    errorMessages: [
      {
        path: "unknown",
        message: err.message || "An unexpected error occurred.",
      },
    ],
  };
};

module.exports = handleValidatorError;
