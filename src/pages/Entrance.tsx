import { FunctionComponent } from "react";

import { useAuth } from "../context/Auth";
import justAyahBG from "../assets/img/just-ayah-banner.jpg";

interface EntranceProps {}

const Entrance: FunctionComponent<EntranceProps> = () => {
  const { signIn } = useAuth();

  return (
    <div className="entrance" style={{ backgroundImage: `url(${justAyahBG})` }}>
      <button className="google-sign-in" onClick={signIn}>
        enter with google
      </button>
    </div>
  );
};

export default Entrance;
