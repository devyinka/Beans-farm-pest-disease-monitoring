import { useState, useEffect } from "react";

const Clock = () => {
  const [time, setTime] = useState("");
  useEffect(() => {
    const Updateclock = () => {
      const now = new Date();
      let hours = String(now.getHours()).padStart(2, "0");
      const AMPM = Number(hours) >= 12 ? "PM" : "AM";
      const Hours = Number(hours) % 12 || 12;
      const Minutes = String(now.getMinutes()).padStart(2, "0");
      const Seconds = String(now.getSeconds()).padStart(2, "0");

      setTime(`${Hours}: ${Minutes}:${Seconds} ${AMPM}`);
    };
    Updateclock();
    const interval = setInterval(Updateclock, 1000);
    return () => clearInterval(interval);
  }, []);
  return <div className="text-xs font-light">{time}</div>;
};

export default Clock;
