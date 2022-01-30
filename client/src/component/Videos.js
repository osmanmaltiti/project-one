import React from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { auth } from '../services/firebase';
import { Card } from '../component/Card';
import '../styles/Video/videos.css';


const Videos = () => {
  const data = useSelector(state => state.user.data);
  const {quil} = data;
  console.log(data)
  
  const quilLayout = () => {
   return quil?.filter(item => item.quil.includes('videoquil')).map(item => 
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
    <div id='main-video'>
      <p style={{fontSize: '30px', fontFamily: "Roboto Condensed", 
                  alignSelf: 'flex-start', marginLeft: '4rem'}}>Videos</p>
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

export default Videos;
