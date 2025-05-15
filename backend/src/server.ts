
import mongoose from "mongoose";
import app from "./app";
import { Server } from "http";
import config from "./app/config/config";
import { Server as SocketIOServer } from 'socket.io'; 
let server: Server;

const setupServer = () => {
    server = app.listen(config.port, () => {
        console.log(`Example app listening on port ${config.port}`);
        console.log("Database Connected !! 😊😊");
    });

    const io = new SocketIOServer(server, {  
        cors: {
            origin: "*", 
            methods: ["GET", "POST"]
        }
    });

    import('./app/modules/meeting/meeting.sockets').then(module => {
      module.handleSocketConnection(io);
    }).catch(e => {
      console.error("Failed to load socket handler", e);
    })

    return server;
}

async function main() {
  try {
    await mongoose.connect(config.database_url as string);
     setupServer();
    server = app.listen(config.port, () => {
      console.log(`Example app listening on port ${config.port}`);
      console.log("Database Connected !! 😊😊");
    });
  } catch (error) {
    console.log(error);
  }
}
main();
process.on("unhandledRejection", () => {
  console.log(`😭😭 unhandledRejection is detected, shutting down....`);

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  }
  process.exit(1);
});
process.on("uncaughtException", () => {
  console.log(`😭😭 uncaughtException is detected, shutting down....`);
  process.exit(1);
});