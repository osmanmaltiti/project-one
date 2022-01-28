import React, { useEffect, useState } from 'react';
import '../styles/Following-Profile/Following-Profile.css';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { auth } from '../services/firebase';
import { Card } from '../component/Card';


function FollowingProfile() {
  const otherUser = useSelector(state => state.user.otherUser);
  const otherUserQuils = useSelector(state => state.user.data);
  const {quil} = otherUserQuils;
  const [data, setData] = useState({});
  const [userQuil, setUserQuil] = useState([]);
  const [update, setUpdate] = useState('');
  
  useEffect(() => {
    const fetch = async(id) => {
      const res = await axios.get(`/user/userquery/${id}`);
      setData(res.data)
    }
    fetch(otherUser);
    setUserQuil(quil?.filter(item => item.uid === otherUser))
  }, [update]);
  
  const handleFollow = async(userId, followers) => {
    let data = { userId, followers }
    const res = await 
                  axios.patch(`/user/follow/${auth.currentUser.uid}`, {data})
    setUpdate(res.data)
  }

  const btn = () => {
    return data.followers
                ?.includes(auth.currentUser.uid) ? 
                'Following' :
                'Follow'
  }
  const quilLayout = () => {
   return userQuil?.map(item => 
      <Card key = {item._id}
            write = {item.quil}
            name = {item.displayname}
            profileImg = {item.profileUrl}
            like = {item.likes.length}
            unlike = {item.unlikes.length}
            time = {`${item.date?.hour}:${item.date?.minute}`}
            date = {`${item.date?.day}-${item.date?.month}-${item.date?.year}`}
            likeMe = { async() => {
                await axios.patch(`/user/quil/like/${item._id}`, {
                uid: auth.currentUser.uid
                });} }
            unlikeMe = { async() => {
                await axios.patch(`/user/quil/unlike/${item._id}`, {
                uid: auth.currentUser.uid
                });} }
            likeState = {
              item.likes.includes(auth.currentUser.uid) && 'green'
            }
            unLikeState = {
              item.unlikes.includes(auth.currentUser.uid) && 'red'
            }
      />)
  }

  return (
    <div id='main-user-profile'>
      <div id='upper-half-others'>
        <div id='profile-card-others'>
          <span>
            <img id='profile-avi' alt={''} src={data.profileUrl}/>
            <div id='credentials-others'>
              <p className='credentials-item'>{data.fullname}</p>
              <p className='credentials-item'>{data.displayname}</p>
              <p className='credentials-item'>{data.followers?.length}</p>
              <p className='credentials-item'>{data.following?.length}</p>
            </div>
          </span>
          <button onClick={() => handleFollow(otherUser, data.followers)}>
            { btn() }
          </button>
        </div>
      </div>

      <div id='lower-half-others'>
        <div id='middle-pane'>
          <div id='card-border'>
            {
              quilLayout()
            }
          </div>
        </div>
      </div>
    </div>
  )
}

export default FollowingProfile;
