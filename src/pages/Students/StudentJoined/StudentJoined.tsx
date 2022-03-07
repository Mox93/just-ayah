import { FunctionComponent } from "react";
import PopUp, { PopUpProps } from "components/PopUp";

interface StudentJoinedProps extends PopUpProps {}

const StudentJoined: FunctionComponent<StudentJoinedProps> = (props) => {
  return (
    <PopUp {...props}>
      <h1>Thank you for joining</h1>
      <a href="/">go back to the home page</a>
      <a href="/join">fill in a new form</a>
    </PopUp>
  );
};

export default StudentJoined;
