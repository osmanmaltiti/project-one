import React from "react";
import '../styles/Card/Card.css';
import {IoMdThumbsUp, IoMdThumbsDown, IoMdMore} from 'react-icons/io';
import Popup from "reactjs-popup";
import useMedia from "./Controllers/custom-hooks/media-query-hook";
import { auth } from "../services/firebase";


export const Card = (props) => {
    const xs = useMedia('(max-width: 395px)');
    const ss = useMedia('(max-width: 910px)');
    const md = useMedia('(max-width: 1128px)');
    const url = props.write
    const handleWrite = () => {
         if(/project-one-2c857.appspot.com/g.test(url)){
             if(/,/g.test(url)){
                let array = url.split(',');
                let [caption, link] = array;
                if(/videoquil/g.test(url)){
                    return <div>
                        {caption} <br />
                        <video id="quil-video" controls>
                            <source src={`${link}`} type="video/mp4"/>
                        </video>   
                    </div> 
                }
                else{
                    return <div>
                        {caption} <br />
                        <img id='quil-image' alt="" src={`${link}`} />
                    </div> 
                }
             }
             else{
                if(/videoquil/g.test(url)){
                    return  <video id="quil-video" controls>
                                <source src={`${url}`} type="video/mp4"/>
                            </video> 
                }
                else{
                    return <img id='quil-image' alt="" src={`${url}`} />
                }
             }
        }
        else{    
            return url
        } 
    }
    
    return(
        <div id='main-card'>
            <div id="top">
                <button id="img-button" onClick={props.profile}>
                    <img id="card-avi" alt={""} src={props.profileImg}/>
                </button>
                <div id='write-area' 
                    style={ xs === true ? {fontSize: '10px'} : 
                            ss === true ? {fontSize: '16px', paddingLeft: "0.5rem"} : 
                            md === true ? {fontSize: '16px', paddingLeft: "0.5rem" } : 
                            null}>
                        { handleWrite() }
                </div>
                <Popup
                    trigger={<button className="icon-button">
                                <IoMdMore size={'25px'}/>
                             </button>} position={'bottom right'}>
                    { auth.currentUser.uid === props.uid &&
                        <button id="popup-delete" onClick={props.delete}>Delete</button>
                    }
                </Popup>
            </div>
            <div id="bottom">
                <div id='userhandle'>
                    @{props.name}
                </div>
                <div id='card-extras'>
                    <div id="card-extras-buttons" style={ xs === true ? {gap: '13px'} : null}>
                    <label>
                        <button type='button' id="like"  onClick={props.likeMe}>            
                            <IoMdThumbsUp className="icons icons-like"  
                                size = { xs === true ? '15px' : '21px'} 
                                style={ {verticalAlign: 'top', color: props.likeState} }/>  
                        </button> 
                    </label>
                        <p>{props.like}</p>
                    <label>
                        <button type='button' id="unlike" onClick={props.unlikeMe}>
                            <IoMdThumbsDown className="icons icons-unlike"  size={ xs === true ? '15px' : '21px'} style={ {verticalAlign: 'top', color: props.unLikeState} }/>
                        </button>
                    </label>
                        <p>{props.unlike}</p></div>
                    <div>{xs === true || ss === true ? null : md === true ? `${props.date}` : `${props.date} at ${props.time}`}</div>
                </div>
            </div>
            <hr style={{color:"black", width:'93%'}} />
        </div>
    )
}
