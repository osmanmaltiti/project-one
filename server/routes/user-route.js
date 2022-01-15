const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

const likeSchema = new mongoose.Schema({
  likes: Number,
  users: [String]
});
const unlikeSchema = new mongoose.Schema({
  unlikes: Number,
  users: [String]
});
const quilSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  displayname: String,
  profileUrl: String,
  likes: likeSchema,
  unlikes: unlikeSchema,
  quil: String,
});
const userSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  fullname: String,
  displayname: String,
  email: String,
  number: Number,
  profileUrl: String
});

const User = mongoose.model('User', userSchema);
const Quil = mongoose.model('Quil', quilSchema);
const Like = mongoose.model('Like', likeSchema);
const Unlike = mongoose.model('Unlike', unlikeSchema);


//user profile
router.post('/', async(req, res) => {
  const { uid, fullname, displayname, 
    email, number, profileUrl } = req.body;
    
    const newUser = new User({
      uid, fullname, displayname, 
      profileUrl, email, number
    });
    await newUser.save();
});

router.patch('/', async(req, res) => {
  const { uid, quils} = req.body;
  User.find({uid: uid}, (err, results) => {
    const [userData] = results;
    const {displayname, profileUrl} = userData;
    if(err){ console.log(err) }
    else{
      const newLike = new Like({likes: 0});
      const newUnlike = new Unlike({unlikes: 0});
      const newQuil = new Quil({
        uid, displayname, profileUrl, quil: quils,
        likes: newLike, unlikes: newUnlike
      });
      newQuil.save();
      }
  });
});

router.patch('/:uid', (req, res) => {
  const { uid } = req.params;
  const { profileUrl } = req.body;
  User.updateOne({uid: uid}, { profileUrl: profileUrl }, (err) => {
    err && console.log(err);
  });
  Quil.updateMany({uid: uid}, { profileUrl: profileUrl }, (err) => {
    err && console.log(err);
  })
})
router.get('/profile/:uid', async(req, res) => {
  const {uid} = req.params;
  User.find({uid: uid}, (err, results) => {
    const [userData] = results;
    if(err){
      console.log(`Error message: ${err}`)}
      else{
      const {displayname, profileUrl, fullname, quil} = userData;
      res.json({
        displayname, 
        profileUrl,
        fullname,
        quil
      })};
  });
});

router.get('/', (req, res) => {
  User.find((err, results) => {
    res.json(results)
  })
})


//quil card
router.get('/quil', (req, res) => {
  Quil.find((err, data) => {
    if(err){console.log(err)}
    else{
      res.json(data)
    }
  });
});

router.patch('/quil/like/:quilID', async(req, res) => {
  const { quilID } = req.params;
  const { state, uid } = req.body;
  console.log(state)
  Quil.find({_id: quilID}, async(err, result) => {
    const [quilData] = result;
    const {likes} = quilData;
    if(state){
      const newLikes = {
        likes: likes['likes'] + 1,
        users : [...likes['users'], uid],
        _id : likes._id
      }
      await Quil.updateOne({_id : quilID}, {likes: newLikes})
    }else{
      const newLikes = {
        likes: likes['likes'] - 1,
        users : [...likes['users'], uid],
        _id : likes._id
      }
      await Quil.updateOne({_id : quilID}, {likes: newLikes})
    }
  });
}
);
router.patch('/quil/unlike/:quilID', async(req, res) => {
  const { quilID } = req.params;
  const { state, uid } = req.body;
  console.log(state)
  Quil.find({_id: quilID}, async(err, result) => {
    const [quilData] = result;
    const {unlikes} = quilData;
    if(state){
      const newUnlikes = {
        unlikes: unlikes['unlikes'] + 1,
        users : [...unlikes['users'], uid],
        _id : unlikes._id
      }
      await Quil.updateOne({_id : quilID}, {unlikes: newUnlikes})
    }else{
      const newUnlikes = {
        unlikes: unlikes['unlikes'] - 1,
        users : [...unlikes['users'], uid],
        _id : unlikes._id
      }
      await Quil.updateOne({_id : quilID}, {unlikes: newUnlikes})
    }
  });
}
);
module.exports = router;