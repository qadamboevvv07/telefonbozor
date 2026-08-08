export const SITE = {
  name: "Telefon Bozor",
  tagline: "Xorazm bo'ylab #1 telefon do'koni",
  phone: "+998 93 746 79 99",
  phoneHref: "tel:+998937467999",
  hours: "08:30 – 19:00",
  hoursNote: "Har kuni 08:30 dan 19:00 gacha telefon chaqiruvlariga javob beramiz",

  // Instagram
  instagram: "telefonbozorxorazm",
  instagramUrl: "https://instagram.com/telefonbozorxorazm",

  // Telegram Kanal
  telegramChannel: "telefonbozorxorazm_official",
  telegramChannelUrl: "https://t.me/telefonbozorxorazm_official",

  // Telegram Admin
  telegramAdmin: "telefonbozorxorazm_admin",
  telegramAdminUrl: "https://t.me/telefonbozorxorazm_admin",
};

export type Branch = {
  id: number;
  name: string;
  address: string;
  hours: string;
  phone?: string;
};

export const BRANCHES: Branch[] = [
  {
    id: 1,
    name: "1-Filial (Telefon Bozor)",
    address: "Urganch shahar, Dehqon bozor, 9-etaj binosi pastida",
    hours: "08:30 – 19:00",
    phone: "+998 93 746 79 99",
  },
  {
    id: 2,
    name: "2-Filial (Telefonlar Markazi)",
    address: "Urganch shahar, Dehqon bozor, 9-etaj binosi pastida",
    hours: "08:30 – 19:00",
    phone: "+998 93 746 79 99",
  },
  {
    id: 3,
    name: "3-Filial (Telefonlar Markazi)",
    address: "Urganch shahar, Dehqon bozor, SUM ro'parasida Telefonlar markazi",
    hours: "08:30 – 19:00",
    phone: "+998 93 746 79 99",
  },
  {
    id: 4,
    name: "4-Filial (Telefonlar Markazi)",
    address: "Urganch shahar, Urologiya yon tomonida",
    hours: "08:30 – 19:00",
    phone: "+998 93 746 79 99",
  },
];

export const BRANDS = [
  "Apple", "Samsung", "Xiaomi", "Huawei", "Honor", "Vivo",
  "Nokia", "Anker", "Baseus",
];

export const ADMIN_CREDENTIALS = {
  login: "Telefon.bozor",
  password: "qwerty112233",
};