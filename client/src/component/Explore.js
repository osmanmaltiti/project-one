import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IoSearch } from 'react-icons/io5';
import { auth } from '../services/firebase';
import '../styles/Explore/Explore.css';

export const Explore = () => {
  const [queries, setQueries] = useState([]);
  const [state, setState] = useState('');
  const [follow, setFollow] = useState(false);

  useEffect(() => {
   
      //  (async() => {
      //    const res = await axios.get(`/user/search/${auth.currentUser.uid}`);
      //     setData(res.data)
          
      //   })()
  }, [])
  

  const handleQueries = async(e) => {
    e.preventDefault();
    setState(e.target.value);
    try {
      const res = await axios.get(`/user/search/${auth.currentUser.uid}/${e.target.value}`);
      setQueries(res.data);
    } 
    catch (error) {
      console.log(`Message (Not necessarily an error): ${error.message}`)
    }
  }
  

  const handleFollow = async(userId, followers) => {
    let data = { userId, followers }
    const res = await 
                  axios.patch(`/user/follow/${auth.currentUser.uid}`, {data})
  }
  
  return <div className='main-explore'>
    <span>
      <input type='text' onChange={handleQueries}/>
      <button><IoSearch size='25px' style={{verticalAlign: 'middle'}}/></button>
    </span>
    <div className='queries'>
      {state === '' ? state: queries.map(item => <QueryCard key={item.uid}
                                    name={item.fullname}
                                    dispName={item.displayname}
                                    userAvi = {item.profileUrl}
                                    follow = {
                                      () => {
                                        handleFollow(item.uid, item.followers)
                                      }
                                    }
                                    followState = {
                                      (() => {
                                        let stat = item.followers?.find(i => i.uid === auth.currentUser.uid);
                                        return stat ? stat.status : 'Follow'
                                      })()
                                    }/>)
      }
    </div>
  </div>;
};

const QueryCard = (props) => {
  return <div className='main-query-card'>
      <div className='avi-names'>
        <img className='user-avi' src={props.userAvi} alt=''/>
        <div className='names'>
          <h4>{props.name}</h4>
          <p>{props.dispName}</p>
        </div>
      </div>
      <button onClick={props.follow}>{props.followState}</button>
  </div>
}