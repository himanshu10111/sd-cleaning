const moongoose = require("mongoose");
moongoose.set("strictQuery", false);
const connectDb = () => {
  const url = process.env.MONGO_URI;

  return moongoose
    .connect(url, {
      useNewUrlParser: true,
    })
    .then(() => console.log("Connected to the db.."))
    .catch((error) => console.log(error));
};

module.exports = connectDb;
