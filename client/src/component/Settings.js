import React, { useState, useEffect, useReducer } from 'react';
import { useSelector } from 'react-redux';
import useSettings from './Controllers/Settings-controller';
import '../styles/Settings/settings.css';
import { useNavigate } from 'react-router-dom';

const reducer = (state, action) => {
    switch(action.type){
      case 'Fullname':
        return {...state, fullname: action.payload};
      case 'Displayname':
        return {...state, displayname: action.payload};
      case 'Number':
        return {...state, number: action.payload};  
      default:
        return state
    }
}
const Settings = () => {
  const userData = useSelector(state => state.user.data);
  const { displayname, fullname } = userData.user; 
  const [file, setFile] = useState();
  const navigate = useNavigate();
  
  let init = {
    displayname, fullname, number: 0
  }

  const [state, dispatch] = useReducer(reducer, init);
  
  const { updateCredentials, updateProfilePicture } = useSettings();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/home')
    updateCredentials(state);
    if(file) updateProfilePicture(file);
  }

    useEffect(() => {
  }, []);
  return (
      <div id='main-settings'>
        <div id='edit-profile'>
          <h1>Edit Profile</h1>
          <form onSubmit={(e) => handleSubmit(e)}>
            <input type='text' value = {state.fullname} 
                    onChange = {(e) => dispatch({type: 'Fullname', payload: e.target.value})} 
                    placeholder='Full Name'/>
            <input type='text' value = {state.displayname}
                    onChange = {(e) => dispatch({type: 'Displayname', payload: e.target.value})}
                    placeholder='Display Name'/>
            <input type='number' value = {state.number} 
                    onChange = {(e) => dispatch({type: 'Number', payload: e.target.value})}
                    placeholder='Phone Number'/>
            <label>
              <p>Change Profile Picture</p>
              <input type='file' onChange={(e) => setFile(e.target.files[0])}/>
            </label>
            <button type='submit'>Save Changes</button>
          </form>
        </div>
      </div>
)};

export default Settings;
