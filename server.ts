import Express from "express";
import { createServer } from "http";

import { Server as IO } from "socket.io";
import { v4 as UUIDv4 } from "uuid";
import CORS from "cors";

const app = Express();
const server = createServer(app);
const io = new IO(server, {
  cors: {
    origin: "*",
  },
});

app.use(CORS());

app.get("/create-room", (req, res: Express.Response) => {
  res.send({ roomId: UUIDv4() });
});

io.on("connection", (socket: any) => {
  socket.on("join-room", (roomId: string, userId: string, userName: string) => {
    socket.join(roomId);
    socket.broadcast.to(roomId).emit("user-connected", userId, userName);
  });

  socket.on("leave-room", (roomId: string, userId: string) => {
    console.log("leave-room", roomId, userId);
    socket.broadcast.to(roomId).emit("user-disconnected", userId);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected");
  });
});

const port = process.env.PORT || 5000;
server.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
