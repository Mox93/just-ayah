import { VFC } from "react";
import { useForm } from "react-hook-form";

import {
  CountrySelectorInput,
  DateInput,
  Input,
  InputGroup,
  SelectionInput,
  PhoneNumberInput,
  Form,
  MiniForm,
} from "components/Form";
import { CountryCode } from "models/country";
import { PhoneNumberInfo } from "models/phoneNumber";
import { fromDateInfo } from "models/dateTime";
import { yesNo } from "utils";
import Card from "components/Card";

interface TestData {
  name: string;
  country: CountryCode;
  phoneNumber: PhoneNumberInfo[];
  oneChoice: string;
  multipleChoices: string[];
  canDoThis: boolean;
  dateOfBirth: Date;
}

interface TestFormProps {}

const FormUI: VFC<TestFormProps> = () => {
  const { setValue, register, handleSubmit } = useForm<TestData>();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const now = new Date();

  const { handleSubmit: miniHS, register: miniR } = useForm<any>({
    defaultValues: { value: "abc" },
  });

  return (
    <main>
      <Form onSubmit={handleSubmit(onSubmit)}>
        <Input {...register("name")} label="name" />
        <CountrySelectorInput
          {...register("country")}
          label="country"
          renderSections={["emoji", "native"]}
          setValue={(value) => setValue("country", value?.code!)}
        />
        <InputGroup>
          <CountrySelectorInput
            {...register("phoneNumber.1.code")}
            renderSections={["emoji", "code", "phone"]}
            setValue={(value) => setValue("phoneNumber.1.code", value?.code!)}
          />
          <Input {...register("phoneNumber.1.number")} />
        </InputGroup>

        <DateInput
          innerProps={{ ...register("dateOfBirth") }}
          label="date of birth"
          yearsRange={{
            start: now.getFullYear(),
            end: now.getFullYear() - 150,
          }}
          setValue={(date) => setValue("dateOfBirth", fromDateInfo(date))}
        />
        <PhoneNumberInput
          label="phone number"
          innerProps={{
            code: {
              ...register("phoneNumber.0.code"),
              setValue: (value) => setValue("phoneNumber.0.code", value?.code!),
            },
            number: register("phoneNumber.0.number"),
          }}
        />

        <SelectionInput
          options={["option 1", "option 2", "option 3", "option 4"]}
          label="options"
          type="radio"
          {...register("oneChoice")}
        />

        <SelectionInput
          options={["a", "b", "c", "d"]}
          label="letters"
          type="checkbox"
          {...register("multipleChoices")}
        />

        <SelectionInput
          options={yesNo}
          type="radio"
          label="can you do this"
          {...register("canDoThis")}
        />
      </Form>

      <Card>
        <MiniForm onSubmit={miniHS(onSubmit)}>
          <Input {...miniR("value", { required: true })} />
        </MiniForm>
      </Card>
    </main>
  );
};

export default FormUI;
