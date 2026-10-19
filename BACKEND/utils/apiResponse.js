export const successResponse = (
  res,
  data = {},
  message = "Operation successful",
  statusCode = 200,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data,
  });
};

export const errorResponse = (
  res,
  message = "Error message",
  errors = [],
  statusCode = 400,
) => {
  let safeMessage;

  if (typeof message === "string") {
    safeMessage = message;
  } else if (message && typeof message === "object") {
    safeMessage = message.message || JSON.stringify(message);
  } else {
    safeMessage = String(message);
  }

  return res.status(statusCode).json({
    success: false,
    message: safeMessage,
    errors: Array.isArray(errors) ? errors : [],
  });
};
