import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "../services/firebase";
import { useDispatch, useSelector } from "react-redux";
import { totalLikes, userprofile } from "../redux/features/user-profile-slice";
import { IoPerson, IoStatsChart, IoMic, 
         IoImage, IoVideocam, IoSend } from "react-icons/io5";
import { IoMdHappy, IoMdSad } from "react-icons/io";
import axios from "axios";
import useInput from "../component/Controllers/custom-hooks/input-hook";
import logo from "../images/Logo.png"
import '../styles/Homepage/homepage.css';
import Popup from "reactjs-popup";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import useHome from "./Controllers/Homepage-controller";


export const Home = () => {
const navigate = useNavigate();
const [write, reset_write] = useInput('');
const dispatch = useDispatch();
const user_card = useSelector((state) => state.user.data);
const { user, quil } = user_card;
const interact = useSelector((state) => state.user.interactions);
const { likes, unlikes, popularity } = interact;
const [pictureFile, setPictureFile] = useState();
const [progress, setProgress] = useState(0);
const [handleQuil, logOut, quilMap] = useHome();

const handlePictureUpload = (e) => {
    e.preventDefault();
    pictureUpload(pictureFile)
}

useEffect(() => {
    const refresh = setInterval(() => {
        (async() => {
            const userRes = await axios.get(`/user/profile/${auth.currentUser.uid}`);
            const quilRes = await axios.get('/user/quil');
            dispatch(userprofile({user: userRes.data, quil: quilRes.data}));
        })();
        (async() => {
            const allLikes = await axios.get(`/user/quil/likesUnlikes/${auth.currentUser.uid}`);
            dispatch(totalLikes(allLikes.data))
        })()
    }, 3000);
    return () => {
        clearInterval(refresh);
    }
}, []);


const pictureUpload = (file) => {
    const storageRef = ref(storage, `users/${auth.currentUser.uid}/posts/${file.name}`);
    const upload = uploadBytesResumable(storageRef, file);
    upload.on("state_changed", (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes) * 100);
        setProgress(progress)
    }, (err) => (console.log(err)), () => {
        getDownloadURL(upload.snapshot.ref).then(async(url) => {
            await axios.patch('/user', {
                uid: auth.currentUser.uid, 
                quils: url
               });
        })
    })
}

return(
<div id="main">
    <div id="header">
        <img id='header-logo' alt={""} src={logo} height="70px"/>
        <img id="user-avi" alt={""} src={user?.profileUrl}/> 
        <nav id="nav-bar">
            <button className="signOut" onClick={() => logOut()} >Sign Out</button>
        </nav>
    </div>
    <div id="body">
        <div id="left-pane">
            <div id="left-pane-items">
                <div id='left-item-one'>
                    <IoPerson style={{verticalAlign: 'middle', color: 'black'}} size='30px'/>
                    <h4>{user?.displayname}</h4>
                </div>
                <div id='left-item-two'>
                    <IoMdHappy style={{verticalAlign: 'middle', color: 'black'}} size='30px'/>
                    <h4>{likes}</h4>
                    <IoMdSad style={{verticalAlign: 'middle', color: 'black'}} size='30px'/>
                    <h4>{unlikes}</h4></div>
                <div id='left-item-three'>
                    <IoStatsChart style={{verticalAlign: 'middle', color: 'black'}} size='30px'/>
                    <h4>{popularity !== undefined ? `${popularity}%` : '...%'}</h4>
                </div>
            </div>
        </div>
        <div id="middle-pane">
            <div id="card-border">
                { quilMap(quil) } 
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
                <button className="send" 
                        onClick={(e) => handleQuil(write.value, reset_write, e)}>
                          send 
                        <IoSend size='20px' style={{verticalAlign: 'middle'}}/>
                </button>
                <div id='icon-group'>
                <Popup trigger = {<button className="icon-buttons">
                                  <IoVideocam style={{verticalAlign: 'middle'}} size='25px'/>
                                  </button>} position={'top center'}>
                    <div id="upload-quil">
                        <input className="change-avi" type={'file'}/>
                        <button className="upload-button">Upload</button>
                        <h4 style={{fontSize: '18px', marginTop: '0rem'}}>Uploading:</h4>
                    </div>
                </Popup>
                <button className="icon-buttons">
                    <IoMic style={{verticalAlign: 'middle'}} size='25px'/>
                </button>
                <Popup trigger = {<button className="icon-buttons">
                                    <IoImage style={{verticalAlign: 'middle'}} size='25px'/>
                                  </button>} position={'top center'}>
                        <div id="upload-quil">
                            <input className="change-avi" type='file' onChange={(e) => setPictureFile(e.target.files[0])}/>
                            <button className="upload-button" onClick={handlePictureUpload}>
                                Upload
                            </button>
                            <h4 style={{fontSize: '18px', marginTop: '0rem'}}>
                                Uploading: {progress}%
                            </h4>
                        </div>
                </Popup>
                </div>
            </div>
        </div>
    </div>
</div>
)

}