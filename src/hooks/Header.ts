import { useEffect } from "react";

import { useGlobalT } from "./Translation";

interface HeaderHookProps {
  title?: string;
}

export default function useHeader({ title }: HeaderHookProps) {
  const glb = useGlobalT();

  useEffect(() => {
    const justAyah = glb("justAyah");
    document.title = justAyah + (title ? ` - ${title}` : "");

    return () => {
      document.title = justAyah;
    };
  }, [glb, title]);
}
