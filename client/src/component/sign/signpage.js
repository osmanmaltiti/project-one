import React from "react";
import { useNavigate } from "react-router-dom";
import { auth, storage } from "../services/firebase";
import { ref, uploadBytesResumable } from "firebase/storage";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import axios from 'axios';
import useInput from "./input-hook";
import file from '../services/offset.txt';
import './signpage.css';

export const Sign = () => {
    const navigate = useNavigate();
    const [username, reset_username] = useInput('');
    const [password, reset_password] = useInput('');
    const [fullname, reset_fullname] = useInput('');
    const [displayname, reset_displayname] = useInput('');
    const [email, reset_email] = useInput('');
    const [number, reset_number] = useInput('');
    const [password_reg, reset_password_reg] = useInput('');
    const [con_pass, reset_con_pass] = useInput('');

const handleLogIn = async(event) => {
    event.preventDefault();
    reset_username(); reset_password();
    try {
        await signInWithEmailAndPassword(auth, username.value, password.value);
    } catch (error) {
        alert(`Error message: ${error}`);
        return;
    }
    navigate('/home');
}

const handleSignUp = async(event) => {
    event.preventDefault();
    const defaultProfile = process.env.REACT_APP_DEFAULT_PROFILE_URL;
    reset_fullname(); reset_displayname();
    reset_email(); reset_number();
    reset_password_reg(); reset_con_pass();
    try{
        const newUser = await createUserWithEmailAndPassword(auth, email.value, password_reg.value);
        const storageRef = ref(storage, `/users/${auth.currentUser.uid}/profile`);
        await uploadBytesResumable(storageRef, file);
        navigate('/home');
        await axios.post('/user', {
            uid: newUser.user.uid, fullname: fullname.value, 
            displayname: displayname.value,
            email: email.value, number: number.value,
            profileUrl: defaultProfile
        });
    }
    catch(err){ console.log(err); }
}

return(
    <div id="main-sign">
        <div id="content">
            <div id="signIn">
                <h3>Sign In</h3>
                <form id="signIn-form" onSubmit={handleLogIn}>
                    <input className="sign-input" type='email' placeholder="Email/Username" {...username}/>
                    <input className="sign-input" type='password' placeholder="Password" {...password}/>
                    <button className='sign-button' type="submit">Sign In</button>
                </form>
                <button className="sign-google" >Continue With Google</button>
                <button className="sign-google">Continue With Twitter</button>
            </div>
            <hr color="black"/>
            <div id="signUp">
                <h3>Sign Up</h3>
                <form id="signUp-form" onSubmit={handleSignUp}>
                <input className="sign-input" type='text' placeholder="Full Name" {...fullname}/>
                <input className="sign-input" type='text' placeholder="Display Name" {...displayname}/>
                <input className="sign-input" type='email' placeholder="Email Address" {...email}/>
                <input className="sign-input" type='number' placeholder="Phone Number(Optional)" {...number}/>
                <input className="sign-input" type='password' placeholder="Password" {...password_reg}/>
                <input className="sign-input" type='password' placeholder="Confirm password" {...con_pass}/>
                <button className='sign-button' type="submit">Register</button>
                </form>
            </div>
        </div>
    </div>
    )
}