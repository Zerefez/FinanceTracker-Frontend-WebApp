
import { useEffect, useState } from 'react';

const Clock = () => {
  const [time, setTime] = useState<string>('');

  useEffect(() => {
    const interval = setInterval(() => {
      const currentTime = new Date();
      const options: Intl.DateTimeFormatOptions = {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        timeZone: 'Europe/Copenhagen', // Set time zone for Denmark (DK)
      };
      const formattedTime = currentTime.toLocaleTimeString('en-GB', options);
      setTime(formattedTime);
    }, 1000);

    return () => clearInterval(interval); // Clean up interval on unmount
  }, []);

  return <span>{`GMT+1 (${time}, DK)`}</span>;
};

export default Clock;
