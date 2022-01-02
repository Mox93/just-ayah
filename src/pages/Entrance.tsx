import { FunctionComponent } from "react";
import { useTranslation } from "react-i18next";

import { useAuth } from "../context/Auth";
import justAyahBG from "../assets/img/just-ayah-banner.jpg";
import LanguageSelector from "../components/LanguageSelector";

interface EntranceProps {}

const Entrance: FunctionComponent<EntranceProps> = () => {
  const { signIn } = useAuth();
  const { t } = useTranslation();

  return (
    <div className="entrance" style={{ backgroundImage: `url(${justAyahBG})` }}>
      <LanguageSelector />
      <button className="google-sign-in cta-btn" onClick={signIn}>
        {t("entrance.google_sign_in")}
      </button>
    </div>
  );
};

export default Entrance;
