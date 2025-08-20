"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { useRouter } from "next/navigation";
import {
  CaseSensitive,
  ChevronDown,
  ChevronRight,
  ChevronUp,
  FlipVertical2,
  MinusCircle,
  PanelLeftDashed,
  Pause,
  Play,
  PlusCircle,
  Repeat,
  Timer,
} from "lucide-react";
import debounce from "lodash.debounce";

const TeleprompterSlugPage = ({ params }: { params: { slug: string } }) => {
  const [promptText, setPromptText] = useState("");
  const router = useRouter();

  const [turnAround, setTurnAround] = useState(false);

  const textRef = useRef<HTMLTextAreaElement>(null);
  const [isScrolling, setIsScrolling] = useState(true);
  const [isPaused, setIsPaused] = useState(true);
  const [rangeValue, setRangeValue] = useState(0.02);
  const [fontSize, setFontSize] = useState(50);
  const [marginValue, setMarginValue] = useState(10);

  const debounceFontSizeChange = debounce(
    (val: number) => handleFontSizeChange(val),
    500
  );

  const handleFontSizeChange = (value: number) => {
    sendDefineFontSize(value);
  };

  const debounceScrollSpeedChange = debounce(
    (val: number) => handleScrollSpeedChange(val),
    500
  );

  const handleScrollSpeedChange = (value: number) => {
    sendDefineScrollSpeed(value);
  };

  const debounceMarginChange = debounce(
    (val: number) => handleMarginChange(val),
    500
  );

  const handleMarginChange = (value: number) => {
    sendDefineMargin(value);
  };

  const sendStartPrompt = useCallback(() => {
    socket.emit("send_start_prompt", params.slug);
  }, [params.slug]);

  const sendScrollUp = useCallback(() => {
    if (!isPaused) {
      sendStartPrompt();
      setTimeout(() => {
        socket.emit("send_scroll_up", params.slug);
      }, 100);
      setTimeout(() => {
        sendStartPrompt();
      }, 200);
    } else {
      socket.emit("send_scroll_up", params.slug);
    }
  }, [isPaused, params.slug, sendStartPrompt]);

  const sendScrollDown = useCallback(() => {
    if (!isPaused) {
      sendStartPrompt();
      setTimeout(() => {
        socket.emit("send_scroll_down", params.slug);
      }, 100);
      setTimeout(() => {
        sendStartPrompt();
      }, 200);
    } else {
      socket.emit("send_scroll_down", params.slug);
    }
  }, [isPaused, sendStartPrompt, params.slug]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === " ") {
        event.preventDefault();
        sendStartPrompt();
      } else if (event.key === "ArrowUp") {
        sendScrollUp();
      } else if (event.key === "ArrowDown") {
        sendScrollDown();
      }
    },
    [sendStartPrompt, sendScrollUp, sendScrollDown]
  );

  const scrollUp = () => {
    if (textRef.current) {
      textRef.current.scrollTop -= 2;
    }
  };

  const scrollDown = () => {
    if (textRef.current) {
      textRef.current.scrollTop += 2;
    }
  };

  const sendRestartPrompt = () => {
    socket.emit("send_restart_prompt", params.slug);
  };

  const sendDefineFontSize = (size: number) => {
    console.log(size);
    socket.emit("send_define_font_size", params.slug, size);
  };

  const sendDefineScrollSpeed = (value: number) => {
    console.log(value);
    socket.emit("send_define_scroll_speed", params.slug, value);
  };

  const sendDefineMargin = (value: number) => {
    console.log(value);
    socket.emit("send_define_margin", params.slug, value);
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
      }, 50); // Adjust interval for scrolling smoothness (lower value for smoother scrolling)

      return () => clearInterval(intervalId);
    }

    // cleanup function to prevent memory leaks
  }, [isScrolling, isPaused, rangeValue]);

  useEffect(() => {
    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [isPaused, handleKeyDown]);

  useEffect(() => {
    const joinRoom = () => {
      socket.emit("join_room", params.slug);
    };

    const getPromptText = () => {
      socket.emit("get_prompt_text", params.slug);
    };

    const receivePromptText = (data: any) => {
      setPromptText(data);
    };

    joinRoom();
    getPromptText();

    socket.on("receive_prompt_text", receivePromptText);

    socket.on("receive_start_prompt", () => {
      setIsScrolling(true);
      setIsPaused(!isPaused);
    });

    socket.on("receive_restart_prompt", () => {
      setIsPaused((current) => true);
      textRef.current!.scrollTop = 0;
    });

    socket.on("receive_define_font_size", (size) => {
      console.log("RECEIVE_DEFINE_FONT_SIZE");
      setFontSize((current) => size);
    });

    socket.on("receive_define_scroll_speed", (size) => {
      console.log("RECEIVE_DEFINE_SCROLL_SPEED");
      setRangeValue((current) => size);
    });

    socket.on("receive_define_margin", (margin) => {
      console.log("RECEIVE_DEFINE_MARGIN");
      setMarginValue((current) => margin);
    });

    socket.on("receive_scroll_up", () => {
      scrollUp();
    });

    socket.on("receive_scroll_down", () => {
      scrollDown();
    });
  }, [params.slug, router, isPaused]);

  return (
    <div>
      {/* OPTIONS */}
      <header className="fixed top-0 left-0 w-full py-5 px-5 justify-start z-50 flex sm:flex-row flex-col items-start sm:items-center gap-10 overflow-y-auto sm:h-[15vh]">
        <div className="grid sm:flex gap-4 grid-cols-2 w-[40%] sm:w-auto">
          <button
            onClick={() => {
              sendStartPrompt();
            }}
            className={`${
              isPaused ? "bg-blue-400" : "bg-orange-400"
            } border-1 rounded p-3 text-gray-50 aspect-square flex items-center justify-center`}
          >
            {isPaused ? <Play size={20} /> : <Pause size={20} />}
          </button>
          <button
            onClick={(e) => {
              // don't run this code on keydown event
              if (e.type === "click") {
                sendRestartPrompt();
              }
            }}
            className="bg-red-600 p-3 rounded text-gray-50 aspect-square  flex items-center justify-center"
          >
            <Repeat size={20} />
          </button>
          <button
            onClick={() => setTurnAround((current) => !current)}
            className="bg-purple-600 p-3 rounded text-gray-50 hidden sm:block"
          >
            <FlipVertical2 size={20} />
          </button>
          <button
            onClick={() => sendScrollUp()}
            className="bg-black p-3 rounded text-gray-50 aspect-square flex items-center justify-center"
          >
            <ChevronUp size={20} />
          </button>
          <button
            onClick={() => sendScrollDown()}
            className="bg-black p-3 rounded text-gray-50 aspect-square flex items-center justify-center"
          >
            <ChevronDown size={20} />
          </button>
        </div>
        <div className="flex gap-3">
          <span className="flex gap-3 text-xl items-center w-[100px]">
            <Timer size={40} /> {rangeValue}
          </span>
          <div className="flex items-center gap-2">
            <MinusCircle
              onClick={() =>
                debounceScrollSpeedChange(Number(rangeValue - 0.05))
              }
            />
            <input
              type="range"
              min="0.05"
              step={0.05}
              max="2"
              /*onChange={(e) => setRangeValue(Number(e.target.value))}*/
              onChange={(e) =>
                debounceScrollSpeedChange(Number(e.target.value))
              }
            />
            <PlusCircle
              onClick={() =>
                debounceScrollSpeedChange(Number(rangeValue + 0.05))
              }
            />
          </div>
        </div>
        <div className="flex gap-3">
          <span className="flex gap-3 text-xl items-center w-[100px]">
            <CaseSensitive size={40} /> {fontSize}
          </span>
          <div className="flex items-center gap-2">
            <MinusCircle
              onClick={() => debounceFontSizeChange(Number(fontSize - 2))}
            />
            <input
              type="range"
              min="10"
              step={2}
              max="100"
              onChange={(e) => debounceFontSizeChange(Number(e.target.value))}
            />
            <PlusCircle
              onClick={() => debounceFontSizeChange(Number(fontSize + 2))}
            />
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span className="flex gap-3 text-xl items-center w-[100px]">
            <PanelLeftDashed size={40} /> {marginValue}
          </span>
          <div className="flex items-center gap-2">
            <MinusCircle
              onClick={() => debounceMarginChange(Number(marginValue) - 10)}
            />
            <input
              type="range"
              min="10"
              step={10}
              max="500"
              /*onChange={(e) => setMarginValue(Number(e.target.value))}*/
              onChange={(e) => debounceMarginChange(Number(e.target.value))}
            />
            <PlusCircle
              onClick={() => debounceMarginChange(Number(marginValue) + 10)}
            />
          </div>
        </div>
      </header>

      {/* Black Box */}
      <div className="w-full h-[70vh] bg-black fixed inset-0 m-auto -z-10 sm:flex items-center text-white hidden">
        <ChevronRight size={80} />
      </div>

      {/* Text Wrapper */}
      <div
        className="w-full h-screen sm:flex justify-center overflow-y-hidden hidden"
        style={{
          transform: turnAround ? "rotate(180deg) rotateY(-180deg)" : "",
        }}
      >
        <textarea
          ref={textRef}
          value={promptText || "Text Not Found"}
          className="text-justify w-full bg-transparent focus:outline-none border-none text-white h-full overflow-hidden py-[30%]"
          style={{
            fontSize: `${fontSize}px`,
            paddingLeft: marginValue,
            paddingRight: marginValue,
          }}
          readOnly
        ></textarea>
      </div>
    </div>
  );
};

export default TeleprompterSlugPage;
