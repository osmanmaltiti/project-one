import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { totalLikes, userprofile } from "../redux/features/user-profile-slice";
import { auth, storage } from "../services/firebase";
import Popup from 'reactjs-popup';
import axios from 'axios';
import logo from '../images/newLogo.png'
import '../styles/Profile/Profile.css';
import useProfile from './Controllers/Profile-controller';

export const Profile = () => {
  
  const user_quil = useSelector((state) => state.user.data);
  const { user, quil } = user_quil;
  const interact = useSelector((state) => state.user.interactions);
  const { likes, unlikes } = interact;
  const [file, setFile] = useState();
  const [link, setLink] = useState(null);
  const [uploading, setUploading] = useState('......');
  const [handleSignOut, quilMap, getQuilAge] = useProfile();
  const dispatch = useDispatch();

  const upload = async(files) => {
    const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile`);
    const uploadFile = uploadBytesResumable(storageRef, files);
    uploadFile.on("state_changed", (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
      setUploading(progress)
    }, (err) => console.log(err), async() => {
      await getDownloadURL(uploadFile.snapshot.ref).then(url => setLink(url))
    });
  };

  useEffect(() => {
    (async() => {
      if(link === null) return;
      await axios.patch(`/user/${auth.currentUser.uid}`, { profileUrl: link });
    })();
  }, [link]);

  useEffect(() => {
    const refresh = setInterval(() => {
        (async() => {
            const userRes = await axios.get(`/user/profile/${auth.currentUser.uid}`);
            const quilRes = await axios.get('/user/quil');
            dispatch(userprofile({user: userRes.data, quil: quilRes.data}));
        })();
        (async() => {
            const allLikes = await axios.get(`/user/quil/likesUnlikes/${auth.currentUser.uid}`);
            dispatch(totalLikes(allLikes.data))
        })()
    }, 3000);
    return () => {
        clearInterval(refresh);
    }
}, []);

  return (
    <div id='main-user-profile'>
      <div id='profile-header'>
        <img id='profile-logo' src={logo} alt={''}/>
        <button className="sign-google signOut signout" onClick = {(e) => handleSignOut(e)}>Sign Out</button>
      </div>

      <div id='upper-half'>
        <div id='profile-card'>
          <Popup  trigger={
            <button id='avi'><img id='profile-avi' alt={''} src={user?.profileUrl}/></button>
          } position={'bottom left'}>
            <div id='change-avi'>
              <input className='change-avi' type={'file'} onChange={(e) => setFile(e.target.files[0])}/>
              <button className='change-avi upload-button' 
                  onClick={(e) => { e.preventDefault();
                                    upload( file ) }
                          }>Upload</button>
              <p id='progress'>Progress: {uploading}</p>
            </div>
          </Popup>
          <div id='credentials'>
            <p className='credentials-item'>
              <strong>Name: </strong>{user?.fullname}</p>
            <p className='credentials-item'>
              <strong>Username: </strong>{user?.displayname}</p>
            <p className='credentials-item'>
              <strong>Interactions: </strong>{likes + unlikes}</p>  
            <p className='credentials-item'>
              <strong>Quil age: </strong>{ getQuilAge(user?.createdAt) }</p>
          </div>
        </div>
        <div>
        <div id='stats'>
          <p className='stats-item'>
            <strong>Followers: </strong>{user?.followers?.length}</p>
          <p className='stats-item'>
            <strong>Following: </strong>{user?.following?.length}</p>
          <p className='stats-item'>
            <strong>Total Likes: </strong>{likes}</p>  
          <p className='stats-item'>
            <strong>Total Unlikes: </strong>{unlikes}</p>
          </div>
        </div>
      </div>

      <hr width='50%'/>

      <div id='lower-half'>
        <div id='middle-pane'>
          <div id='card-border'>
                { quilMap(quil) }
          </div>
        </div>
      </div>
    </div>
  );
};
