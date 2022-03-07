import { FunctionComponent } from "react";
import PopUp, { PopUpProps } from "components/PopUp";

interface CustomerSignedUpProps extends PopUpProps {}

const CustomerSignedUp: FunctionComponent<CustomerSignedUpProps> = (props) => {
  return (
    <PopUp {...props}>
      <h1>Thank you for signing up</h1>
      <p>We will contact you soon</p>
      <a href="/">go back to the home page</a>
      <a href="/join">fill in a new form</a>
    </PopUp>
  );
};

export default CustomerSignedUp;
