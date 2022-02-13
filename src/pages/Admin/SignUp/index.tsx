import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import justAyahBG from "assets/img/just-ayah-banner.jpg";
import LanguageSelector from "components/LanguageSelector";
import { useAuth } from "context/Auth";

import "./style.scss";

interface SignUpProps {}

const SignUp: FunctionComponent<SignUpProps> = () => {
  const { signIn } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="SignUp" style={{ backgroundImage: `url(${justAyahBG})` }}>
      <LanguageSelector />
      <button className="google-sign-in cta-btn" onClick={signIn}>
        {t("elements.google_sign_in")}
      </button>
    </div>
  );
};

export default SignUp;
