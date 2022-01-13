import React from "react";
import './card.css';
import {IoMdThumbsUp, IoMdThumbsDown, IoMdMore} from 'react-icons/io';

export const Card = (props) => {
    return(
        <div id='main-card'>
            <div id="top">
                <img id="card-avi" alt={"Logo"} src={props.profileImg}/>
                <div id='write-area'>
                    {props.write}
                </div>
                <button className="icon-button">
                    <IoMdMore size={'25px'}/>
                </button>
            </div>
            <div id="bottom">
                <div id='userhandle'>
                    @{props.name}
                </div>
                <div id='card-extras'>
                    <div id="card-extras-buttons">
                    <button className="icon-button">
                        <IoMdThumbsUp size='25px' style={  {verticalAlign: 'top'}}/>
                    </button>    
                    <p>999</p>
                    <button className="icon-button down">
                        <IoMdThumbsDown size='25px' style={{verticalAlign: 'bottom'}}/>
                    </button>
                    <p>999</p>
                    </div>
                    21/12/2021
                </div>
            </div>
            <hr style={{color:"black", width:'93%'}} />
        </div>
    )
}
