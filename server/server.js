const express = require('express');
const mongoose = require('mongoose');
const user = require('./routes/user-route');
const port = process.env.PORT || 5000;
const app = express();

mongoose.connect('mongodb://localhost:27017/quilDB');

app.use(express.json());
app.use('/user', user);

app.get('/', (req, res) => {res.send("hello Mal")});

app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
