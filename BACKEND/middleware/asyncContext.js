export const requestContext = (req, res, next) => {
  req.requestId = crypto.randomUUID();
  next();
};
