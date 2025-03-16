const Server = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config");

process.on("uncaughtException", (error) => {
  console.log(error);
  process.exit(1);
});

let server;

async function bootstrap() {
  try {
    const uri = config.database_url;

    if (!uri) {
      console.error(
        "Error: MongoDB URI is not defined in the environment variables"
      );
      process.exit(1);
    }

    mongoose.Promise = global.Promise;
    mongoose.set("bufferCommands", false);
    mongoose
      .connect(uri,{ useNewUrlParser: true, useUnifiedTopology: true, maxPoolSize: 10,serverSelectionTimeoutMS: 3000, })
      .then(() => {
        console.log("connection successfull");
      })
      .catch((err) =>  console.error("❌ MongoDB connection error:", err));

    server = app.listen(config.port, () => {
      console.log(`Application  listening on port ${config.port}`);
    });
  } catch (err) {
    console.log("Failed to connect database", err);
  }

  process.on("unhandledRejection", (error) => {
    console.log("unhandled Rejection is detected,we are closing or sever......")
    if (server) {
      server.close(() => {
        console.log(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

  