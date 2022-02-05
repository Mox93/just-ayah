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

export const egPrefix = "EG.";
export const egStrip = (value: string) => value.replace(egPrefix, "");

export const governorateList = governorate.map(
  (element) => `${egPrefix}${element}`
);

export const handleEgGov = (value: string, g: (value: string) => string) => {
  return value.startsWith(egPrefix) ? g(egStrip(value)) : value;
};
