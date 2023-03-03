import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaPlay,
  FaPause,
  FaSyncAlt,
} from "react-icons/fa";

let countDown: NodeJS.Timeout | undefined;
const PomodoroClock: React.FC = () => {
  const [breakTime, setBreakTime] = useState<number>(5);
  const [sessionTime, setSessionTime] = useState<number>(25);
  const [sessionMinutes, setSessionMinutes] = useState<number>(25);
  const [sessionSeconds, setSessionSeconds] = useState<number>(0);
  const [timerIsOn, setTimerIsOn] = useState<boolean>(false);
  const [session, setSession] = useState<string>("Session");

  useEffect(() => {
    if (timerIsOn) {
      const seconds: number = sessionMinutes * 60 + sessionSeconds;
      const now: number = Date.now();
      const then: number = now + seconds * 1000;

      countDown = setInterval(() => {
        const secondsLeft: number = Math.round((then - Date.now()) / 1000);
        if (secondsLeft === 0) {
          (document.getElementById("beep") as HTMLAudioElement).play();
          if (session === "Session") {
            startBreak(breakTime);
          } else {
            startSession(sessionTime);
          }
        } else if (sessionMinutes === 0 && sessionSeconds === 0) {
          (document.getElementById("beep") as HTMLAudioElement).play();
          if (session === "Session") {
            startBreak(breakTime);
          } else {
            startSession(sessionTime);
          }
        } else {
          displayTimeLeft(secondsLeft);
        }
      }, 1000);
    } else {
      clearInterval(countDown);
    }

    return () => clearInterval(countDown);
  }, [
    timerIsOn,
    sessionMinutes,
    sessionSeconds,
    breakTime,
    session,
    sessionTime,
  ]);

  const incrementBreakTime = (): void => {
    if (!timerIsOn && breakTime < 60) {
      setBreakTime(breakTime + 1);
    }
  };

  const decrementBreakTime = (): void => {
    if (!timerIsOn && breakTime > 1) {
      setBreakTime(breakTime - 1);
    }
  };

  const incrementSession = (): void => {
    if (!timerIsOn && sessionTime < 60) {
      setSessionTime(sessionTime + 1);
      setSessionMinutes(sessionTime + 1);
      setSessionSeconds(0);
    }
  };

  const decrementSession = (): void => {
    if (!timerIsOn && sessionTime > 1) {
      setSessionTime(sessionTime - 1);
      setSessionMinutes(sessionTime - 1);
      setSessionSeconds(0);
    }
  };

  const startTimer = (): void => {
    setTimerIsOn(!timerIsOn);
  };

  const startSession = (time: number) => {
    setSession("Session");
    setSessionMinutes(time);
    setSessionSeconds(0);
  };

  const startBreak = (breakLength: number): void => {
    setSession("Break");
    setSessionMinutes(breakLength);
    setSessionSeconds(0);
    setTimerIsOn(true);
  };

  const displayTimeLeft = (secondsLeft: number): void => {
    const minutes: number = Math.floor(secondsLeft / 60);
    const seconds: number = secondsLeft % 60;
    setSessionMinutes(minutes);
    setSessionSeconds(seconds);
  };

  const reset = () => {
    setBreakTime(5);
    setSessionTime(25);
    setSessionMinutes(25);
    setSessionSeconds(0);
    setTimerIsOn(false);
    setSession("Session");
    clearInterval(countDown);
    const beep = document.getElementById("beep") as HTMLAudioElement;
    beep.pause();
    beep.currentTime = 0;
  };

  return (
    <div className="pomodoro-clock">
      <div className="session-length">
        <h3 id="break-label" className="text-lg font-bold">
          Break Length
        </h3>
        <div className="interval-container">
          <button
            id="break-increment"
            onClick={incrementBreakTime}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-full p-2"
          >
            <FaArrowUp />
          </button>
          <div id="break-length" className="text-2xl font-bold">
            {breakTime}
          </div>
          <button
            id="break-decrement"
            onClick={decrementBreakTime}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-full p-2"
          >
            <FaArrowDown />
          </button>
        </div>
      </div>
      <div className="session-length">
        <h3 id="session-label" className="text-lg font-bold">
          Session Length
        </h3>
        <div className="interval-container">
          <button
            id="session-increment"
            onClick={incrementSession}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-full p-2"
          >
            <FaArrowUp />
          </button>
          <div id="session-length" className="text-2xl font-bold">
            {sessionTime}
          </div>
          <button
            id="session-decrement"
            onClick={decrementSession}
            className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-full p-2"
          >
            <FaArrowDown />
          </button>
        </div>
      </div>
      <div className="timer">
        <h3 id="timer-label" className="text-lg font-bold">
          {session}
        </h3>
        <div id="time-left" className="text-4xl font-bold">
          {sessionMinutes < 10 ? "0" : ""}
          {sessionMinutes}:{sessionSeconds < 10 ? "0" : ""}
          {sessionSeconds}
        </div>
        <button
          id="start_stop"
          onClick={startTimer}
          className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-full p-2"
        >
          {timerIsOn ? <FaPause /> : <FaPlay />}
        </button>
        <div
          id="reset"
          onClick={reset}
          className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-full p-2"
        >
          <FaSyncAlt />
        </div>
        <audio
          id="beep"
          src="https://www.pacdv.com/sounds/interface_sound_effects/sound10.mp3"
        ></audio>
      </div>
    </div>
  );
};

export default PomodoroClock;
