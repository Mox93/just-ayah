import { ReactNode, useState } from "react";

const useRequestGuard = (): [boolean, ReactNode] => {
  const isDev = process.env.REACT_APP_ENV === "dev";
  const [canFetch, setCanFetch] = useState(!isDev);

  return [
    canFetch,
    isDev && (
      <button
        onClick={() => setCanFetch((state) => !state)}
        style={{ width: "7rem", height: "3rem", fontSize: "1.25rem" }}
      >
        {canFetch ? "turn off" : "turn on"}
      </button>
    ),
  ];
};

export default useRequestGuard;
