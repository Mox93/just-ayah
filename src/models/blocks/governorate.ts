export const governorate = [
  "Cairo",
  "Alexandria",
  "Monufia",
  "Gharbia",
  "Dakahlia",
  "Qalyubia",
  "Ismailia",
  "Faiyum",
  "BeniSuef",
  "Sohag",
  "Asyut",
  "Qena",
  "Minya",
  "Luxor",
  "Aswan",
  "Matruh",
  "PortSaid",
  "Damietta",
  "RedSea",
  "Giza",
  "KafrElSheikh",
  "NewValley",
  "Beheira",
  "Sharqia",
  "Suez",
  "NorthSinai",
  "SouthSinai",
] as const;

export type Governorate = typeof governorate[number];

export const EG_PREFIX = "EG.";
export const egStrip = (value: string) => value.replace(EG_PREFIX, "");

export const egGovernorate = governorate.map((value) => `${EG_PREFIX}${value}`);

export const handleEgGov = (value: string, g: (value: string) => string) => {
  return value.startsWith(EG_PREFIX) ? g(egStrip(value)) : value;
};
