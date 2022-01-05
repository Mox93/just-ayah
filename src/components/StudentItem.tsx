import { FunctionComponent, useState } from "react";
import { useTranslation } from "react-i18next";

import ArrowIcon from "../assets/icons/down-arrow-svgrepo-com.svg";
import { Student } from "../models/student";
import { cn, getAge, omit } from "../utils";
import SvgIcon from "./SvgIcon";

interface StudentItemProps {
  data: Student;
  id: string;
  selected?: boolean;
  addToSelected?: (id: string) => void;
  removeFromSelected?: (id: string) => void;
}

const StudentItem: FunctionComponent<StudentItemProps> = ({
  data,
  id,
  selected,
  addToSelected = omit,
  removeFromSelected = omit,
}) => {
  const { t } = useTranslation();

  const [expanded, setExpanded] = useState(false);

  const name = `${data.firstName} ${data.middleName} ${data.lastName}`;

  return (
    <div className="student-item expandable-item">
      <div className="prefix">
        <div className={cn({ expanded }, data.gender)}></div>
        <input
          className="checkbox"
          type="checkbox"
          onChange={(e) =>
            e.target.checked ? addToSelected(id) : removeFromSelected(id)
          }
          checked={selected}
        />
      </div>

      {expanded ? (
        <div className="body">
          <h3 className="title">{name}</h3>
        </div>
      ) : (
        <div className="info">
          <p className="element name">{name}</p>
          <p className="element phone-number">{data.phoneNumber.number}</p>
          <p className="element age">{getAge(data.dateOfBirth)}</p>
          <p className="element country">{data.country}</p>
          <p className="element governorate">{data.governorate || "_"}</p>
        </div>
      )}
      <div className="actions">
        <button
          className={cn(
            { "show-more": !expanded, close: expanded },
            "toggle-btn"
          )}
          onClick={() => setExpanded((state) => !state)}
        >
          <SvgIcon className="arrow" href={`${ArrowIcon}/#Capa_1`} />
        </button>
      </div>
    </div>
  );
};

export default StudentItem;
