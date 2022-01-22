import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './services/privateRoute';
import { Sign } from './component/Signpage';
import { Home } from './component/Homepage';
import './App.css';
import { Profile } from './component/Profile';
import { Explore } from './component/Explore';


export const App = () => {
  
  return(
      <Routes>
        <Route path={'/'} element={
            <Sign/>}/>
        <Route path={'/home'} element={
            <PrivateRoute>
              <Home/>
            </PrivateRoute>}/>
        <Route path={'/home/profile'} element={
            <PrivateRoute>
              <Profile/>
            </PrivateRoute>}/>
        <Route path={'/home/explore'} element={
            <PrivateRoute>
              <Explore/>
            </PrivateRoute>}/>
      </Routes>
  )
}

export default App;
