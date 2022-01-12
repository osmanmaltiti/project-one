import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoute from './component/services/privateRoute';
import { Sign } from './component/sign/signpage';
import { Home } from './component/homepage/homepage';
import './App.css';


export const App = () => {
  
  return(
      <Routes>
        <Route path={'/'} element={<Sign/>}/>
        <Route path={'/home'} element={<PrivateRoute><Home/></PrivateRoute>}/>
      </Routes>
  )
}

export default App;
