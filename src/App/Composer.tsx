import { FC } from "react";

interface ComposerProps {
  components: (FC<any> | [FC<any>, Object])[];
}

const Composer: FC<ComposerProps> = ({ components, children }) => {
  return (
    <>
      {components.reduceRight((child, parent) => {
        const [Comp, props] = parent instanceof Array ? parent : [parent, {}];
        return <Comp {...props}>{child}</Comp>;
      }, children)}
    </>
  );
};

export default Composer;
