interface AvatarProps {
  url?: string;
}

export default function Avatar({ url }: AvatarProps) {
  return (
    <div className="Avatar">
      <div className="body" />
      <div className="head" />
      {url && <img className="photo" src={url} alt="avatar" />}
    </div>
  );
}
