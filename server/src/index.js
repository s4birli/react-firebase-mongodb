const mongoose = require("mongoose");
const config = require("./config");
const app = require("./app");
mongoose.Promise = global.Promise; // set mongo up to use promises
mongoose.set("debug", true);

mongoose
  .connect(config.db.mongo_location, {
    useCreateIndex: true,
    useNewUrlParser: true,
  })
  .catch(() => {
    throw new Error(
      "*** Can Not Connect to Mongo Server:" + config.db.mongo_location
    );
  });

const db = mongoose.connection;
db.once("open", () => {
  console.log("Connected to mongo at " + config.db.mongo_location);
  const server = app.listen(config.port, "0.0.0.0", function () {
    const host = server.address().address;
    const port = server.address().port;
    console.log("There will be dragons http://" + host + ":" + port);
  });
});

db.on("error", console.error.bind(console, "connection error:"));

db.on("close", function () {
  console.log(
    "Mongoose default connection disconnected through app termination"
  );
});

// If the Node process ends, close the Mongoose connection
// eslint-disable-next-line no-undef
process.on("SIGINT", function () {
  mongoose.connection.close(function () {
    console.log(
      "Mongoose default connection disconnected through app termination"
    );
    // eslint-disable-next-line no-undef
    return process.exit(0);
  });
});
