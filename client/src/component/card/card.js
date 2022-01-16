import React from "react";
import './card.css';
import {IoMdThumbsUp, IoMdThumbsDown, IoMdMore} from 'react-icons/io';
import Popup from "reactjs-popup";

export const Card = (props) => {
    return(
        <div id='main-card'>
            <div id="top">
                <img id="card-avi" alt={"Logo"} src={props.profileImg}/>
                <div id='write-area'>
                    {props.write}
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
                        <input type={'radio'} value="like" name="likeUnlike" onChange={props.likeMe}/>
                        <IoMdThumbsUp className="icons icons-like"  size='25px' style={ {verticalAlign: 'top'} }/>   
                    </label>
                        <p>{props.like}</p>
                    <label>
                        <input type={'radio'} value="unlike" name='likeUnlike' onChange={props.unlikeMe}/>
                        <IoMdThumbsDown className="icons icons-unlike" size='25px' style={ {verticalAlign: 'top'} }/>
                    </label>
                        <p>{props.unlike}</p></div>
                    12/1/2022
                </div>
            </div>
            <hr style={{color:"black", width:'93%'}} />
        </div>
    )
}
