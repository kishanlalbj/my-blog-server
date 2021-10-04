const mongoose = require("mongoose");
const mongoDBConnectionString = process.env.MONGO_CONNECTION_STRING;

mongoose
  .connect(mongoDBConnectionString)
  .then(() => {
    console.log("Database connected");
  })
  .catch((err) => {
    console.log(err);
  });

mongoose.connection.on("connected", () => {
  console.log("Database connection initialized");
});

mongoose.connection.on("disconnected", () => {
  console.log("Database connection terminated");
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  process.exit(0);
});
