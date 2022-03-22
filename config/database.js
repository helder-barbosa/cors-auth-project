const mongoose = require('mongoose');

const MongoDB = process.env.MONGO_URI;

exports.connect = () => {
  mongoose
    .connect(MongoDB, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => {
      console.log('[DATABASE] Succesfully Connected !');
    })
    .catch((err) => {
      console.log('[DATABASE] Connection Failed !');
      console.error(err);
    });
};
