import { FunctionComponent } from "react";
import AdminView from "./AdminView";
import PublicView from "./PublicView";

interface ViewHandlerProps {}

const ViewHandler: FunctionComponent<ViewHandlerProps> = () => {
  const parts = window.location.hostname.split(".");
  const subdomain = parts.length > 1 ? parts[0] : null;

  switch (subdomain) {
    case "admin":
      return <AdminView />;
    default:
      return <PublicView />;
  }
};

export default ViewHandler;
