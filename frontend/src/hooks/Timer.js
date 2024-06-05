import { useState, useEffect, useRef, useCallback } from 'react';

const useTimer = (initialTime) => {
  const [timeLeft1, setTimeLeft1] = useState(initialTime);
  const [timeLeft2, setTimeLeft2] = useState(initialTime);
  const [isRunning1, setIsRunning1] = useState(true);
  const timerIdRef = useRef(null);

  const tick = useCallback(() => {
    if (isRunning1) {
      setTimeLeft1(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return 0;
        }
      });
    } else {
      setTimeLeft2(prevTime => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return 0;
        }
      });
    }
  }, [isRunning1]);

  useEffect(() => {
    timerIdRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerIdRef.current);
  }, [tick]);

  useEffect(() => {
    if (timeLeft1 === 0 && timeLeft2 === 0) {
      clearInterval(timerIdRef.current);
    }
  }, [timeLeft1, timeLeft2]);

  const toggle = () => {
    setIsRunning1(prevState => !prevState);
  };

  return { timeLeft1, timeLeft2, toggle };
};

export default useTimer;
