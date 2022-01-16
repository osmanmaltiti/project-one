const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();


const quilSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  displayname: String,
  profileUrl: String,
  likes: [String],
  unlikes: [String],
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
      const newQuil = new Quil({
        uid, displayname, profileUrl, quil: quils
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
});

router.get('/', (req, res) => {
  User.find((err, results) => {
    res.json(results)
  })
});

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
  const { uid } = req.body;
  try {
    Quil.findOne({_id: quilID}, async(err, quilData) => {
      if(err){ console.log(err) }
      else{
        let likes = [...quilData.likes, uid]
        const newLikes = {
          likes: [...new Set(likes)],
          unlikes: [...quilData.unlikes.filter(item => item !== uid)]
        }
        await Quil.updateOne({_id: quilID}, {...newLikes});
        res.status(201).send('Updated')
      }
    })
  } catch (error) {
    console.log(error);
    res.status(400).send(error)
  }
});

router.patch('/quil/unlike/:quilID', async(req, res) => {
  const { quilID } = req.params;
  const { uid } = req.body;
  try {
    Quil.findOne({_id: quilID}, async(err, quilData) => {
      if(err){ console.log(err) }
      else{
        const unlikes = [...quilData.unlikes, uid]
        const newUnlikes = {
          unlikes: [...new Set(unlikes)],
          likes: [...quilData.likes.filter(item => item !== uid)]
        }
        await Quil.updateOne({_id: quilID}, {...newUnlikes});
  
        res.status(201).send('Updated')
      }
    })
  } catch (error) {
    console.log(error);
    res.status(400).send(error)
  }
});

router.delete('/quil/:quilID', async(req, res) => {
  const {quilID} = req.params;
  try {
    Quil.deleteOne({_id: quilID}, (err) => err && console.log(err));
    res.status(201).send('quil deleted')
  } catch (error) { 
    res.status(400).send(err);
    console.log(err); }
});

router.get(`/quil/likesUnlikes/:uid`, async(req, res) => {
  const { uid } = req.params;
  Quil.find({uid: uid}, (err, quilData) => {
    if(err){ console.log(err) }
    else{
      try{
        let totalLikes = quilData.reduce((acc, init) => acc + init.likes.length, 0);
        let totalUnlikes = quilData.reduce((acc, init) => acc + init.unlikes.length, 0);
        let popularity = Math.round((totalLikes/(totalLikes + totalUnlikes)) * 100)
        User.updateOne({uid: uid}, {totalLikes, totalUnlikes, popularity});
        res.status(201).json({likes: totalLikes, unlikes: totalUnlikes, popularity});  
      }catch(err){ console.log(err); res.status(400).send(err) }
    
    }
  })
})

module.exports = router;