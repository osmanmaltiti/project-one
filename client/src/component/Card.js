import React from "react";
import '../styles/Card/Card.css';
import {IoMdThumbsUp, IoMdThumbsDown, IoMdMore} from 'react-icons/io';
import Popup from "reactjs-popup";


export const Card = (props) => {
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
                <button id="img-button" onClick={props.profile}><img id="card-avi" alt={""} src={props.profileImg}/></button>
                <div id='write-area'>
                    { handleWrite() }
                </div>
                <Popup
                    trigger={<button className="icon-button">
                    <IoMdMore size={'25px'}/>
                </button>} position={'bottom right'}>
                    <button id="popup-delete" onClick={props.delete}>Delete</button>
                    </Popup>
            </div>
            <div id="bottom">
                <div id='userhandle'>
                    @{props.name}
                </div>
                <div id='card-extras'>
                    <div id="card-extras-buttons">
                    <label>
                        <button type='button' id="like"  onClick={props.likeMe}>
                            <IoMdThumbsUp className="icons icons-like"  size='21px' style={ {verticalAlign: 'top', color: props.likeState} }/>  
                        </button> 
                    </label>
                        <p>{props.like}</p>
                    <label>
                        <button type='button' id="unlike" onClick={props.unlikeMe}>
                            <IoMdThumbsDown className="icons icons-unlike" size='21px' style={ {verticalAlign: 'top', color: props.unLikeState} }/>
                        </button>
                    </label>
                        <p>{props.unlike}</p></div>
                    <span>
                        {props.date} <strong>at</strong> {props.time}
                    </span>
                </div>
            </div>
            <hr style={{color:"black", width:'93%'}} />
        </div>
    )
}
