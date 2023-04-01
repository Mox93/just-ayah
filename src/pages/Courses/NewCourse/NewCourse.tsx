import Container from "components/Container";
import { formAtoms } from "components/Form";
import { useCourseStore } from "context";
import { useGlobalT, useMessageT, usePageT, useSmartForm } from "hooks";
import { Course, CourseFormData } from "models/course";

const { Form, Input } = formAtoms<CourseFormData>();

export default function NewCourse() {
  const glb = useGlobalT();
  const pgT = usePageT("course");
  const msg = useMessageT();

  const addCourse = useCourseStore((state) => state.add);

  const formProps = useSmartForm<CourseFormData>({
    onSubmit: (data) => addCourse(new Course.DB(data), { applyLocally: true }),
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
