import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './component/services/privateRoute';
import { Sign } from './component/Signpage';
import { Home } from './component/Homepage';
import './App.css';
import { Profile } from './component/Profile';


export const App = () => {
  
  return(
      <Routes>
        <Route path={'/'} element={<Sign/>}/>
        <Route path={'/home'} element={<PrivateRoute><Home/></PrivateRoute>}/>
        <Route path={'/home/profile'} element={<PrivateRoute><Profile/></PrivateRoute>}/>
      </Routes>
  )
}

export default App;
