import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useImperativeHandle,
  forwardRef,
} from "react";
import "./Player.css";
const Player = forwardRef((props, ref) => {
  const [timeLeft, setTimeLeft] = useState(10 * 60);
  const [isRunning, setIsRunning] = useState(true);
  const timerIdRef = useRef(null);

  const tick = useCallback(() => {
    if (isRunning) {
      setTimeLeft((prevTime) => {
        if (prevTime > 0) {
          return prevTime - 1;
        } else {
          return 0;
        }
      });
    }
  }, [isRunning]);

  useEffect(() => {
    timerIdRef.current = setInterval(tick, 1000);
    return () => clearInterval(timerIdRef.current);
  }, [tick]);

  useEffect(() => {
    if (timeLeft === 0) {
      clearInterval(timerIdRef.current);
    }
  }, [timeLeft]);

  useImperativeHandle(ref, () => ({
    setTime: (time) => setTimeLeft(time),
    start: () => setIsRunning(true),
    stop: () => setIsRunning(false),
  }));

  return (
    <div className="player">
      <div className="left">
        <img src={`${props.player.img}`} alt="Player" />
        <p>
          {props.player.name} ({props.player.rating})
        </p>
      </div>

      <div className="right">
        <p>{`${Math.floor(timeLeft / 60) < 10 ? "0" : ""}${Math.floor(
          timeLeft / 60
        )} : ${timeLeft % 60 < 10 ? "0" : ""}${timeLeft % 60}`}</p>
      </div>
    </div>
  );
});

export default Player;
