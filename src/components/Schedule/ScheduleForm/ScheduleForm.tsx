import { VFC } from "react";

import { ReactComponent as CrossIcon } from "assets/icons/close-svgrepo-com.svg";
import { ReactComponent as PlusIcon } from "assets/icons/plus-svgrepo-com.svg";
import { Button } from "components/Buttons";
import { SelectionMenu } from "components/DropdownMenu";
import { formAtoms } from "components/Form";
import { useDynamicList, useGlobalT, useSmartForm } from "hooks";
import { Schedule } from "models/schedule";
import { range } from "utils";

const { Form, Textarea, TimeInput, WeekDayInput, InputGroup } =
  formAtoms<Schedule>();

interface ScheduleFormProps {
  defaultValues?: Schedule;
  onSubmit?: (data: Schedule) => void;
}

const ScheduleForm: VFC<ScheduleFormProps> = ({ defaultValues, onSubmit }) => {
  const glb = useGlobalT();
  const formProps = useSmartForm({
    onSubmit: ({ entries, notes }) => {
      if (!onSubmit) return;

      onSubmit({ ...(notes ? { notes } : {}), entries });
    },
    config: { defaultValues },
  });

  const {
    formHook: { resetField, watch },
  } = formProps;

  const { items, cloneItem, removeItem, moveItem } = useDynamicList({
    items: watch("entries"),
    onChange: (items) => resetField("entries", { defaultValue: items }),
  });

  return (
    <Form
      className="ScheduleForm"
      submitProps={{ children: glb("save") }}
      {...formProps}
    >
      {(items || [null]).map(({ id }, index) => (
        <InputGroup key={id} className="fieldRow">
          <SelectionMenu
            options={range(1, items.length + 1)}
            selected={index + 1}
            className="action"
            noArrow
            setValue={(to) => moveItem(index, to - 1)}
          />
          <WeekDayInput
            label={index > 0 ? undefined : glb("day")}
            placeholder={glb("day")}
            name={`entries.${index}.day` as const}
            rules={{ required: items.length > 1 }}
          />
          <TimeInput
            label={index > 0 ? undefined : glb("time")}
            placeholder={glb("time")}
            name={`entries.${index}.time` as const}
            rules={{ required: items.length > 1 }}
            minutesInterval={5}
          />
          <Button
            iconButton
            variant="primary-ghost"
            className="action"
            onClick={() => cloneItem(index)}
          >
            <PlusIcon className="icon" />
          </Button>
          <Button
            iconButton
            variant="danger-ghost"
            className="action"
            onClick={() => removeItem(index)}
          >
            <CrossIcon className="icon" />
          </Button>
        </InputGroup>
      ))}
      <Textarea name="notes" label={glb("notes")} />
    </Form>
  );
};

export default ScheduleForm;
