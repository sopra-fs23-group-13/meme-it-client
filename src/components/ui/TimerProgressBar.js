import "styles/ui/Spinner.scss";
import { useMemo } from "react";
import ProgressBar from "react-bootstrap/ProgressBar";
import useInterval from "hooks/useInterval";
import { Spinner } from "components/ui/Spinner";

const TimerProgressBar = ({
  delay,
  time,
  now,
  callbackFunc,
  isPlaying,
  max,
  ...props
}) => {
  // useTimeout(callbackFunc, time);
  useInterval(
    () => {
      callbackFunc();
    },
    // Delay in milliseconds or null to stop it
    isPlaying ? delay : null
  );
  const timeLeft = useMemo(() => (max - now) / delay, [now]);
  return (
    <div className="timer-progressbar">
      {!timeLeft ? (
        <Spinner />
      ) : (
        <ProgressBar
          variant="info"
          now={now}
          label={`${timeLeft} ${timeLeft <= 1 ? "sec left" : "secs left"}`}
          animated
          className="h-8"
          max={max}
          {...props}
        />
      )}
    </div>
  );
};
export default TimerProgressBar;
