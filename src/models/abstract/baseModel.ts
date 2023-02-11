import { devOnly } from "utils";
import { z, ZodError, ZodTypeDef } from "zod";

export default function BaseModel<DataIn extends {}, DataOut extends {}>(
  schema: z.Schema<DataOut, ZodTypeDef, DataIn>
) {
  return class BaseModel {
    readonly data!: DataOut;

    constructor(
      data: DataIn,
      onFailure: (
        error: ZodError<DataIn>,
        data: DataIn,
        instance: BaseModel
      ) => void = devOnly((error) => console.log("Parsing Failed", error))
    ) {
      const result = schema.safeParse(data);

      if (result.success) {
        Object.defineProperty(this, "data", {
          value: result.data,
        });
      } else {
        onFailure?.(result.error, data, this);
      }
    }
  };
}
