"use client";
import { useContext } from "react";
import { ValueContext } from "../components/promptApi";

const Teleprompter = () => {
  const { value } = useContext(ValueContext);

  return <div>{value}</div>;
};

export default Teleprompter;
