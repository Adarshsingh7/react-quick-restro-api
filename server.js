const dotenv = require('dotenv');
const mongoose = require('mongoose');
const process = require('process');
dotenv.config({ path: './config.env' });
const app = require('./app.js');

mongoose
  .connect(process.env.DATABASE)
  .then(() => {
    console.log('DB connection successful! 🎉');
  })
  .catch(() => console.log('failed to connect to DB 💀'));

const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
