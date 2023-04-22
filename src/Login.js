import React from 'react';
import { auth, provider } from './firebase';
import { signInWithPopup } from 'firebase/auth';

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
        <div classname="login">
            <p>Sign In WIth Google to Continue</p>
            <button className="login-with-google-btn" onClick={signInWithGoogle}>Sign In With Google</button>
        </div>
    )
}

export default Login;
