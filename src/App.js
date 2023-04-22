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

  // Update the value of status in the database
  useEffect(() => {
    onValue(statusRef, (snapshot) => {
      const value = snapshot.val();
      setStatus(value);
    });
  }, [statusRef]);

  useEffect(() => {
    onValue(statusRef2, (snapshot) => {
      const value = snapshot.val();
      setStatus2(value);
    });
  }, [statusRef2]);
  
  const handleButtonClick = () => {
    const newStatus = status === 0 ? 1 : 0;
    set(statusRef, newStatus);
  };

  const handleButtonClick2 = () => {
    const newStatus = status2 === 0 ? 1 : 0;
    set(statusRef2, newStatus);
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