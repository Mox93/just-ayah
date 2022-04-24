export const renderAttributes =
  <Obj,>(...keys: (keyof Obj)[]) =>
  (obj?: Obj) =>
    obj && (
      <>
        {keys.map((key) => (
          <p key={key as string}>{obj[key]}</p>
        ))}
      </>
    );
