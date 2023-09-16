const GOVERNORATE = {
  Alexandria: "الاسكندرية",
  Aswan: "أسوان",
  Asyut: "أسيوط",
  Beheira: "البحيرة",
  BeniSuef: "بني سويف",
  Cairo: "القاهرة",
  Dakahlia: "الدقهلية",
  Damietta: "دمياط",
  Faiyum: "الفيوم",
  Gharbia: "الغربية",
  Giza: "الجيزة",
  Ismailia: "الإسماعلية",
  KafrElSheikh: "كفر الشيخ",
  Luxor: "اﻷقصر",
  Matruh: "مطروح",
  Minya: "المنيا",
  Monufia: "المنوفية",
  NewValley: "الوادي الجديد",
  NorthSinai: "شمال سيناء",
  PortSaid: "بورسعيد",
  Qalyubia: "القليوبية",
  Qena: "قنا",
  RedSea: "البحر اﻷحمر",
  Sharqia: "الشرقية",
  Sohag: "سوهاج",
  SouthSinai: "جنوب سيناء",
  Suez: "السويس",
} as const;

export function resolveGovernorate(value?: string) {
  return value?.startsWith("EG.")
    ? GOVERNORATE[value.slice(3) as keyof typeof GOVERNORATE]
    : (value as (string & {}) | undefined);
}

const GENDER = {
  male: "ذكر",
  female: "أنثى",
} as const;

export function resolveGender(value?: string) {
  return value && GENDER[value as keyof typeof GENDER];
}

const LEAD = {
  facebook: "الفيسبوك",
  linkedin: "لينكدان",
  tiktok: "التبك توك",
  friend: "احد طلاب المبادرة / صديق",
  other: "اخرى",
} as const;

export function resolveLead(value?: string) {
  return value && LEAD[value as keyof typeof LEAD];
}
