import { FC, ReactNode } from "react";

type Component = FC<any> | [FC<any>, Object];

interface ComposerProps {
  components: Component[];
  children?: ReactNode;
}

const Composer: FC<ComposerProps> = ({ components, children }) => {
  return (
    <>
      {components.reduceRight((child: ReactNode, parent: Component) => {
        const [Comp, props] = parent instanceof Array ? parent : [parent, {}];
        return <Comp {...props}>{child}</Comp>;
      }, children)}
    </>
  );
};

export default Composer;
