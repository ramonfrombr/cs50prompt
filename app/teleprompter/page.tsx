"use client";
import { useContext, useState } from "react";
import { ValueContext } from "../components/promptApi";
import {
  CaseSensitive,
  ChevronRight,
  Pause,
  Play,
  Square,
  Timer,
} from "lucide-react";

const Teleprompter = () => {
  const { value } = useContext(ValueContext);

  const [rangeValue, setRangeValue] = useState(0.3);
  const [fontSize, setFontSize] = useState(36);

  return (
    <div>
      {/* OPTIONS */}
      <header className="fixed top-0 left-0 w-full py-5 flex flex-row gap-10 justify-center">
        <button className={`bg-black border-1 rounded p-3 text-gray-50`}>
          <Play size={20} />
        </button>
        <button className="bg-red-600 p-3 rounded text-gray-50">
          <Pause size={20} />
        </button>
        <div className="flex gap-3">
          <p className="flex gap-3 text-xl items-center">
            <Timer size={20} /> {rangeValue}
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
      <div className="w-full h-72 bg-black fixed inset-0 m-auto -z-10 flex items-center">
        <ChevronRight size={80} />
      </div>

      {/* Text Wrapper */}
      <div
        className="w-full h-screen flex justify-center overflow-y-hidden"
        style={{ fontSize: `${fontSize}` }}
      >
        <textarea
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
