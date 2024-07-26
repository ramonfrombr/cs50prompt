"use client";
import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { ValueContext } from "../components/promptApi";
import {
  CaseSensitive,
  ChevronRight,
  Pause,
  Play,
  Repeat,
  Timer,
} from "lucide-react";

const Teleprompter = () => {
  const { value } = useContext(ValueContext);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isScrolling, setIsScrolling] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const [rangeValue, setRangeValue] = useState(0.3);
  const [fontSize, setFontSize] = useState(36);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        setIsScrolling(true);
        setIsPaused(!isPaused);
      } else if (event.key === "ArrowUp") {
        scrollUp();
      } else if (event.key === "ArrowDown") {
        scrollDown();
      }
    },
    [isPaused]
  );

  const scrollUp = () => {
    if (textRef.current) {
      textRef.current.scrollTop -= 10;
    }
  };

  const scrollDown = () => {
    if (textRef.current) {
      textRef.current.scrollTop += 10;
    }
  };

  useEffect(() => {
    if (isScrolling && textRef.current) {
      let scrollTop = textRef.current.scrollTop;

      const intervalId = setInterval(() => {
        // start the scrolling where the user left off
        if (scrollTop >= textRef.current!.scrollHeight || isPaused) {
          clearInterval(intervalId);
          setIsScrolling(isPaused); // stop scrolling if paused
          return;
        }

        const scrollIncrement = 1 + rangeValue;
        scrollTop += scrollIncrement; // adjust scrolling speed (higher value for faster scrolling)
        textRef.current!.scrollTop = scrollTop;
      }, 20); // Adjust interval for scrolling smoothness (lower value for smoother scrolling)

      return () => clearInterval(intervalId);
    }

    // cleanup function to prevent memory leaks
  }, [isScrolling, isPaused, rangeValue]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, handleKeyDown]);

  return (
    <div>
      {/* OPTIONS */}
      <header className="fixed top-0 left-0 w-full py-5 flex flex-row gap-10 justify-center">
        <button
          onClick={() => {
            setIsScrolling(true);
            setIsPaused(!isPaused);
          }}
          className={`${
            isPaused ? "bg-blue-400" : "bg-orange-400"
          } border-1 rounded p-3 text-gray-50`}
        >
          {isPaused ? <Play size={20} /> : <Pause size={20} />}
        </button>
        <button
          onClick={(e) => {
            // don't run this code on keydown event
            if (e.type === "click") {
              setIsPaused((current) => true);
              textRef.current!.scrollTop = 0;
            }
          }}
          className="bg-red-600 p-3 rounded text-gray-50"
        >
          <Repeat size={20} />
        </button>
        <div className="flex gap-3">
          <p className="flex gap-3 text-xl items-center">
            <Timer size={40} /> {rangeValue}
          </p>
          <input
            type="range"
            min="0.1"
            step={0.1}
            max="20"
            value={rangeValue}
            onChange={(e) => setRangeValue(Number(e.target.value))}
          />
        </div>
        <div className="flex gap-3">
          <p className="flex gap-3 text-xl items-center">
            <CaseSensitive size={40} /> {fontSize}px
          </p>
          <input
            type="range"
            min="10"
            step={1}
            max="120"
            value={fontSize}
            onChange={(e) => setFontSize(Number(e.target.value))}
          />
        </div>
      </header>

      {/* Black Box */}
      <div className="w-full h-[50vh] bg-black fixed inset-0 m-auto -z-10 flex items-center text-white">
        <ChevronRight size={80} />
      </div>

      {/* Text Wrapper */}
      <div
        className="w-full h-screen flex justify-center overflow-y-hidden"
        style={{ fontSize: `${fontSize}` }}
      >
        <textarea
          ref={textRef}
          value={value || "Text Not Found"}
          className="text-center w-10/12 bg-transparent focus:outline-none border-none text-white h-full overflow-hidden py-[30%]"
          style={{ fontSize: `${fontSize}px` }}
          readOnly
        ></textarea>
      </div>
    </div>
  );
};

export default Teleprompter;
