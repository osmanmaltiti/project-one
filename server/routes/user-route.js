const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const quilSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  displayname: String,
  profileUrl: String,
  quil: String
});
const userSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  fullname: String,
  displayname: String,
  email: String,
  number: Number,
  profileUrl: String,
  quil: [quilSchema]
});

const User = mongoose.model('User', userSchema);
const Quil = mongoose.model('Quil', quilSchema);

router.get('/quil', (req, res) => {
  Quil.find((err, data) => {
    if(err){console.log(err)}
    else{
      res.json(data)
    }
  });
});

router.post('/', async(req, res) => {
  const { uid, fullname, displayname, 
          email, number, profileUrl } = req.body;
  
  const newUser = new User({
    uid, fullname, displayname, 
    profileUrl, email, number
  });
  await newUser.save();

  res.json({
    status: "Created Successfully",
    credentials: newUser
  });
});

router.patch('/', async(req, res) => {
  const { uid, quils} = req.body;
  User.find({uid: uid}, (err, results) => {
    const [userData] = results;
    const {displayname, profileUrl, quil} = userData;
    if(err){ console.log(err) }
    else{
      const newQuil = new Quil({
        uid, displayname, profileUrl, quil: quils
      });
      newQuil.save();
      User.updateOne({uid: uid}, {quil: [...quil, newQuil]}, (err) => {
        err ? console.log(err) : res.json({
          status: "Updated Successfully"
        }) 
      });
    }
  });
});

router.get('/:uid', (req, res) => {
  const {uid} = req.params;
  User.find({uid: uid}, (err, results) => {
    const [userData] = results;
    if(err){
      console.log(err)}
    else{
      const {displayname, profileUrl} = userData;
      res.json({displayname, profileUrl})};
  });
});

module.exports = router;