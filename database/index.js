const mongoose = require('mongoose');

const DB = process.env.DATABASE;

console.log(L(DB));

mongoose.connect(DB, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const database_connection = mongoose.connection;

database_connection.on('error', (error) => {
  console.log(E(error));
});

database_connection.on('open', () => {
  console.log(D('Database connection successful'));
});

module.exports = database_connection;
