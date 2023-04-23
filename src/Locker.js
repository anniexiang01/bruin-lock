import React from 'react';
import openLockerImage from './images/open-locker.PNG';
import closedLockerImage from './images/closed-locker.PNG';
import Timer from "./Timer";

function Locker({handleButtonClick, status, user, startTime0, lockerTimeRef}) {

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

    let ownerText;
    if (user) {
      ownerText = user + " currently occupies this locker";
    }
    else {
      ownerText = "This locker is currently unoccupied";
    }

    return(
    <div className="Locker">
        <div>
            <p>Current status is: {statusText}</p>
            <p>{ownerText}</p>
            <button className="LockerButton" onClick={handleButtonClick}>
              <img className={lockerClassName} src={imageSrc}/>
            </button>
            <Timer startTime={startTime0} lockerTimeRef={lockerTimeRef}/>
        </div>
    </div>
    )
}

export default Locker;