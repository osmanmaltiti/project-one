import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { IoSearch } from 'react-icons/io5';
import { search } from '../redux/features/user-profile-slice';
import { auth } from '../services/firebase';
import '../styles/Explore/Explore.css';

export const Explore = () => {
  const dispatch = useDispatch();
  const [queries, setQueries] = useState([]);
  const [state, setState] = useState('');
  const searchQueries = useSelector(state => state.user.search);
  const [followState, setFollow] = useState('Follow');

              
  useEffect(() => {
    (async() => {
      const res = await axios.get('/user/search');
      dispatch(search(res.data))
    })()
  }, [])
  
  const handleQueries = (e) => {
    e.preventDefault();
    setState(e.target.value);
    setQueries(searchQueries.filter(item => 
                item.uid !== auth.currentUser.uid && (
                item.fullname.toLowerCase().includes(
                      e.target.value) || 
                item.displayname.toLowerCase().includes(
                      e.target.value)
                ) 
              ));
  }

  const handlefollow = async(id) => {
    const {followingId} = id;
    const follow = await axios.patch(`/user/follow/${auth.currentUser.uid}`,
                  {followingId});
    setFollow(follow.data)
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
                                    follow = {()=> handlefollow({followingId: item.uid})}
                                    followState = {followState}/>)}
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