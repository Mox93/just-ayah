import { Constructor } from "type-fest";
import { z, ZodError, ZodTypeDef } from "zod";

import { applyUpdates, devOnly, identity } from "utils";

import { enrollSchema } from "../blocks";
import { DeepUnion, UpdateObject } from "../types";

export const externalUserSchema = z
  .object({
    enroll: enrollSchema,
  })
  .passthrough();

export default function ExternalUser<DataIn extends {}, DataOut extends {}>(
  schema: z.Schema<DataOut, ZodTypeDef, DataIn>,
  urlPath: string,
  onUpdate: (
    newData: DeepUnion<DataIn, DataOut>
  ) => DeepUnion<DataIn, DataOut> = identity
) {
  return class ExternalUser {
    readonly id!: string;
    readonly data!: DataOut;

    constructor(
      id: string,
      data: DataIn,
      onFailure: (
        error: ZodError<DataIn>,
        data: DataIn,
        instance: ExternalUser
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

    get enrollUrl() {
      const url = new URL(window.location.href);
      url.pathname = `/${urlPath}/${this.id}`;
      return url.href;
    }

    get enroll(): DataOut extends { enroll: infer E } ? E : never {
      return (this.data as any)?.enroll;
    }

    update(updates: UpdateObject<DataIn>) {
      return new (this.constructor as Constructor<this, [string, DataIn]>)(
        this.id,
        onUpdate(applyUpdates(this.data, updates) as any) as any
      );
    }
  };
}
