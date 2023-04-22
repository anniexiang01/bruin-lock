import React from 'react';
import openLockerImage from './images/open-locker.PNG';
import closedLockerImage from './images/closed-locker.PNG';

function Locker({handleButtonClick, status}) {

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

    return(
    <div className="Locker">
        <div>
            <p>Current status is: {statusText}</p>
            <button className="LockerButton" onClick={handleButtonClick}>
            <img className={lockerClassName} src={imageSrc}/>
            </button>
        </div>
    </div>
    )
}

export default Locker;