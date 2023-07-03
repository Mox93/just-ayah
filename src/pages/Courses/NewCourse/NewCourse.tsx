import Container from "components/Container";
import { ErrorToast, SuccessToast } from "components/FlashMessages";
import { formAtoms } from "components/Form";
import { useCourseStore, closeModal, openToast } from "context";
import { useGlobalT, useMessageT, usePageT } from "hooks";
import { Course, CourseFormData } from "models/course";

const { Form, Input, useForm } = formAtoms<CourseFormData>();

export default function NewCourse() {
  const glb = useGlobalT();
  const pgT = usePageT("course");
  const msg = useMessageT();

  const addCourse = useCourseStore((state) => state.add);

  const formProps = useForm({
    onSubmit: (data, { reset }) =>
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
          reset();
        },
        onRejected: (error) =>
          openToast(<ErrorToast error={error} />, { variant: "danger" }),
      }),
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
