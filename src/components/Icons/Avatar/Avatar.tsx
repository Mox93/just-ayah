import { VFC } from "react";

interface AvatarProps {
  url?: string;
}

const Avatar: VFC<AvatarProps> = ({ url }) => {
  return (
    <div className="Avatar">
      <div className="body" />
      <div className="head" />
      {url && <img className="photo" src={url} alt="avatar" />}
    </div>
  );
};

export default Avatar;
