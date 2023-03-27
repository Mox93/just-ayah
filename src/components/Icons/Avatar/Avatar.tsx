import { useState } from "react";

import UserProfile from "assets/icons/user-profile.svg";
import { cn } from "utils";

interface AvatarProps {
  url: string | undefined | null;
  className?: string;
}

export default function Avatar({ url, className }: AvatarProps) {
  const [failed, setFailed] = useState(false);

  return (
    <div className={cn("Avatar", className)}>
      <img
        className={cn("photo")}
        src={url && !failed ? url : UserProfile}
        alt=""
        onError={() => setFailed(true)}
      />
    </div>
  );
}
