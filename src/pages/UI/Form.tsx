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
import { booleanSelectorProps } from "models/boolean";
import { CountryCode, countrySelectorProps } from "models/country";
import { fromDateInfo } from "models/dateTime";
import { PhoneNumberInfo } from "models/phoneNumber";

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
      <Container variant="form">
        <Form
          onSubmit={handleSubmit(onSubmit)}
          onReset={() => reset()}
          resetProps={{}}
        >
          <Input {...register("name")} label="name" />
          <MenuInput
            {...register("country")}
            label="country"
            {...countrySelectorProps(["emoji", "native"], watch("country"))}
            setValue={(value) => setValue("country", value?.code!)}
            searchFields={["name", "native"]}
          />
          <InputGroup>
            <MenuInput
              {...register("phoneNumber.1.code")}
              {...countrySelectorProps(
                ["emoji", "code", "phone"],
                watch("country")
              )}
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
                setValue: (value) =>
                  setValue("phoneNumber.0.code", value?.code!),
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
            label="can you do this"
            {...register("canDoThis")}
            {...booleanSelectorProps()}
          />
        </Form>
      </Container>

      <Container variant="form" className="Form">
        <MiniForm onSubmit={miniHS(onSubmit)}>
          <Input {...miniR("value", { required: true })} />
        </MiniForm>
      </Container>

      <Container variant="form" className="Form">
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

          <textarea {...register("country")} />
        </form>
      </Container>
    </main>
  );
};

export default FormUI;
