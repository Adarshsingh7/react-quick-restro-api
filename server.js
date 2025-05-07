const dotenv = require('dotenv');
const mongoose = require('mongoose');
const process = require('process');
dotenv.config({ path: './config.env' });
const app = require('./app.js');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  console.log({ name: err.name, message: err.message, err });
  process.exit(1);
});

mongoose
  .connect(process.env.DATABASE_REMOTE)
  .then(() => {
    console.log('DB connection successful! 🎉');
  })
  .catch(() => console.log('failed to connect to DB 💀'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  console.log(err.name, err.message, err);
  app.close(() => {
    process.exit(1);
  });
});
