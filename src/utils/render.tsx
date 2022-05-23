export const renderAttributes =
  <Obj,>(...fields: (keyof Obj | ((obj: Obj) => any))[]) =>
  (obj?: Obj) => {
    if (!obj) return;

    const parts: any[] = [];

    for (let field of fields) {
      if (typeof field === "string") {
        parts.push(obj[field]);
      } else if (typeof field === "function") {
        parts.push(field(obj));
      }
    }

    return parts.map((part, index) => <div key={index}>{part}</div>);
  };
