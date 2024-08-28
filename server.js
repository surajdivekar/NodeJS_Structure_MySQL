require("dotenv").config();
const http = require("http");
const debug = require("debug")("server:server");
const { app, initializeDatabase } = require("./src/index");

const normalizePort = (val) => {
  const port = parseInt(val, 10);
  if (isNaN(port)) return val;
  if (port >= 0) return port;
  return false;
};

const port = normalizePort(process.env.PORT || "9292");
app.set("port", port);

const server = http.createServer(app);

const onError = (error) => {
  if (error.syscall !== "listen") throw error;
  const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

  switch (error.code) {
    case "EACCES":
      console.error(bind + " requires elevated privileges");
      process.exit(1);
      break;
    case "EADDRINUSE":
      console.error(bind + " is already in use");
      process.exit(1);
      break;
    default:
      throw error;
  }
};

const onListening = () => {
  const addr = server.address();
  const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
  debug("Listening on " + bind);
  console.log(`Server is running on port ${port}.`);
};

// Initialize database and start server
initializeDatabase()
  .then(() => {
    server.listen(port);
    server.on("error", onError);
    server.on("listening", onListening);
  })
  .catch((err) => {
    console.error("Failed to initialize the application:", err);
    process.exit(1);
  });

process.on("unhandledRejection", (reason, promise) => {
  console.error("Unhandled Rejection at:", promise, "reason:", reason);
});

// Graceful shutdown
process.on("SIGTERM", () => {
  console.log("SIGTERM signal received: closing HTTP server");
  server.close(() => {
    console.log("HTTP server closed");
  });
});

// const dotenv = require("dotenv");
// dotenv.config();

// const http = require("http");
// const debug = require("debug")("server:server");
// const { app, initializeDatabase } = require("./index");

// const normalizePort = (val) => {
//   const port = parseInt(val, 10);
//   if (isNaN(port)) return val;
//   if (port >= 0) return port;
//   return false;
// };

// const onError = (error) => {
//   if (error.syscall !== "listen") throw error;
//   const bind = typeof port === "string" ? "Pipe " + port : "Port " + port;

//   switch (error.code) {
//     case "EACCES":
//       console.error(bind + " requires elevated privileges");
//       process.exit(1);
//       break;
//     case "EADDRINUSE":
//       console.error(bind + " is already in use");
//       process.exit(1);
//       break;
//     default:
//       throw error;
//   }
// };

// const onListening = () => {
//   const addr = server.address();
//   const bind = typeof addr === "string" ? "pipe " + addr : "port " + addr.port;
//   debug("Listening on " + bind);
//   console.log(`Server is running on port ${port}.`);
// };

// const port = normalizePort(process.env.PORT || "9090");
// app.set("port", port);

// const server = http.createServer(app);

// // Initialize database and start server
// initializeDatabase()
//   .then(() => {
//     server.listen(port);
//     server.on("error", onError);
//     server.on("listening", onListening);
//   })
//   .catch((err) => {
//     console.error("Failed to initialize the application:", err);
//     process.exit(1);
//   });

// process.on("unhandledRejection", (reason, promise) => {
//   console.error("Unhandled Rejection at:", promise, "reason:", reason);
// });

// // Graceful shutdown
// process.on("SIGTERM", () => {
//   console.log("SIGTERM signal received: closing HTTP server");
//   server.close(() => {
//     console.log("HTTP server closed");
//   });
// });
