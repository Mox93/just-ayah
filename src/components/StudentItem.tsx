import { FunctionComponent, useState } from "react";

import ArrowIcon from "../assets/icons/down-arrow-svgrepo-com.svg";
import EditIcon from "../assets/icons/edit-svgrepo-com.svg";
import ArchiveIcon from "../assets/icons/archive-svgrepo-com.svg";
import { Student } from "../models/student";
import { cn, omit } from "../utils";
import { getAge, historyRep } from "../utils/datetime";
import SvgIcon from "./SvgIcon";

interface StudentItemProps {
  data: Student;
  selected?: boolean;
  select?: (checked: boolean) => void;
  edit?: () => void;
  archive?: () => void;
}

const StudentItem: FunctionComponent<StudentItemProps> = ({
  data,
  selected,
  edit,
  archive,
  select = omit,
}) => {
  const [expanded, setExpanded] = useState(false);

  const name = `${data.firstName} ${data.middleName} ${data.lastName}`;

  return (
    <div className="student-item expandable-item">
      <div className={cn({ expanded }, [data.gender, "actions"])}>
        <div className="main">
          <input
            className="element"
            type="checkbox"
            onChange={(e) => select(e.target.checked)}
            checked={selected}
          />
        </div>
        <div className="extra">
          <button className="element edit" disabled={!edit} onClick={edit}>
            <SvgIcon path={EditIcon} />
          </button>
          <button
            className="element archive"
            disabled={!archive}
            onClick={archive}
          >
            <SvgIcon path={ArchiveIcon} />
          </button>
        </div>
      </div>

      {expanded ? (
        <div className="body">
          <h3 className="title">{name}</h3>
        </div>
      ) : (
        <div className="info">
          <p className="element name">{name}</p>
          <p className="element phone-number" dir="ltr">
            {data.phoneNumber.number}
          </p>
          <p className="element age">{getAge(data.dateOfBirth)}</p>
          <p className="element education">{data.education}</p>
          <p className="element occupation">{data.occupation}</p>
          <p className="element country">{data.country}</p>
          <p className="element governorate">{data.governorate || "_"}</p>
          <p className="element date-created">
            {historyRep(data.meta.dateCreated)}
          </p>
          <p className="element state">{data.meta.state}</p>
        </div>
      )}
      <button
        className={cn({ reverse: expanded }, "expand")}
        onClick={() => setExpanded((state) => !state)}
      >
        <SvgIcon className="arrow" path={ArrowIcon} />
      </button>
    </div>
  );
};

export default StudentItem;
