export const errorMiddleware = (err, req, res, next) => {
  console.error("Global Error Handler:", err);
  if (res.headersSent) {
    return next(err);
  }
  res.status(500).json({
    success: false,
    error: "Internal Server Error",
    message: err.message
  });
}