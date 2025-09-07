const { createServer } = require("node:http");
const next = require("next");
const { Server } = require("socket.io");
const axios = require('axios');

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
    console.log("=== NEW SOCKET CONNECTION ===");
    console.log("A user connected with ID:", socket.id);
    console.log("Total connected clients:", io.engine.clientsCount);

    // Listen for comment submissions
    socket.on("comment", async (data) => {
      console.log("Raw data received:", data);
      console.log("Socket ID:", socket.id);

      if (!data.postID) {
        console.log("No postID provided, ignoring comment.");
        return;
      }

      try {
        console.log('🚀 About to call SaveComment GraphQL mutation with data:', data);

        const variables = {
          postID: data.postID,
          parentID: data.parentID,
          userID: data.userID,
          content: data.content
        };

        
        const result = await axios.post('http://localhost:3000/api/comment', {
          postID: variables.postID,
          parentID: variables.parentID,
          userID: variables.userID,
          content: variables.content,
        });

        console.log('✅ HTTP API result:', result.data);

        if (result.data.success) {
          const commentDataWithId = {
            ...data,
            commentID: result.data.comment.id,
            createdAt: result.data.comment.createdAt,
            user: result.data.comment.user, // Include user information from API response
          };

          io.emit("comment", commentDataWithId);
          console.log("📤 Comment data emitted to all clients:", commentDataWithId);
        } else {
          throw new Error(result.data.message || "Failed to save comment");
        }
        
      } catch (err) {
        console.error('❌ ERROR in comment handler:');
        console.error('Error message:', err.message);
        console.error('Error stack:', err.stack);
        console.error('Full error object:', err);

        io.emit("commentSaved", {
          success: false,
          message: err.message || "Failed to save comment"
        });

        console.log('📤 Error response sent to clients');
      }
    });

    socket.on("disconnect", () => {
      console.log("=== SOCKET DISCONNECTED ===");
      console.log("User disconnected:", socket.id);
      console.log("Remaining clients:", io.engine.clientsCount - 1);
    });
  });

  httpServer
    .once("error", (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log(`> Ready on http://${hostname}:${port}`);
    });
});