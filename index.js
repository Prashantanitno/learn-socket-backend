import express from "express";
import { Server } from "socket.io";
import { createServer } from "http";
import cors from "cors";
// import jwt from "jsonwebtoken";
// import cookieParser from "cookie-parser";

// const SECRET_KEY = "thisisasecretkeytouse";
const PORT = 3000;
const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

app.use(
  cors({
    origin: "http://localhost:5174",
    methods: ["GET", "POST"],
    credentials: true,
  }),
);

app.get("/", (req, res) => {
  res.send("Hello world");
});

// app.get("/login", (req, res) => {
//   res.send("Hello world");

//   const token = jwt.sign({ _id: "asdasjdhkasdasdas" }, SECRET_KEY);

//   res
//     .cookie("token", token, { httpOnly: true, secure: true, sameSite: "none" })
//     .json({
//       message: "Login Success",
//     });
// });

// ----------------------------------------------------------
// io.use((socket, next) => {
//   cookieParser()(socket.request, socket.request.res, (err) => {
//     if (err) return next(err);

//     const token = socket.request.cookies.token;
//     if (!token) return next(new Error("Authentication Error"));

//     const decoded = jwt.verify(token, SECRET_KEY);
//     next();
//   });
// });

io.on("connection", (socket) => {
  console.log("user connected ", socket.id);

  // socket.emit("welcome", `Welcome to the server , ${socket.id}`);
  // socket.broadcast.emit("welcome", ` ${socket.id} join the server`);

  socket.on("message", (data) => {
    console.log(data);
    // ---------->> data is object
    //   {
    //     "message": "",
    //     "room": "mqcSa2YQSg2RO9tVAAAC"
    // }

    // ---------------------------------------------------------------------
    //--------->   to broadcast the msg to other except ours
    // socket.broadcast.emit("recieve-msg", data);

    // ------------------------------------------------------------------------
    // ---------> to send the msg to the particular user or group or in the room
    // io.to(data.room).emit("recieve-msg", data);
    socket.to(data.room).emit("recieve-msg", data);
  });

  //  ---------------> to join the room
  socket.on("join-room", (room) => {
    socket.join(room);
    console.log(`User Joined room ${room}`);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected --> ", socket.id);
  });
});

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
