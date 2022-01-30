import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { auth, storage } from "../services/firebase";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { totalLikes, totalQuils, userprofile } from "../redux/features/user-profile-slice";
import useInput from "../component/Controllers/custom-hooks/input-hook";
import useHome from "./Controllers/Homepage-controller";
import axios from "axios";
import Popup from "reactjs-popup";
import { IoPerson, IoStatsChart, IoMic, 
         IoImage, IoVideocam, IoSend } from "react-icons/io5";
import { IoMdHappy, IoMdSad } from "react-icons/io";
import { FaFeatherAlt } from "react-icons/fa"
import logo from "../images/newLogo.png"
import '../styles/Homepage/homepage.css';
import useMedia from "./Controllers/custom-hooks/media-query-hook";


export const Home = () => {
const xs = useMedia('(max-width: 458px)');
const ss = useMedia('(max-width: 1250px)'); 
const navigate = useNavigate();
const [write, reset_write] = useInput('');
const dispatch = useDispatch();
const user_card = useSelector((state) => state.user.data);
const { user, quil } = user_card;
const interact = useSelector((state) => state.user.interactions);
const { likes, unlikes, popularity } = interact;
const totalQuil = useSelector((state) => state.user.totalQuils);
const [ pictureFile, setPictureFile ] = useState();
const [ videoFile, setVideoFile ] = useState();
const [ progress, setProgress ] = useState(0);
const [ videoProgress, setVideoProgress ] = useState(0);
const [ pictureCaption, setPictureCaption] = useState('');
const [ videoCaption, setVideoCaption] = useState('');
const [ handleQuil, logOut, 
        quilMap, createdAt ] = useHome();


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
        })();
        dispatch(totalQuils(quil?.filter(item => item.uid === auth.currentUser.uid).length));
    }, 3000);
    return () => {
        clearInterval(refresh);
    }
}, [dispatch, quil]);

const handlePictureUpload = (e) => {
    e.preventDefault();
    pictureUpload(pictureFile)
}

const pictureUpload = (file) => {
    if(file.type === "image/jpeg" || file.type === "image/png" ){
        const storageRef = ref(storage, `users/${auth.currentUser.uid}/posts/${file.name}`);
        const upload = uploadBytesResumable(storageRef, file);
        upload.on("state_changed", (snapshot) => {
            const progress = Math.round((snapshot.bytesTransferred/snapshot.totalBytes) * 100);
            setProgress(progress)
        }, (err) => (console.log(err)), () => {
            getDownloadURL(upload.snapshot.ref).then(async(url) => {
                await axios.patch('/user', {
                    uid: auth.currentUser.uid, 
                    quils: `${pictureCaption},${url}`,
                    createdAt: createdAt()
                });
            })
        })
    }
}

const handleVideoUpload = (e) => {
    e.preventDefault();
    videoUpload(videoFile)
}

const videoUpload = (file) => {
    if(file.type === "video/mp4"){
        const storageRef = ref(storage, `users/${auth.currentUser.uid}/posts/${file.name}-videoquil`);
        const upload = uploadBytesResumable(storageRef, file);
        upload.on("state_changed", (snapshot) => {
            const vidProg = Math.round((snapshot.bytesTransferred/ snapshot.totalBytes) * 100);
            setVideoProgress(vidProg);
        }, (err) => console.log(err), () => {
            getDownloadURL(upload.snapshot.ref).then(async(url) => {
                await axios.patch('/user', {
                    uid: auth.currentUser.uid, 
                    quils: `${videoCaption},${url}`,
                    createdAt: createdAt()
                   });
            })
        })
    }
}

return(
<div id="main">
    <div id="header">
        <img id='header-logo' alt={""} src={logo} height="70px"/>
         
        <nav id="nav-bar">
            <button className="signOut" onClick={() => logOut()} >Sign Out</button>
        </nav>
    </div>
    <div id="body">
        <div id="left-pane">
            <div id="left-pane-items">
                <img id="user-avi" alt={""} src={user?.profileUrl}/>
                
                <div id='left-item-one' style={ss === true ? {marginLeft: '-0.5rem'} : null}>
                    <IoPerson style={{verticalAlign: 'middle', color: 'black'}} size='30px'/>
                    
                    <h4 style={xs === true || ss === true ? {fontSize: "17px"} : {fontSize: "21.5px"}}>{user?.displayname}
                    </h4>
                </div>
                <div id='left-item-two' style={ss === true ? {marginLeft: 0, gap: '2rem'} : null}>
                    <span>
                        <IoMdHappy style={{verticalAlign: 'middle', color: 'black'}} size='30px'/>
                     
                        <h4 style={xs === true || ss === true ? {fontSize: "14px"} : {fontSize: "21.5px"}}>{likes}
                        </h4>
                    </span>
                    <span>
                     
                        <IoMdSad style={{verticalAlign: 'middle', color: 'black'}} size='30px'/>
                     
                        <h4 style={xs === true || ss === true ? {fontSize: "14px"} : {fontSize: "21.5px"}}>{unlikes}
                        </h4>
                    </span>
                </div>
                <div id='left-item-three' style={ss === true ? {marginLeft: 0, gap: '2.5rem'} : null}>
                    <span>
                        <IoStatsChart style={{verticalAlign: 'middle', color: 'black'}} size={xs === true || ss === true ? '25px' : '30px'}/>
                     
                        <h4 id = 'popularity' style={xs === true || ss === true ? {fontSize: "14px"} : {fontSize: "21px"}}>{popularity !== undefined ? `${popularity}` : '....'}
                        </h4>
                    </span>
                    
                    <span style={ss === true ? {marginLeft: '0rem', gap: '5px'} : null}>
                        <FaFeatherAlt style={{verticalAlign: 'middle'}} size={xs === true || ss === true ? '20px' : '28px'}/>
                     
                        <h4 style={xs === true || ss === true ? {fontSize: "14px"} : {fontSize: "21px"}}>{totalQuil}
                        </h4>
                    </span>
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
            <div id='menu-items' style={ ss === true ? {width: '80%', padding: '10px 3px 10px 3px'}: null} >
                <button className="menu-buttons" onClick={() => navigate('/home/profile')}
                style={ ss === true ? {width: '90%', fontSize: '14px'}: null}>Profile</button>
                
                <button className="menu-buttons" onClick={() => navigate('/home/explore')}
                style={ ss === true ? {width: '90%', fontSize: '14px'}: null}>Search</button>
                
                <button className="menu-buttons" onClick={() => navigate('/home/videos')}
                style={ ss === true ? {width: '90%', fontSize: '14px'}: null}>Videos</button>
                
                <button className="menu-buttons" onClick={() => navigate('/home/settings')}
                style={ ss === true ? {width: '90%', fontSize: '14px'}: null}>Settings</button>
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
                                  </button>} position={xs === true ? 'top left': 'top center'}>
                    
                    <div id="upload-quil" style={xs === true ? {padding: '20px'}: null}>
                        <input className="change-avi" type='file' onChange={(e) => setVideoFile(e.target.files[0])}/>
                        
                        <textarea className="caption" type='text' placeholder="Add caption" value={videoCaption} onChange={(e) => setVideoCaption(e.target.value)} maxLength='125'/>
                        
                        <button className="upload-button" onClick={handleVideoUpload}>Upload</button>
                        
                        <h4 style={{fontSize: '18px', marginTop: '0rem'}}>
                            Uploading: {videoProgress}%
                        </h4>
                    </div>
                </Popup>
                
                <button className="icon-buttons">
                    <IoMic style={{verticalAlign: 'middle'}} size='25px'/>
                </button>
                
                <Popup trigger = {<button className="icon-buttons">
                                    <IoImage style={{verticalAlign: 'middle'}} size='25px'/>
                                  </button>} position={xs === true ? 'top left': 'top center'}>
                        
                        <div id="upload-quil" style={xs === true ? {padding: '20px'}: null}>                         
                            <input className="change-avi" type='file' onChange={(e) => setPictureFile(e.target.files[0])}/>
                            
                            <textarea className="caption" type='text' placeholder="Add caption" value={pictureCaption} onChange={(e) => setPictureCaption(e.target.value)} maxLength='125'/>
                            
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