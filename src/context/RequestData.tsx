import { ReactNode, createContext, useContext } from "react";
import { useParams } from "react-router-dom";

interface RequestDataContext<T = unknown> {
  params: Record<string, string | undefined>;
  data?: T;
}

const requestDataContext = createContext<RequestDataContext | null>(null);

interface RequestDataProviderProps<T> {
  children: ReactNode;
  data: T;
}

export function RequestDataProvider<T>({
  children,
  data,
}: RequestDataProviderProps<T>) {
  return (
    <requestDataContext.Provider value={{ data, params: useParams() }}>
      {children}
    </requestDataContext.Provider>
  );
}

export function useRequestData<T>() {
  const context = useContext(requestDataContext);
  const params = useParams();
  return (context || { params }) as RequestDataContext<T>;
}
