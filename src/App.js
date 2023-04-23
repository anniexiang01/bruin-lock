import "./App.css";
import Login from "./Login";
import { auth, db } from "./firebase";
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

  const admin = 'Annie Xiang';

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
  const locker1TimeRef = ref(database, "locker1Time");
  const locker2TimeRef = ref(database, "locker2Time");
  const [locker1Time, setLocker1Time] = useState(0);
  const [locker2Time, setLocker2Time] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [startTime2, setStartTime2] = useState(new Date());

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

  useEffect(() => {
    onValue(locker1TimeRef, (snapshot) => {
      const value = snapshot.val();
      setLocker1Time(value);
    });
  }, [locker1TimeRef]);

  useEffect(() => {
    onValue(locker2TimeRef, (snapshot) => {
      const value = snapshot.val();
      setLocker2Time(value);
    });
  }, [locker2TimeRef]);

  useEffect(() => {
    if (locker1Time === 1) {
      set(statusRef, 1); // Set status to 1 (open) when locker1Time is greater than 0
      set(locker1UserRef, null);
    }
  }, [locker1Time, statusRef, locker1UserRef]);

  useEffect(() => {
    if (locker2Time === 1) {
      set(statusRef2, 1); // Set status to 1 (open) when locker2Time is greater than 0
      set(locker2UserRef, null);
    }
  }, [locker2Time, statusRef2, locker2UserRef]);

  const handleButtonClick = () => {
    let newStatus;
    let newUser;
    if (status === 0){ //closed
      if (auth.currentUser.displayName === locker1User || auth.currentUser.displayName === admin) {
        newStatus = 1;
        newUser = null;
        setStartTime(null);  // starts locker2 timer
      }
      else {
        newStatus = 0;
        newUser = locker1User;
      }
    }
    else {
      newUser = auth.currentUser.displayName;
      newStatus = 0;  
      setStartTime(new Date());   // starts locker1 timer
    }

    set(statusRef, newStatus);
    set(locker1UserRef, newUser);
  };

  const handleButtonClick2 = () => { 

    let newStatus;
    let newUser;
    if (status2 === 0){ //closed
      if (auth.currentUser.displayName === locker2User || auth.currentUser.displayName === admin) {
        newStatus = 1;
        newUser = null;
        setStartTime2(null);  // starts locker2 timer
      }
      else {
        newStatus = 0;
        newUser = locker2User;
      }
    }
    else {
      newUser = auth.currentUser.displayName;
      newStatus = 0;  
      setStartTime2(new Date());  // starts locker2 timer
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
              <Locker handleButtonClick={handleButtonClick} status={status} user={locker1User} startTime0={startTime} lockerTimeRef={locker1TimeRef}/>
              <Locker handleButtonClick={handleButtonClick2} status={status2} user={locker2User} startTime0={startTime2} lockerTimeRef={locker2TimeRef}/>
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
  