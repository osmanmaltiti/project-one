import React from "react";
import useSignpage from "./Controllers/Signpage-contoller";
import useInput from "../component/Controllers/custom-hooks/input-hook";
import '../styles/Signpage/Signpage.css';

export const Sign = () => {
  const [username] = useInput('');
  const [password] = useInput('');
  const [fullname] = useInput('');
  const [displayname] = useInput('');
  const [email] = useInput('');
  const [number] = useInput('');
  const [password_reg] = useInput('');
  const [con_pass] = useInput('');
  const [handleLogIn, handleSignUp, createdAt] = useSignpage();

  const loggings = {username: username.value, password: password.value};
  const signups = {
                   fullname: fullname.value,
                   displayname: displayname.value,
                   email: email.value,
                   number:number.value,
                   password_reg: password_reg.value,
                   createdAt: createdAt()
                  }

return(
    <div id="main-sign">
        <div id="content">
            <div id="signIn">
                <h3>Sign In</h3>
                <form id="signIn-form" onSubmit={(e) => handleLogIn(loggings, e)}>
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
                <form id="signUp-form" onSubmit={(e) => handleSignUp(signups, e)}>
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