import "./App.css";
import Login from "./Login";
import { auth, db } from "./firebase";
import { uid } from "uid";
import { getDatabase, set, ref, onValue, remove, update } from "firebase/database";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";

import openLockerImage from './images/open-locker.PNG';
import closedLockerImage from './images/closed-locker.PNG';
import logo from './images/logo.png';

function App() {
  const [isAuth, setIsAuth] = useState(false); // holds if user is logged in

  const signUserOut = () => {
    signOut(auth).then(() => {
      localStorage.clear()
      setIsAuth(false);
    });
  };


  //set status
  const [status, setStatus] = useState(0);
  const database = getDatabase();
  const statusRef = ref(database, 'status');

  useEffect(() => {
    onValue(statusRef, (snapshot) => {
      const value = snapshot.val();
      setStatus(value);
    });
  }, [statusRef]);
  
  const handleButtonClick = () => {
    const newStatus = status === 0 ? 1 : 0;
    set(statusRef, newStatus);
  };

  let imageSrc;
  let lockerClassName;
  if (status === 0) {
    imageSrc = closedLockerImage;
    lockerClassName = 'ClosedLockerImage';
  } else if (status === 1) {
    imageSrc = openLockerImage;
    lockerClassName = 'OpenLockerImage';
  } else {
    //buttonText = 'Invalid status';
  }

  let statusText;
  if (status === 0) {
    statusText = "Locked";
  } else {
    statusText = "Open";
  }

  

  return (
    <>
      {isAuth ? (
        <div className="App">
          <div className="Homepage">
            <div>
              <img className="HomepageImage" src={logo}/>
            </div>
            <div className="WelcomeText">
              Welcome back, {auth.currentUser.displayName}!
            </div>
          
            <div>
              <button onClick={signUserOut}>Sign Out</button>
            </div>
          
            <div>
              <p>Current status is: {statusText}</p>
              <button className="LockerButton" onClick={handleButtonClick}>
                <img className={lockerClassName} src={imageSrc}/>
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="App">
          <Login setIsAuth={setIsAuth} />
        </div>
        
      )}
    </>
  );
}
  
export default App;
  

// npm install firebase
// npm install sass