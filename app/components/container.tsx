"use client";
import Link from "next/link";
import { ChangeEvent, useContext } from "react";
import { ValueContext } from "./promptApi";

const Container = () => {
  const { value, setValue } = useContext(ValueContext);

  const changeValue = (e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
  };

  return (
    <div className="flex flex-col items-center max-w-screen-lg m-auto h-screen p-10">
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

      <Link
        href="/teleprompter"
        className="px-4 py-2 text-white bg-blue-500 rounded-md"
      >
        Generate
      </Link>
    </div>
  );
};

export default Container;
