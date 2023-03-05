import React, { useState, useEffect } from "react";
import {
  FaArrowUp,
  FaArrowDown,
  FaPlay,
  FaPause,
  FaSyncAlt,
} from "react-icons/fa";

let countDown: NodeJS.Timeout;
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
    <div className="flex items-center justify-center h-screen bg-slate-500">
      <div className="pomodoro-clock flex flex-col items-center py-20 w-11/12 sm:w-8/12 lg:w-2/5 2xl:w-1/3 gap-14 bg-slate-700 rounded-3xl">
        <div className="text-4xl font-bold text-slate-700 bg-gray-100 py-3 px-5 rounded-md">
          <h1>POMODORO CLOCK</h1>
        </div>
        <div className="flex gap-10">
          <div className="break-length text-white flex flex-col gap-2">
            <h3 id="break-label" className="text-xl font-bold mx-auto">
              Break Length
            </h3>
            <div className="interval-container flex gap-5 mx-auto">
              <button
                id="break-decrement"
                onClick={decrementBreakTime}
                className="bg-gray-100 text-gray-900 text-lg hover:bg-gray-400 rounded-full p-3"
              >
                <FaArrowDown />
              </button>
              <div id="break-length" className="text-4xl font-bold">
                {breakTime}
              </div>
              <button
                id="break-increment"
                onClick={incrementBreakTime}
                className="bg-gray-100 text-gray-900 text-lg hover:bg-gray-400 rounded-full p-3"
              >
                <FaArrowUp />
              </button>
            </div>
          </div>
          <div className="session-length text-white flex flex-col gap-2">
            <h3 id="session-label" className="text-xl font-bold mx-auto">
              Session Length
            </h3>
            <div className="interval-container flex gap-5 mx-auto">
              <button
                id="session-decrement"
                onClick={decrementSession}
                className="bg-gray-100 text-gray-900 text-lg hover:bg-gray-400 rounded-full p-3"
              >
                <FaArrowDown />
              </button>
              <div id="session-length" className="text-4xl font-bold">
                {sessionTime}
              </div>
              <button
                id="session-increment"
                onClick={incrementSession}
                className="bg-gray-100 text-gray-900 text-lg hover:bg-gray-400 rounded-full p-3"
              >
                <FaArrowUp />
              </button>
            </div>
          </div>
        </div>
        <div className="timer grid justify-items-center gap-5 bg-gray-100 text-slate-700 rounded-full p-10">
          <h3 id="timer-label" className="text-4xl font-bold">
            {session}
          </h3>
          <div id="time-left" className="text-8xl font-bold mb-5">
            {sessionMinutes < 10 ? "0" : ""}
            {sessionMinutes}:{sessionSeconds < 10 ? "0" : ""}
            {sessionSeconds}
          </div>
          <div className="flex gap-5 text-3xl">
            <button
              id="start_stop"
              onClick={startTimer}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-full p-3"
            >
              {timerIsOn ? <FaPause /> : <FaPlay />}
            </button>
            <button
              id="reset"
              onClick={reset}
              className="bg-gray-300 text-gray-700 hover:bg-gray-400 rounded-full p-3"
            >
              <FaSyncAlt />
            </button>
          </div>
          <audio
            id="beep"
            src="https://www.pacdv.com/sounds/interface_sound_effects/sound10.mp3"
          ></audio>
        </div>
      </div>
    </div>
  );
};

export default PomodoroClock;
