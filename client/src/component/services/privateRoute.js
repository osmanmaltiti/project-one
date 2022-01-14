import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import { auth } from "./firebase";
import { onAuthStateChanged } from "firebase/auth";

const PrivateRoute = ({children}) => {
    const [user, setUser] = useState(null);
    const [state, setState] = useState(<center><h1> Loading... </h1></center>)
    
    onAuthStateChanged(auth , (currentUser) => {
        setUser(currentUser);
    });
    
    useEffect(() => {
        const timer = setTimeout(() => {
            setState(<Navigate to={'/'}/>)
        }, 4000);
        return () => {
            user && clearTimeout(timer);
        }
    }, [user]);

    if (!user){
        return state;
    }else{
        return children;
    }
}

export default PrivateRoute;