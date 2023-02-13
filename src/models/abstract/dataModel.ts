import { Constructor } from "type-fest";
import { z, ZodError, ZodTypeDef } from "zod";

import { applyUpdates, devOnly, identity } from "utils";

import { DeepUnion, UpdateObject } from "../types";

export default function DataModel<DataIn extends {}, DataOut extends {}>(
  schema: z.Schema<DataOut, ZodTypeDef, DataIn>,
  onUpdate: (
    newData: DeepUnion<DataIn, DataOut>
  ) => DeepUnion<DataIn, DataOut> = identity
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
        onFailure(result.error, data, this);
      }
    }

    get meta(): DataOut extends { meta: infer M } ? M : never {
      return (this.data as any)?.meta;
    }

    update(updates: UpdateObject<DataIn>) {
      return new (this.constructor as Constructor<this, [string, DataIn]>)(
        this.id,
        onUpdate(applyUpdates(this.data, updates) as any) as any
      );
    }
  };
}
