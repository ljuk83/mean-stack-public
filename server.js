const app = require("./backend/app");
const debug = require("debug")("node-angular");
const http = require("http");

// checking if the indicated port number is correct
const normalizePort = val => {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
};

// handling errors case scenario
const onError = error => {
  if (error.syscall !== "listen") {
    throw error;
  }
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
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

// logging that that we are listening to incoming requests
const onListening = () => {
  const addr = server.address();
  const bind = typeof port === "string" ? "pipe " + port : "port " + port;
  debug("Listening on " + bind);
};

// setting the port through the normalizePort function
const port = normalizePort(process.env.PORT || "3000");
app.set("port", port);

// creating the actual Server
const server = http.createServer(app);
server.on("error", onError);
server.on("listening", onListening);
server.listen(port);
