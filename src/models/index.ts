export * from "./types";

/***********************************\
|****** REDECLARE FORWARD-REF ******|
\***********************************/

declare module "react" {
  function forwardRef<T, P = {}>(
    render: (props: P, ref: Ref<T>) => ReactElement | null
  ): (props: P & RefAttributes<T>) => ReactElement | null;
}
