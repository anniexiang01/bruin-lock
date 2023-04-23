import "./App.css";
import Login from "./Login";
import { auth, db } from "./firebase";
import { uid } from "uid";
import { getDatabase, set, ref, onValue, remove, update } from "firebase/database";
import { useState, useEffect } from "react";
import { signOut } from "firebase/auth";
import Locker from "./Locker";

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
  const [status2, setStatus2] = useState(0);
  const database = getDatabase();
  const statusRef = ref(database, 'status');
  const statusRef2 = ref(database, 'status2');
  const [locker1User, setLocker1User] = useState(0);
  const [locker2User, setLocker2User] = useState(0);
  const locker1UserRef = ref(database, 'locker1User');
  const locker2UserRef = ref(database, 'locker2User');

  // Update the value of status in the database
  useEffect(() => {
    onValue(statusRef, (snapshot) => {
      const value = snapshot.val();
      setStatus(value);
    });
  }, [statusRef]);

  useEffect(() => {
    onValue(locker1UserRef, (snapshot) => {
      const value = snapshot.val();
      setLocker1User(value);
    });
  }, [locker1UserRef]);
  
  useEffect(() => {
    onValue(statusRef2, (snapshot) => {
      const value = snapshot.val();
      setStatus2(value);
    });
  }, [statusRef2]);

  useEffect(() => {
    onValue(locker2UserRef, (snapshot) => {
      const value = snapshot.val();
      setLocker2User(value);
    });
  }, [locker2UserRef]);
  
  const handleButtonClick = () => {
    const newStatus = status === 0 ? 1 : 0;
    let newUser;

    if (status === 1) {
      newUser = auth.currentUser.uid;
    }
    else {
      newUser = null;
    }

    set(statusRef, newStatus);
    set(locker1UserRef, newUser);
  };

  const handleButtonClick2 = () => {
    const newStatus = status2 === 0 ? 1 : 0;
    let newUser;

    if (status2 === 1) {
      newUser = auth.currentUser.uid;
    }
    else {
      newUser = null;
    }

    set(statusRef2, newStatus);
    set(locker2UserRef, newUser);
    
  };

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
          
            <div style={{ display: 'flex' }}>
              <Locker handleButtonClick={handleButtonClick} status={status} />
              <Locker handleButtonClick={handleButtonClick2} status={status2} />
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