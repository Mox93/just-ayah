import { useWatch } from "react-hook-form";

import { EnrolledMessage, ErrorMessage } from "components/FlashMessages";
import {
  InputGroup,
  formAtoms,
  SelectionInput as BaseSelectionInput,
  formContextFactory,
  MenuInput as BaseMenuInput,
} from "components/Form";
import { FormLayout } from "components/Layouts";
import { openModal, startLoading, stopLoading } from "context";
import { useGlobalT, usePageT, usePersonalInfoT } from "hooks";
import { OTHER } from "models";
import { booleanSelectorProps, leadsSchema } from "models/blocks";
import { transformer } from "utils/transformer";

import { StudentData, addStudent, newStudentSchema } from "../api";
import StudentDataFields from "./StudentDataFields";

const {
  Form,
  Input,
  modifiers: { defaultModifiers, menuModifiers },
  TermsOfService,
  useForm,
} = formAtoms<StudentData>();

const SelectionInput = transformer(BaseSelectionInput, ...defaultModifiers);
const MenuInput = transformer(BaseMenuInput, ...menuModifiers);

export default function NewStudent() {
  const glb = useGlobalT();
  const pg = usePageT("student");
  const pi = usePersonalInfoT();

  const formProps = useForm({
    onSubmit: async (data, { reset }) => {
      startLoading(pg("submitting"));

      try {
        const parsedData = newStudentSchema.parse(data);
        await addStudent(parsedData);
        openModal(<EnrolledMessage />, { center: true });
        reset();
      } catch (error) {
        openModal(<ErrorMessage error={error} />, {
          center: true,
          closable: true,
        });
      } finally {
        stopLoading();
      }
    },
    storage: {
      key: "studentForm/temp",
      filter: { type: "omit", fields: ["termsOfService"] },
    },
  });

  const yesNoProps = booleanSelectorProps(glb, "yes", "no");

  return (
    <FormLayout name="StudentEnroll" title={pg("formTitle")}>
      <Form
        submitProps={{ children: glb("joinInitiative") }}
        resetProps={{}}
        {...formProps}
      >
        <StudentDataFields />

        <SelectionInput
          name="quran"
          label={pi("quran")}
          rules={{ required: "noAnswer" }}
          {...yesNoProps}
        />

        <SelectionInput
          name="zoom"
          label={pi("zoom")}
          rules={{ required: "noAnswer" }}
          {...yesNoProps}
        />

        <SelectionInput
          name="zoomTestSession"
          label={pi("zoomTestSession")}
          rules={{ required: "noAnswer" }}
          {...yesNoProps}
        />

        <SelectionInput
          name="telegram"
          label={pi("telegram")}
          rules={{ required: "noAnswer" }}
          {...yesNoProps}
        />

        <LeadsSection />

        <TermsOfService
          name="termsOfService"
          url="https://drive.google.com/file/d/1bzNhKaBs1f7yICtY9yX0udNw-KWaukb4/preview"
        />
      </Form>
    </FormLayout>
  );
}

const [, useFormContext] = formContextFactory<StudentData>();

function LeadsSection() {
  const glb = useGlobalT();
  const pi = usePersonalInfoT();

  const {
    formHook: { control },
  } = useFormContext();

  const lead = useWatch({
    control: control,
    name: "lead",
  });

  return (
    <InputGroup>
      <MenuInput
        name="lead"
        options={leadsSchema.options}
        renderElement={glb}
        label={pi("lead")}
        rules={{ required: "noAnswer" }}
      />
      {lead === OTHER && (
        <Input
          name="leadOther"
          rules={{ required: "noAnswer", shouldUnregister: true }}
        />
      )}
    </InputGroup>
  );
}
