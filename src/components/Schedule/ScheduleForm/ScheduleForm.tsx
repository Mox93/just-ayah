import Container from "components/Container";
import { InputGroup, formAtoms } from "components/Form";
import { useGlobalT } from "hooks";
import { Schedule } from "models/blocks";
import { pass } from "utils";
import { useFieldArray } from "lib/react-hook-form";

const { Form, Textarea, TimeInput, WeekDayInput, useForm } =
  formAtoms<Schedule>();

interface ScheduleFormProps {
  defaultValues?: Schedule;
  onSubmit?: (data: Schedule) => void;
}

export default function ScheduleForm({
  defaultValues,
  onSubmit,
}: ScheduleFormProps) {
  const glb = useGlobalT();
  const formProps = useForm({
    onSubmit: ({ entries, notes }) =>
      onSubmit?.({ ...(notes ? { notes } : {}), entries }),
    defaultValues,
  });

  const {
    formHook: { control },
  } = formProps;

  const { fields, clone, remove, move } = useFieldArray({
    name: "entries",
    control,
    emptyItem: { time: { hour: 0, minute: 0 }, day: "" as any },
  });

  return (
    <Container
      variant="card"
      className="ScheduleForm"
      header={<h2 className="title">{glb("schedule")}</h2>}
    >
      <Form submitProps={{ children: glb("save") }} {...formProps}>
        {fields.map(({ id }, index) => (
          <InputGroup
            key={id}
            className="fieldRow"
            variant="dynamicListItem"
            addItem={pass(clone, index)}
            removeItem={pass(remove, index)}
            size={fields.length}
            index={index}
            moveItem={(to) => move(index, to)}
          >
            <WeekDayInput
              label={index > 0 ? undefined : glb("day")}
              placeholder={glb("day")}
              name={`entries.${index}.day` as const}
              rules={{ required: fields.length > 1 }}
            />
            <TimeInput
              label={index > 0 ? undefined : glb("time")}
              placeholder={glb("time")}
              name={`entries.${index}.time` as const}
              rules={{ required: fields.length > 1 }}
              minutesInterval={5}
            />
          </InputGroup>
        ))}
        <Textarea name="notes" label={glb("notes")} />
      </Form>
    </Container>
  );
}
