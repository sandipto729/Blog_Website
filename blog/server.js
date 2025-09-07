const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");

const dev = process.env.NODE_ENV !== "production";
const hostname = "localhost";
const port = 3000;
// when using middleware `hostname` and `port` must be provided below
const app = next({ dev, hostname, port });
const handler = app.getRequestHandler();

app.prepare().then(() => {
  const httpServer = createServer(handler);

  const io = new Server(httpServer, {
    path: "/socket.io",
  });

  io.on("connection", (socket) => {
    console.log("A user connected");

    // Send welcome message immediately when user connects
    socket.emit("welcome", "Hello from server - Welcome!");

    // Send periodic messages to this specific user
    let messageCount = 1;
    const messageInterval = setInterval(() => {
      if (messageCount <= 10) {
        socket.emit("welcome", `Hello from server - Message ${messageCount}`);
        messageCount++;
      } else {
        clearInterval(messageInterval);
      }
    }, 2000);

    socket.on("disconnect", () => {
      console.log("A user disconnected");
      clearInterval(messageInterval);
    });
  });
//    io.emit("welcome", "Hello from server");

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});