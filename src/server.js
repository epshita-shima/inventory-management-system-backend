const Server = require("http");
const mongoose = require("mongoose");
const app = require("./app");
const config = require("./config");
const { errorlogger, logger } = require("./shared/logger");

process.on("uncaughtException", (error) => {
  errorlogger.error(error);
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
    mongoose
      .connect(uri)
      .then(() => {
        logger.info("connection successfull");
      })
      .catch((err) => errorlogger.error(err));

    server = app.listen(config.port, () => {
      // logger.info(`Application  listening on port ${config.port}`);
      console.log(`Application  listening on port ${config.port}`);
    });
  } catch (err) {
    errorlogger.error("Failed to connect database", err);
  }

  process.on("unhandledRejection", (error) => {
    console.log("unhandled Rejection is detected,we are closing or sever......")
    if (server) {
      server.close(() => {
        errorlogger.error(error);
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  });
}

bootstrap();

  