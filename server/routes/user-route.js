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
  date: Object
});
const userSchema = new mongoose.Schema({
  uid: {type: String, required: true},
  fullname: String,
  displayname: String,
  email: String,
  number: Number,
  profileUrl: String,
  createdAt: String,
  followers: [String],
  following: [String]
});

const User = mongoose.model('User', userSchema);
const Quil = mongoose.model('Quil', quilSchema);


//user profile
router.post('/', async(req, res) => {
  const { uid, fullname, displayname, 
    email, number, profileUrl, createdAt } = req.body;
   
    
    const newUser = new User({
      uid, fullname, displayname, 
      profileUrl, email, number,
      createdAt
    });
    await newUser.save();
});

router.patch('/', async(req, res) => {
  const { uid, quils, createdAt} = req.body;
  User.find({uid: uid}, (err, results) => {
    const [userData] = results;
    const {displayname, profileUrl} = userData;
    if(err){ console.log(err) }
    else{
      const newQuil = new Quil({
        uid, displayname, profileUrl,
        quil: quils, date: createdAt
      });
      newQuil.save();
      }
  });
  res.status(201).send("Quil updated")
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
  User.find((err, data) => {
    res.status(201).json(data)
  })
})


router.get('/search', (req, res) => {
  User.find((err, data) => {
    const array = []
    data.forEach(item => array
                              .push({
                                uid: item.uid, 
                                fullname: item.fullname, 
                                displayname: item.displayname,
                                profileUrl: item.profileUrl
                              }));
    res.status(201).json(array)

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

router.delete('/quil/:uid/:quilID', async(req, res) => {
  const {quilID, uid} = req.params;
  try {
    Quil.deleteOne({_id: quilID, uid: uid}, (err) => err && console.log("Action not permitted"));
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

//follow Unfollow
router.patch('/follow/:uid', (req, res) => {
  const {uid} = req.params;
  const {followingId} = req.body;
  User.find({uid: followingId}, async(err, result) => {
    if(err) {console.log(err)}
    else{
      const [data] = result;
      let followers = [...data.followers, uid];
      await User.updateOne({uid: followingId}, {followers: [...new Set(followers)]});
    
    User.find({uid}, async(err, result) => {
      if(err) {console.log(err)}
      else{
        const [data] = result;
        let following = [...data.following, followingId]
        await User.updateOne({uid}, {following: [...new Set(following)]});
      }
    });
    res.status(201).send("Following")
    }
  })
})
module.exports = router;