import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { IoSearch } from 'react-icons/io5';
import { search, otherUser } from '../redux/features/user-profile-slice';
import { auth } from '../services/firebase';
import { useNavigate } from 'react-router-dom';
import '../styles/Explore/Explore.css';

export const Explore = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [queries, setQueries] = useState([]);
  const [state, setState] = useState('');
  const searchQueries = useSelector(state => state.user.search);

              
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
                                    action = {() => {
                                      dispatch(otherUser(item.uid));
                                      navigate('/home/explore/followingprofile')
                                    }}
                                    />)
      }
    </div>
  </div>;
};

const QueryCard = (props) => {
  return <button className='main-query-card' onClick={props.action}>
      <div className='avi-names'>
        <img className='user-avi' src={props.userAvi} alt=''/>
        <div className='names'>
          <h4>{props.name}</h4>
          <p>{props.dispName}</p>
        </div>
      </div>
  </button>
}