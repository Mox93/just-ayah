import { FunctionComponent } from "react";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import LanguageSelector from "components/LanguageSelector";
import { useAuth } from "context/Auth";

import "./style.scss";
import { useGlobalT } from "utils/translation";

interface SignUpProps {}

const SignUp: FunctionComponent<SignUpProps> = () => {
  const glb = useGlobalT;

  const { signIn } = useAuth();

  return (
    <div className="SignUp" style={{ backgroundImage: `url(${justAyahBG})` }}>
      <LanguageSelector />
      <button className="google-sign-in cta-btn" onClick={signIn}>
        {glb("googleSignIn")}
      </button>
    </div>
  );
};

export default SignUp;
