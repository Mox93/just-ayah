import { VFC } from "react";

interface AvatarProps {
  url?: string;
}

const Avatar: VFC<AvatarProps> = ({ url }) => {
  return (
    <div className="Avatar">
      {url ? (
        <img src={url} alt="avatar" />
      ) : (
        <>
          <div className="body" />
          <div className="head" />
        </>
      )}
    </div>
  );
};

export default Avatar;
