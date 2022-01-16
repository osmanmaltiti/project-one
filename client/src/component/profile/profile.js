import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { signOut } from 'firebase/auth';
import { getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage';
import { auth, storage } from '../services/firebase';
import { Card } from '../card/card';
import Popup from 'reactjs-popup';
import axios from 'axios';
import logo from '../images/Logo.png'
import './profile.css';

export const Profile = () => {
  const [data, setData] = useState();
  const [quils, setQuils] = useState([]);
  const [file, setFile] = useState();
  const [link, setLink] = useState(null);
  const [uploading, setUploading] = useState(0);
  const navigate = useNavigate();
  
  const handleFile = (e) => {
    e.preventDefault();
    upload(file);
  };

  const upload = async(files) => {
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

  useEffect(() => {
    (async() => {
      const quilRes = await axios.get('/user/quil');
      const userRes = await axios.get(`/user/profile/${auth.currentUser.uid}`);
      const filterQuils = quilRes.data.filter(item => item.uid === auth.currentUser.uid);
      setQuils(filterQuils);
      setData(userRes.data);
    })();
  }, [link]);

  const handleSignOut = (e) => {
    e.preventDefault();
    signOut(auth);
    navigate('/')
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
            <button id='avi'><img id='profile-avi' alt={''} src={data?.profileUrl}/></button>
          } position={'bottom left'}>
            <div id='change-avi'>
              <input className='change-avi' type={'file'} onChange={(e) => setFile(e.target.files[0])}/>
              <button className='change-avi upload-button' onClick={handleFile}>Upload</button>
              <p id='progress'>Progress: {uploading}%</p>
            </div>
          </Popup>
          <div id='credentials'>
          <h2 className='credentials-item'>{data?.fullname}</h2>
          <p className='credentials-item'>@{data?.displayname}</p>
          <p className='credentials-item'>Total interactions</p>  
          <p className='credentials-item'>Quil age</p>
          </div>
        </div>
      </div>

      <hr width='80%'/>

      <div id='lower-half'>
        <div id='middle-pane'>
          <div id='card-border'>
          { quils.map( item => <Card key = {item._id}
              write = {item.quil}
              name = {item.displayname}
              profileImg = {item.profileUrl}
              // like = {}
              // unlike = {}
              // likeMe = {}
              // unlikeMe = {}
              />) }
          </div>
        </div>
      </div>
    </div>
  );
};
