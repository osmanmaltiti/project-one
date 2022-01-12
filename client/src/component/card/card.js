import React from "react";
import './card.css';
import {IoCaretUp, IoCaretDown} from 'react-icons/io5';

export const Card = (props) => {
    return(
        <div id='main-card'>
            <div id="top">
                <img id="card-avi" alt={"Logo"} src={props.profileImg}/>
                <div id='write-area'>
                    {props.write}
                </div>
            </div>
            <div id="bottom">
                <div id='userhandle'>
                    {props.name}
                </div>
                <div id='card-extras'>
                    <div id="card-extras-buttons">
                    <IoCaretUp size='30px' style={{verticalAlign: 'middle'}}/>
                    <p>999</p>
                    <IoCaretDown size='30px' style={{verticalAlign: 'middle'}}/>
                    <p>999</p>
                    </div>
                    21/12/2021
                </div>
            </div>
        </div>
    )
}
