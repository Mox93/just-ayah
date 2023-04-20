import { useState } from "react";

import UserProfile from "assets/icons/user-profile.svg";
import { cn } from "utils";

interface AvatarProps {
  url: string | undefined | null;
  className?: string;
}

export default function Avatar({ url, className }: AvatarProps) {
  const [ready, setReady] = useState(false);

  return (
    <div className={cn("Avatar", className)}>
      {url && (
        <img
          className={cn({ hidden: !ready })}
          src={url}
          alt="profilePicture"
          onError={() => setReady(false)}
          onLoad={() => setReady(true)}
        />
      )}
      <img className={cn({ hidden: ready })} src={UserProfile} alt="avatar" />
    </div>
  );
}
