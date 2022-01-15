import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "../services/firebase";
import { signOut } from "firebase/auth";
import { Card } from "../card/card";
import { IoPerson, IoStatsChart, IoMic, 
         IoImage, IoVideocam, IoSend } from "react-icons/io5";
import { IoMdHappy, IoMdSad } from "react-icons/io";
import { useLike } from "./like-unlike";
import axios from "axios";
import useInput from "../sign/input-hook";
import logo from "../images/Logo.png"
import './homepage.css';


export const Home = () => {
const navigate = useNavigate();
const [write, reset_write] = useInput('');
const [data, setData] = useState([]);
const [avi_diplayname, setAvi_displayname] = useState({});
let [likeState, setLikeState] = useState(true);
let [unlikeState, setUnlikeState] = useState(true);

const logOut = () => {
    signOut(auth);
    navigate('/');
};


useEffect(() => {
    const refresh = setInterval(() => {
        (async() => {
            const userAvi = await axios.get(`/user/profile/${auth.currentUser.uid}`);
            const cardItems = await axios.get('/user/quil');
            setAvi_displayname(userAvi.data);
            setData(cardItems.data);
        })();
    }, 3000);

    return () => {
        clearInterval(refresh);
    }
}, []);


const handleQuil = async(e) => {
    e.preventDefault();
    reset_write();
    try{
     await axios.patch('/user', {
         uid: auth.currentUser.uid, 
         quils: write.value
        });
    }
    catch(err){ console.log(err); }
};

return(
<div id="main">
    <div id="header">
        <img id='header-logo' alt={""} src={logo} height="70px"/>
        <img id="user-avi" alt={""} src={avi_diplayname.profileUrl}/> 
        <nav id="nav-bar">
            <button className="sign-google signOut" onClick={logOut} >Sign Out</button>
        </nav>
    </div>
    <div id="body">
        <div id="left-pane">
            <div id="left-pane-items">
                <div id='left-item-one'><IoPerson style={{verticalAlign: 'middle', color: 'black'}} size='30px'/><h4>{avi_diplayname.displayname}</h4></div>
                <div id='left-item-two'><IoMdHappy style={{verticalAlign: 'middle', color: 'black'}} size='30px'/><h4>999</h4>
                <IoMdSad style={{verticalAlign: 'middle', color: 'black'}} size='30px'/><h4>999</h4></div>
                <div id='left-item-three'><IoStatsChart style={{verticalAlign: 'middle', color: 'black'}} size='30px'/><h4>90%</h4></div>
            </div>
        </div>
        <div id="middle-pane">
            <div id="card-border">
                {data.map(item => <Card key = {item._id}
                                    write = {item.quil}
                                    name = {item.displayname}
                                    profileImg = {item.profileUrl}
                                    like = {item.likes['likes']}
                                    unlike = {item.unlikes['unlikes']}
                                    likeMe = {async() => {
                                        setLikeState(!likeState)
                                        likeState && setUnlikeState(false)
                                        await axios.patch(`/user/quil/like/${item._id}`, {
                                            state: likeState, 
                                            uid: auth.currentUser.uid
                                        });
                                    }}
                                    unlikeMe = {async() => {
                                        setUnlikeState(!unlikeState)
                                        unlikeState && setLikeState(false) 
                                        await axios.patch(`/user/quil/unlike/${item._id}`, {
                                            state: unlikeState, 
                                            uid: auth.currentUser.uid
                                        });
                                    }}
                                    />)} 
                <hr/>     
            </div>
        </div>
        <div id="right-pane">
            <div id='menu-items'>
                <button className="menu-buttons" onClick={() => navigate('/home/profile')}>Profile</button>
                <button className="menu-buttons">Explore </button>
                <button className="menu-buttons">Videos</button>
                <button className="menu-buttons">Settings</button>
            </div>
            <textarea id="write" {...write} placeholder="What's on your mind....."></textarea>
            <div id="icon-buttons">
                <button className="sign-google send"  onClick={handleQuil}>send <IoSend size='20px' style={{verticalAlign: 'middle'}}/></button>
                <button className="icon-buttons"><IoVideocam style={{verticalAlign: 'middle'}} size='25px'/></button>
                <button className="icon-buttons"><IoMic style={{verticalAlign: 'middle'}} size='25px'/></button>
                <button className="icon-buttons"><IoImage style={{verticalAlign: 'middle'}} size='25px'/></button>
            </div>
        </div>
    </div>
    <footer id="footer"></footer>
</div>
)

}