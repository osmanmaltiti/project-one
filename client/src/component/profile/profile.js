import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../../redux/features/user-profile-slice';
import { signOut } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, storage } from '../services/firebase';
import { Card } from '../card/card';
import Popup from 'reactjs-popup';
import axios from 'axios';
import logo from '../images/Logo.png'
import './profile.css';

export const Profile = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const user_quil = useSelector((state) => state.user.data);
  const { user, quil } = user_quil;
  const interact = useSelector((state) => state.user.interactions);
  const { likes, unlikes } = interact;
  const [file, setFile] = useState();
  const [link, setLink] = useState(null);
  const [uploading, setUploading] = useState(0);

  
  const handleFile = (e) => {
    e.preventDefault();
    upload(file);
  };

  const upload = (files) => {
    const storageRef = ref(storage, `users/${auth.currentUser.uid}/profile`);
    const uploadFile = uploadBytesResumable(storageRef, files);
    uploadFile.on("state_changed", (snapshot) => {
      const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes)*100);
      setUploading(progress) 
    }, (err) => console.log(err), () => {
      getDownloadURL(uploadFile.snapshot.ref).then(url => setLink(url))
    });
  };

  useEffect(() => {
    (async() => {
      if(link === null) return;
      await axios.patch(`/user/${auth.currentUser.uid}`, { profileUrl: link });
    })();
  }, [link]);

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut(auth);
    dispatch(logout());
    navigate('/');
  }
  return (
    <div id='main-user-profile'>
      <div id='profile-header'>
        <img id='profile-logo' src={logo} alt={''}/>
        <button className="sign-google signOut signout" onClick={handleSignOut}>Sign Out</button>
      </div>

      <div id='upper-half'>
        <div id='profile-card'>
          <Popup  trigger={
            <button id='avi'><img id='profile-avi' alt={''} src={user.profileUrl}/></button>
          } position={'bottom left'}>
            <div id='change-avi'>
              <input className='change-avi' type={'file'} onChange={(e) => setFile(e.target.files[0])}/>
              <button className='change-avi upload-button' onClick={handleFile}>Upload</button>
              <p id='progress'>Progress: {uploading}%</p>
            </div>
          </Popup>
          <div id='credentials'>
          <h2 className='credentials-item'>Name: {user.fullname}</h2>
          <p className='credentials-item'>Display Name: @{user.displayname}</p>
          <p className='credentials-item'>Interactions: {likes + unlikes}</p>  
          <p className='credentials-item'>Quil age: 7 days</p>
          </div>
        </div>
      </div>

      <hr width='80%'/>

      <div id='lower-half'>
        <div id='middle-pane'>
          <div id='card-border'>
          { quil.filter(item => item.uid === auth.currentUser.uid)
              .map( item => <Card key = {item._id}
                  write = {item.quil}
                  name = {item.displayname}
                  profileImg = {item.profileUrl}
                  like = {item.likes.length}
                  unlike = {item.unlikes.length}
                  likeMe = { async() => {
                              await axios.patch(`/user/quil/like/${item._id}`, {
                              uid: auth.currentUser.uid
                              });} }
                  unlikeMe = { async() => {
                              await axios.patch(`/user/quil/unlike/${item._id}`, {
                              uid: auth.currentUser.uid
                              });} }
              />) }
          </div>
        </div>
      </div>
    </div>
  );
};
