import { Constructor } from "type-fest";
import { z, ZodError, ZodTypeDef } from "zod";

import { applyUpdates, devOnly } from "utils";

import { DeepUnion, UpdateObject } from "../types";

export default function DataModel<DataIn extends {}, DataOut extends {}>(
  schema: z.Schema<DataOut, ZodTypeDef, DataIn>,
  onUpdate?: (newData: DeepUnion<DataIn, DataOut>) => void
) {
  return class DataModel {
    readonly id!: string;
    readonly data!: DataOut;

    constructor(
      id: string,
      data: DataIn,
      onFailure: (
        error: ZodError<DataIn>,
        data: DataIn,
        instance: DataModel
      ) => void = devOnly((error) => console.log("Parsing Failed", error))
    ) {
      Object.defineProperty(this, "id", { value: id });

      const result = schema.safeParse(data);

      if (result.success) {
        Object.defineProperty(this, "data", { value: result.data });
      } else {
        console.log(data);

        onFailure(result.error, data, this);
      }
    }

    get meta(): DataOut extends { meta: infer M } ? M : never {
      return (this.data as any)?.meta;
    }

    update(updates: UpdateObject<DataIn>) {
      const newData: any = applyUpdates(this.data, updates);
      onUpdate?.(newData);
      return new (this.constructor as Constructor<this, [string, DataIn]>)(
        this.id,
        newData
      );
    }
  };
}
