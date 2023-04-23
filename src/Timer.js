import React, { useState, useEffect } from 'react';
import { set } from "firebase/database";


function Timer({startTime, lockerTimeRef}) {
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const timeDiff = startTime ? (startTime.getTime() + 10000) - now : 0;
      // const minutes = Math.floor(timeDiff / (60 * 1000));
      // const seconds = timeDiff % (60 * 1000);
      // const formattedTime = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
      setTimeLeft(timeDiff > 0 ? timeDiff : 0);
      set(lockerTimeRef, formatTime(timeDiff) > 0 ? formatTime(timeDiff) : 0);
    }, 1000);
    return () => clearInterval(interval);
  }, [startTime]);

  const formatTime = (time) => {
    const seconds = Math.floor(time / 1000);
    return seconds;
  };

  const timerText = timeLeft > 0 ? 'normal' : 'clear';

  return (
    <div>
      <text className={timerText}>Time left: {formatTime(timeLeft) > 0 ? formatTime(timeLeft) - 1 : 0}s</text>
    </div>
  );
}

export default Timer;
