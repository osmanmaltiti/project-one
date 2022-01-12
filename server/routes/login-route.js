const express = require('express');
const router = express.Router();


router.post('/', (req, res) => {
  const {username, password} = req.body;
  console.log({
    status: "LogIn Success",
    credentials: {username, password}});
  }
);

module.exports = router;