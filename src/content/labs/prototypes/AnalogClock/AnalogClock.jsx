import React, { useEffect, useState } from 'react';
import './AnalogClock.css';

const gradients = [
  "from 0deg at 50.00% 50.00%, #00181F 0deg, #0085FF 180deg, #8CF8FF 360deg",
  "from 0deg at 50.00% 50.00%, #00071F 0deg, #0038FF 180deg, #8CF1FF 360deg",
  "from 0deg at 50.00% 50.00%, #0E001F 0deg, #8000FF 180deg, #CD8CFF 360deg",
  "from 0deg at 50.00% 50.00%, #1F000F 0deg, #FF00B8 180deg, #E18CFF 360deg",
  "from 0deg at 50.00% 50.00%, #1F0000 0deg, #FF0F00 180deg, #FFA18C 360deg",
  "from 0deg at 50.00% 50.00%, #1F0D00 0deg, #FF5C00 180deg, #FFBC8C 360deg",
  "from 0deg at 50.00% 50.00%, #1F1600 0deg, #FFC700 180deg, #FFC38C 360deg",
  "from 0deg at 50.00% 50.00%, #151F00 0deg, #FAFF00 180deg, #E8FF8C 360deg",
  "from 0deg at 50.00% 50.00%, #001F0B 0deg, #00FF85 180deg, #8CFFD6 360deg",
  "from 0deg at 50.00% 50.00%, #001F01 0deg, #00FF29 180deg, #8CFFC8 360deg",
  "from 0deg at 50.00% 50.00%, #6D6D6D 0deg, #969696 180deg, #FFFFFF 360deg",
  "from 0deg at 50.00% 50.00%, #171817 0deg, #444947 180deg, #C0C0C0 360deg"
];

const AnalogClock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const secondsAngle = (time.getSeconds() * 6) + 'deg';
  const minutesAngle = (time.getMinutes() * 6 + time.getSeconds() / 60) + 'deg';
  const hoursAngle = ((time.getHours() % 12) / 12 * 360 + time.getMinutes() / 12 * 30) + 'deg';

  let startPosition = (time.getMinutes() * 6) + 'deg';
  let endPosition = (time.getHours() % 12) * 30 + 'deg';

  if ((time.getMinutes() * 6) > ((time.getHours() % 12) * 30)) {
    startPosition = ((time.getMinutes() * 6) - 360) + 'deg';
    endPosition = ((time.getHours() % 12) * 30 - parseInt(startPosition)) + 'deg';
  }

  const interval = 2;
  const nowHour = time.getHours();
  const indexColor = Math.floor(nowHour / interval) % gradients.length;

  const changeGrad = gradients[indexColor];

  return (
    <div className="clock-container">
        <div
        id="clock"
        className="clock relative w-64 h-64 rounded-full bg-gradient-to-r"
        style={{
            '--gradient': changeGrad,
            '--second-pointer-degrees': secondsAngle,
            '--minute-pointer-degrees': minutesAngle,
            '--hour-pointer-degrees': hoursAngle,
            '--start': startPosition,
            '--end': endPosition
        }}
        >
            <div className="pointer hour-pointer"></div>
            <div className="pointer minute-pointer"></div>
            <div className="pointer second-pointer"></div>
        </div>
    </div>
  );
};

export default AnalogClock;