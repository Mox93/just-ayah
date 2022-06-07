import { VFC } from "react";
import { useForm } from "react-hook-form";

import Container from "components/Container";
import {
  DateInput,
  Input,
  InputGroup,
  SelectionInput,
  PhoneNumberInput,
  Form,
  MiniForm,
  MenuInput,
} from "components/Form";
import { useCountrySelector } from "hooks";
import { CountryCode } from "models/country";
import { PhoneNumberInfo } from "models/phoneNumber";
import { fromDateInfo } from "models/dateTime";
import { yesNo } from "utils";

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
  const { setValue, register, handleSubmit, reset, watch } =
    useForm<TestData>();

  const onSubmit = (data: any) => {
    console.log(data);
  };

  const now = new Date();

  const { handleSubmit: miniHS, register: miniR } = useForm<any>({
    defaultValues: { value: "abc" },
  });

  const {
    handleSubmit: rawHS,
    register: rawR,
    reset: rawRe,
    watch: rawW,
  } = useForm<any>({ defaultValues: { ff: ["meat", "chicken"] } });

  console.log(rawW());

  return (
    <main>
      <Form
        onSubmit={handleSubmit(onSubmit)}
        onReset={() => reset()}
        resetProps={{}}
      >
        <Input {...register("name")} label="name" />
        <MenuInput
          {...register("country")}
          label="country"
          {...useCountrySelector({
            renderSections: ["emoji", "native"],
            selectedCountry: watch("country") as any,
          })}
          setValue={(value) => setValue("country", value?.code!)}
          searchable
        />
        <InputGroup>
          <MenuInput
            {...register("phoneNumber.1.code")}
            {...useCountrySelector({
              renderSections: ["emoji", "code", "phone"],
              selectedCountry: watch("country") as any,
            })}
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
          // selected={toDateInfo(watch("dateOfBirth"))}
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
          withTags
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

      <Container variant="card" className="Form">
        <MiniForm onSubmit={miniHS(onSubmit)}>
          <Input {...miniR("value", { required: true })} />
        </MiniForm>
      </Container>

      <Container variant="card" className="Form">
        <form
          className="body"
          onSubmit={rawHS(console.log)}
          onReset={() => rawRe({ age: null, dob: "2000-01-01" })}
        >
          <label>
            <h4>name</h4>
            <input type="text" {...rawR("name")} />
          </label>

          <label>
            <h4>age</h4>
            <input type="number" {...rawR("age")} />
          </label>

          <label>
            <h4>date of birth</h4>
            <input type="date" {...rawR("dob")} />
          </label>

          <div>
            <h4>favorite food</h4>
            <label>
              <input type="checkbox" {...rawR("ff")} value="meat" />
              meat
            </label>

            <label>
              <input type="checkbox" {...rawR("ff")} value="chicken" />
              chicken
            </label>
          </div>

          <div className="InputGroup actions">
            <button type="submit" className="Button primary-solid default">
              submit
            </button>
            <button type="reset" className="Button danger-text default">
              reset
            </button>
          </div>
        </form>
      </Container>
    </main>
  );
};

export default FormUI;
