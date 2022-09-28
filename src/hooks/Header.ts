import { useEffect } from "react";
import { useGlobalT } from "./Translation";

interface HeaderHookProps {
  title?: string;
}

const useHeader = ({ title }: HeaderHookProps) => {
  const glb = useGlobalT();
  const justAyah = glb("justAyah");

  useEffect(() => {
    document.title = justAyah + (title ? ` - ${title}` : "");

    return () => {
      document.title = justAyah;
    };
  }, [title]);
};

export default useHeader;
