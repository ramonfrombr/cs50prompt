"use client";
import { ChangeEvent, useContext, useEffect, useState } from "react";
import { ValueContext } from "./promptApi";
import { socket } from "../socket";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Link from "next/link";

const Container = () => {
  const { value, setValue } = useContext(ValueContext);
  const router = useRouter();

  const [listOfPrompts, setListOfPrompts] = useState<
    { roomId: string; prompt: string }[]
  >([]);

  const changeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  const generatePrompt = () => {
    const promptId = uuidv4();
    socket.emit("create_prompt", promptId, value);
    router.push(`/teleprompter/${promptId}`);
  };

  const getPrompts = () => {
    socket.emit("get_prompts");
  };

  const joinHomeRoom = () => {
    socket.emit("join_room", "home");
  };

  useEffect(() => {
    joinHomeRoom();
    getPrompts();

    const receivePrompts = (data: any) => {
      setListOfPrompts(data);
    };

    socket.on("receive_prompts", receivePrompts);

    return () => {
      socket.off("receive_prompts", receivePrompts);
    };
  }, []);

  return (
    <div className="flex flex-col items-center max-w-screen-lg m-auto h-screen p-10">
      {listOfPrompts.length > 0 && (
        <div>
          <h2>List of Teleprompts</h2>
          {listOfPrompts.map((prompt) => (
            <Link key={prompt.roomId} href={`/teleprompter/${prompt.roomId}`}>
              {prompt.roomId}
            </Link>
          ))}
        </div>
      )}
      <h1 className="text-3xl py-10">CS50 Teleprompter</h1>
      <p className="m-auto max-w-screen-sm text-center">
        A teleprompter, also known as an autocue, is a device used in
        television, film production, and public speaking to display a scrolling
        script or speech for presenters to read from while appearing to maintain
        eye contact with the audience or camera.
      </p>

      <textarea
        className="w-full h-screen p-4 my-4 border border-gray-300 rounded-md shadow-md"
        placeholder="Enter your text here"
        onChange={changeValue}
      ></textarea>

      <button
        onClick={generatePrompt}
        className="px-4 py-2 text-white bg-blue-500 rounded-md"
      >
        Generate
      </button>
    </div>
  );
};

export default Container;
