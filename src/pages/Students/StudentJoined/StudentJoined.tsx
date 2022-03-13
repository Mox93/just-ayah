import { FunctionComponent } from "react";
import Popup, { PopupProps } from "components/Popup";

interface StudentJoinedProps extends PopupProps {}

const StudentJoined: FunctionComponent<StudentJoinedProps> = (props) => {
  return (
    <Popup {...props}>
      <h1>Thank you for joining</h1>
      <a href="/">go back to the home page</a>
      <a href="/join">fill in a new form</a>
    </Popup>
  );
};

export default StudentJoined;
