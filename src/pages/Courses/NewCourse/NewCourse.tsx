import Container from "components/Container";
import { ErrorToast, SuccessToast } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import { useCourseStore, usePopupContext } from "context";
import { useGlobalT, useMessageT, usePageT, useSmartForm } from "hooks";
import { Course, CourseFormData } from "models/course";

const { Form, Input } = formAtoms<CourseFormData>();

export default function NewCourse() {
  const glb = useGlobalT();
  const pgT = usePageT("course");
  const msg = useMessageT();

  const { closeModal, openToast } = usePopupContext();

  const addCourse = useCourseStore((state) => state.add);

  const formProps = useSmartForm<CourseFormData>({
    onSubmit: (data) =>
      addCourse(new Course.DB(data), {
        applyLocally: true,
        onFulfilled: () => {
          closeModal();
          openToast(
            <SuccessToast
              i18nKey="newCourse"
              message="a new course was added!"
            />,
            { variant: "success" }
          );
        },
        onRejected: (error) =>
          openToast(<ErrorToast error={error} />, { variant: "danger" }),
      }),
    resetOnSubmit: true,
  });

  return (
    <Container variant="card" header={<h2 className="title">{pgT("new")}</h2>}>
      <Form {...formProps} submitProps={{ children: glb("add") }}>
        <Input
          name="name"
          label={glb("name")}
          rules={{ required: "noCourseName" }}
        />
        <Input
          name="sessionCount"
          label={glb("numberOfSessions")}
          placeholder="0"
          type="number"
          dir="ltr"
          rules={{
            valueAsNumber: true,
            min: { value: 1, message: msg("notLtOne") },
            required: "noSessionCount",
          }}
        />
      </Form>
    </Container>
  );
}
