export interface DateInDB {
  nanoseconds: number;
  seconds: number;
}

export const getAge = (date: string | number | Date) => {
  const today = new Date();
  const birthDate = new Date(date);
  let age = today.getFullYear() - birthDate.getFullYear();
  const m = today.getMonth() - birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }

  return age;
};

export const historyRep = (date: Date): string => {
  return date.toDateString();
};

export const shortDateRep = (date: Date): string => {
  const now = new Date();
  const year =
    now.getFullYear() === date.getFullYear()
      ? ""
      : now.getFullYear() < 2000
      ? `/${now.getFullYear()}`
      : `/${date.getFullYear() - 2000}`;

  return `${date.getDate()}/${date.getMonth() + 1}${year}`;
};

export const dateFromDB = (date: DateInDB): Date => {
  return new Date(date.seconds * 1000);
};
