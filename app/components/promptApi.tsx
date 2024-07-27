"use client";

import React, { createContext, useState } from "react";

export type GlobalContent = {
  value: string;
  setValue: (text: string) => void;
};

const ValueContext = createContext<GlobalContent>({
  value: "",
  setValue: () => {},
});

const ValueProvider = ({ children }: { children: React.ReactNode }) => {
  const [value, setValue] = useState("");

  return (
    <ValueContext.Provider value={{ value, setValue }}>
      {children}
    </ValueContext.Provider>
  );
};

export { ValueContext, ValueProvider };
