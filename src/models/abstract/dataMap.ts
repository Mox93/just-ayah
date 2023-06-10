import { UpdateData } from "firebase/firestore";
import { Constructor } from "type-fest";

import { DataModel } from "../types";

export default class DataMap<T extends DataModel> extends Map<string, T> {
  prepend(...dataList: T[]) {
    return new (this.constructor as Constructor<typeof this>)([
      ...dataList.map((data) => [data.id, data]),
      ...this,
    ]);
  }

  append(...dataList: T[]) {
    return new (this.constructor as Constructor<typeof this>)([
      ...this,
      ...dataList.map((data) => [data.id, data]),
    ]);
  }

  update(id: string, updates: UpdateData<T["data"]>) {
    const constructor = this.constructor as Constructor<typeof this>;
    const value = this.get(id);

    if (!value) return this;

    this.set(id, value.update(updates));

    return new constructor(...this);
  }

  map<U>(...args: Parameters<T[]["map"]>) {
    return [...this.values()].map<U>(...(args as [any]));
  }
}
