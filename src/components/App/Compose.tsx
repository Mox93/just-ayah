import {
  FunctionComponent,
  JSXElementConstructor,
  PropsWithChildren,
  ReactNode,
} from "react";

type JSXElemConst = JSXElementConstructor<PropsWithChildren<any>>;
type ComposeComponent = JSXElemConst | [JSXElemConst, Object];

interface ComposeProps {
  components: ComposeComponent[];
  children?: ReactNode;
}

const Compose: FunctionComponent<ComposeProps> = ({ components, children }) => {
  return (
    <>
      {components.reduceRight((acc: ReactNode, parent: ComposeComponent) => {
        const [Comp, props] = parent instanceof Array ? parent : [parent, {}];
        return <Comp {...props}>{acc}</Comp>;
      }, children)}
    </>
  );
};

export default Compose;
