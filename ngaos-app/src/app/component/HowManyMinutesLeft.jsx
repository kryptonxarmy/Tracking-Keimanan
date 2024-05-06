import React, { useState, useEffect } from 'react';
import moment from 'moment';

const HowManyMinutesLeft = ({ targetTime }) => {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const calculateTimeLeft = () => {
      const diff = moment(targetTime).diff(moment(), 'minutes');
      const formattedTimeLeft = moment.duration(diff, 'minutes').humanize();
      setTimeLeft(formattedTimeLeft);
    };

    calculateTimeLeft();

    const interval = setInterval(calculateTimeLeft, 60000); // Update every minute

    return () => clearInterval(interval);
  }, [targetTime]);

  return (
    <div>
      {timeLeft ? (
        <p>Time left: {timeLeft}</p>
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
};

export default HowManyMinutesLeft;
