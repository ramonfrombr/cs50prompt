"use client";
import { useCallback, useEffect, useRef, useState } from "react";
import { socket } from "../../socket";
import { useRouter } from "next/navigation";
import {
  CaseSensitive,
  ChevronRight,
  FlipVertical2,
  Pause,
  Play,
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
  const [fontSize, setFontSize] = useState(3);

  const debounceFontSizeChange = debounce(
    (val: number) => handleFontSizeChange(val),
    500
  );

  const handleFontSizeChange = (value: number) => {
    sendDefineFontSize(value);
  };

  const sendStartPrompt = useCallback(() => {
    socket.emit("send_start_prompt", params.slug);
  }, [params.slug]);

  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      const sendScrollUp = () => {
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
      };

      const sendScrollDown = () => {
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
      };

      if (event.key === " ") {
        event.preventDefault();
        sendStartPrompt();
      } else if (event.key === "ArrowUp") {
        sendScrollUp();
      } else if (event.key === "ArrowDown") {
        sendScrollDown();
      }
    },
    [sendStartPrompt, , isPaused, params.slug]
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

  useEffect(() => {
    const joinRoom = () => {
      socket.emit("join_room", params.slug);
    };

    const getPromptText = () => {
      socket.emit("get_prompt_text", params.slug);
    };

    const receivePromptText = (data: any) => {
      console.log(">>> ", data);
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
      <header className="fixed top-0 left-0 w-full py-5 flex flex-row gap-10 justify-center z-50">
        <button
          onClick={() => {
            sendStartPrompt();
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
              sendRestartPrompt();
            }
          }}
          className="bg-red-600 p-3 rounded text-gray-50"
        >
          <Repeat size={20} />
        </button>

        <button
          onClick={() => setTurnAround((current) => !current)}
          className="bg-purple-600 p-3 rounded text-gray-50"
        >
          <FlipVertical2 size={20} />
        </button>
        <div className="flex gap-3">
          <p className="flex gap-3 text-xl items-center">
            <Timer size={40} /> {rangeValue}
          </p>
          <input
            type="range"
            min="0.01"
            step={0.01}
            max="2"
            value={rangeValue}
            onChange={(e) => setRangeValue(Number(e.target.value))}
          />
        </div>
        <div className="flex gap-3">
          <p className="flex gap-3 text-xl items-center">
            <CaseSensitive size={40} /> {fontSize}
          </p>
          <input
            type="range"
            min="1"
            step={0.2}
            max="5"
            onChange={(e) => debounceFontSizeChange(Number(e.target.value))}
          />
        </div>
      </header>

      {/* Black Box */}
      <div className="w-full h-[70vh] bg-black fixed inset-0 m-auto -z-10 flex items-center text-white">
        <ChevronRight size={80} />
      </div>

      {/* Text Wrapper */}
      <div
        className="w-full h-screen flex justify-center overflow-y-hidden"
        style={{
          transform: turnAround ? "rotate(180deg) rotateY(-180deg)" : "",
        }}
      >
        <textarea
          ref={textRef}
          value={promptText || "Text Not Found"}
          className="text-center w-full bg-transparent focus:outline-none border-none text-white h-full overflow-hidden py-[30%] px-[10%]"
          style={{ fontSize: `${fontSize}em` }}
          readOnly
        ></textarea>
      </div>
    </div>
  );
};

export default TeleprompterSlugPage;
