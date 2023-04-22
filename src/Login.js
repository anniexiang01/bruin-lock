import React from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';
import logo from './images/logo.png';

function Login({setIsAuth}) {

    const signInWithGoogle= () => {
        signInWithPopup(auth, provider)
        .then((result) => {
            console.log(result);
            localStorage.setItem("isAuth", true);
            setIsAuth(true);
        })
        .catch((error) => {
            console.log(error.message);
        })
    }

    return (
        <div className="login">
            <div>
                <img className="LogoImage" src={logo}/>
            </div>

            <div>
                <text className='Title'>Bruin Locks</text>
            </div>
            
            <button className="login-with-google-btn" onClick={signInWithGoogle}>Sign In with Google</button>
        </div>
    )
}

export default Login;
