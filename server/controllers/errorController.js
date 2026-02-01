import AppError from "../utils/appError.js";
import path from "path";
import fs from "fs";
import rootDir from "../utils/rootDir.js";

/* ===================== DB ERROR HANDLERS ===================== */

// Invalid MongoDB ID
const handleCastErrorDB = (err) => {
  const message = `Invalid ${err.path}: ${err.value}.`;
  return new AppError(message, 400);
};

// Duplicate field
const handleDuplicateFieldsDB = (err) => {
  const value = err.errmsg.match(/(["'])(?:(?=(\\?))\2.)*?\1/)[0];
  const message = `Duplicate field value: ${value}, Please use another value`;
  return new AppError(message, 400);
};

// Validation errors
const handleValidationErrorDB = (err) => {
  const errors = Object.values(err.errors).map((el) => el.message);
  const message = `Invalid input data. ${errors.join(". ")}`;
  return new AppError(message, 400);
};

/* ===================== DEV ERROR ===================== */

const sendErrorDev = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    return res.status(err.statusCode).json({
      status: err.status,
      error: err,
      message: err.message,
      stack: err.stack,
    });
  }

  // Rendered website
  const htmlPath = path.join(rootDir, "views/error/error.html");
  let html = fs.readFileSync(htmlPath, "utf-8");
  html = html.replace("{{ERROR_MESSAGE}}", err.message || "Unknown error");

  res.status(err.statusCode || 500).send(html);
};

/* ===================== PROD ERROR ===================== */

const sendErrorProd = (err, req, res) => {
  // API
  if (req.originalUrl.startsWith("/api")) {
    if (err.isOperational) {
      return res.status(err.statusCode).json({
        status: err.status,
        message: err.message,
      });
    }

    console.log("ERROR 💥", err);

    return res.status(500).json({
      status: "error",
      message: "Something went wrong",
    });
  }

  // Rendered website
  const htmlPath = path.join(rootDir, "views/error/error.html");

  if (err.isOperational) {
    let html = fs.readFileSync(htmlPath, "utf-8");
    html = html.replace(
      "{{ERROR_MESSAGE}}",
      err.message || "Something went wrong"
    );
    return res.status(err.statusCode || 500).send(html);
  }

  console.log("ERROR 💥", err);

  let html = fs.readFileSync(htmlPath, "utf-8");
  html = html.replace("{{ERROR_MESSAGE}}", "Please try again later.");
  res.status(500).send(html);
};

/* ===================== FIREBASE ERROR ===================== */

const handleFirebaseError = (err) => {
  if (err.code === "auth/invalid-id-token")
    return new AppError("Invalid Firebase token", 401);

  if (err.code === "auth/id-token-expired")
    return new AppError("Firebase token expired, login again", 401);

  return new AppError(err.message || "Firebase error", 500);
};

/* ===================== GLOBAL ERROR HANDLER ===================== */

export default (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || "error";

  if (process.env.NODE_ENV === "development") {
    sendErrorDev(err, req, res);
  } else if (process.env.NODE_ENV === "production") {
    if (err.name === "CastError") err = handleCastErrorDB(err);
    if (err.code === 11000) err = handleDuplicateFieldsDB(err);
    if (err.name === "ValidationError") err = handleValidationErrorDB(err);
    if (err.code?.startsWith("auth/")) err = handleFirebaseError(err);

    sendErrorProd(err, req, res);
  }
};
