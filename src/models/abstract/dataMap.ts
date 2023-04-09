import { UpdateData } from "firebase/firestore";
import { Constructor } from "type-fest";

import { DataModel } from "../types";

export default class DataMap<T extends DataModel> extends Map<string, T> {
  addAt(position: "start" | "end", ...dataList: T[]) {
    const mappedData = dataList.map((data) => [data.id, data] as const);

    return new (this.constructor as Constructor<typeof this>)([
      ...(position === "start" ? mappedData : []),
      ...this,
      ...(position === "end" ? mappedData : []),
    ]);
  }

  updateAt(id: string, updates: UpdateData<T["data"]>) {
    const init = this.constructor as Constructor<typeof this>;
    const value = this.get(id);

    if (!value) return this;

    this.set(id, value.update(updates));

    return new init(...this);
  }

  map<U>(...args: Parameters<T[]["map"]>) {
    return [...this.values()].map<U>(...(args as [any]));
  }
}
