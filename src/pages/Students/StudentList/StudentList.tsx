import { FunctionComponent, useState } from "react";

import { getCountry } from "models/country";
import { handleEgGov } from "models/governorate";
import { Student } from "models/student";
import { getOccupation } from "models/work";
import { getAge, historyRep } from "models/dateTime";
import Table, { FieldProps } from "components/Table";
import { useStudents } from "context/Students";
import {
  useGlobalT,
  useGovT,
  usePageT,
  usePersonalInfoT,
} from "utils/translation";
import { getPhoneNumberByTag } from "models/phoneNumber";
import Popup, { PopupProps } from "components/Popup";
import { getSubscription, Subscription } from "models/subscription";
import SubscriptionSelector from "components/SubscriptionSelector";
import StatusSelector from "components/StatusSelector";
import { getStatus, StudentStatus } from "models/studentStatus";
import { UNKNOWN } from "models";

interface StudentListProps {}

const StudentList: FunctionComponent<StudentListProps> = () => {
  const glb = useGlobalT();
  const gov = useGovT("egypt");
  const stu = usePageT("students");
  const pi = usePersonalInfoT();

  const { data, fetchStudents, updateStudent } = useStudents();

  const [popupProps, setPopupProps] = useState<PopupProps>({ visible: false });
  const close = () => setPopupProps({ visible: false });

  const updateStatus = (student: Student, status: StudentStatus) => {
    console.log(student.id);

    updateStudent(student.id, { meta: { ...student.meta, status } });
    setPopupProps({ visible: false });
  };
  const updateSubscription = (student: Student, subscription: Subscription) => {
    updateStudent(student.id, { meta: { ...student.meta, subscription } });
    setPopupProps({ visible: false });
  };

  const showStatusPopup = (student: Student) => () =>
    setPopupProps({
      children: (
        <StatusSelector onChange={(status) => updateStatus(student, status)} />
      ),
      close,
    });

  const showSubscriptionPopup = (student: Student) => () =>
    setPopupProps({
      children: (
        <SubscriptionSelector
          onChange={(subscription) => updateSubscription(student, subscription)}
        />
      ),
      close,
    });

  const fields: FieldProps[] = [
    {
      name: "gender",
      header: (
        <div
          className="smallCircle"
          style={{ border: "2px solid var(--c-black)" }}
        ></div>
      ),
      className: "prefix",
      getValue: (data: Student) => (
        <div className={`smallCircle ${data.gender}`}></div>
      ),
      fit: true,
    },
    {
      name: "name",
      header: pi("fullName"),
      className: "name",
      getValue: (data: Student) =>
        `${data.firstName} ${data.middleName} ${data.lastName}`,
    },
    {
      name: "status",
      header: pi("status"),
      className: "colorCoded",
      getValue: (data: Student) => {
        const type = data.meta.status?.type || UNKNOWN;
        const status = getStatus(data.meta.status, glb);

        return (
          <button
            className={`${type} colorCoded`}
            onClick={showStatusPopup(data)}
          >
            {status}
          </button>
        );
      },
      fit: true,
    },
    {
      name: "subscription",
      header: pi("subscription"),
      className: "colorCoded",
      getValue: (data: Student) => {
        const type = data.meta.subscription?.type || UNKNOWN;
        const subscription = getSubscription(data.meta.subscription, glb);

        return (
          <button
            className={`${type} colorCoded`}
            onClick={showSubscriptionPopup(data)}
          >
            {subscription}
          </button>
        );
      },
      fit: true,
    },
    {
      name: "phoneNumber",
      header: pi("phoneNumber"),
      className: "phoneNumber",
      getValue: (data: Student) =>
        getPhoneNumberByTag(data.phoneNumbers, "whatsapp"),
      fit: true,
    },
    {
      name: "age",
      header: pi("age"),
      getValue: (data: Student) => getAge(data.dateOfBirth),
      fit: true,
    },
    {
      name: "education",
      header: pi("education"),
    },
    {
      name: "occupation",
      header: pi("occupation"),
      getValue: (data: Student) =>
        data.workStatus && getOccupation(data.workStatus, pi),
    },
    {
      name: "nationality",
      header: pi("nationality"),
      getValue: (data: Student) => getCountry(data.country)?.native,
    },
    {
      name: "residence",
      header: pi("residence"),
      getValue: (data: Student) => {
        const parts = [getCountry(data.country)?.native];
        if (data.governorate) parts.push(handleEgGov(data.governorate, gov));
        return parts.join(" - ");
      },
    },
    {
      name: "course",
      header: glb("course"),
    },
    {
      name: "dateCreated",
      header: glb("dateCreated"),
      getValue: (data: Student) => historyRep(data.meta.dateCreated),
      fit: true,
    },
  ];

  const [selected, setSelected] = useState<Set<string>>(new Set());
  const handleSelect = (id: string) =>
    setSelected((state) => new Set(state.add(id)));
  const handleDeselect = (id: string) =>
    setSelected((state) => {
      state.delete(id);
      return new Set(state);
    });

  return (
    <main className="mainSection StudentList">
      {selected.size > 0 && (
        <div className="selectionCounter">
          {stu("counter", { count: selected.size })}
        </div>
      )}
      <Table
        {...{ fields, data, selected }}
        toggleSelect={(checked, id) =>
          checked ? handleSelect(id) : handleDeselect(id)
        }
        toggleSelectAll={(checked) =>
          setSelected(checked ? new Set(data.map(({ id }) => id)) : new Set())
        }
      />
      <button className="ctaBtn" onClick={() => fetchStudents()}>
        {`${glb("loadMore")} ...`}
      </button>
      <Popup {...popupProps} />
    </main>
  );
};

export default StudentList;
