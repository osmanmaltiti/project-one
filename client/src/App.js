import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './services/privateRoute';
import { Sign } from './component/Signpage';
import { Home } from './component/Homepage';
import './App.css';
import { Profile } from './component/Profile';
import { Explore } from './component/Explore';
import FollowingProfile from './component/Following-Profile';
import Videos from './component/Videos';
import Settings from './component/Settings';


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
        <Route path={'/home/explore/followingprofile'} element={
            <PrivateRoute>
              <FollowingProfile/>
            </PrivateRoute>}/>
        <Route path={'/home/videos'} element={
        <PrivateRoute>
          <Videos/>
        </PrivateRoute>}/>
        <Route path={'/home/settings'} element={
        <PrivateRoute>
          <Settings/>
        </PrivateRoute>}/>
      </Routes>
  )
}

export default App;
