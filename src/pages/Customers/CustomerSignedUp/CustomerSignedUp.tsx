import { FunctionComponent } from "react";
import Popup, { PopupProps } from "components/Popup";

interface CustomerSignedUpProps extends PopupProps {}

const CustomerSignedUp: FunctionComponent<CustomerSignedUpProps> = (props) => {
  return (
    <Popup {...props}>
      <h1>Thank you for signing up</h1>
      <p>We will contact you soon</p>
      <a href="/">go back to the home page</a>
      <a href="/join">fill in a new form</a>
    </Popup>
  );
};

export default CustomerSignedUp;
