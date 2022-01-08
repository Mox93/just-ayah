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

export const dateFromDB = (date: DateInDB): Date => {
  return new Date(date.seconds * 1000);
};
