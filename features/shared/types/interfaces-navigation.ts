// export const NavPaths = {
//   INDEX: { name: "menu", link: "/" },
//   EXTRA_WORKS: { name: "prace dodatkowe", link: "/app/extra_works" },
// } as const;
// export type NavPathsEnum = keyof typeof NavPaths;

import { router } from "expo-router";

export type NavElement = {
  name: string;
  actionFn: () => void;
};

export const INDEX: NavElement = {
  actionFn: () => router.push("/"),
  name: "Menu",
} as const;
// export const FIELD_CROPS: NavElement = {
//   actionFn: () => router.push("/app/field_crops"),
//   name: "Rozsady gruntowe",
// };
// export const FIELD_CROPS_WORKS: NavElement = {
//   actionFn: () => router.push("/app/field_crops/field_crops_works"),
//   name: "Rozsady gruntowe - prace",
// };
// export const TRAY_OPERATIONS: NavElement = {
//   actionFn: () => router.push("/app/field_crops/tray_operations"),
//   name: "Operacje na tacach",
// };
// export const GENERAL_WORKS: NavElement = {
//   actionFn: () => router.push("/app/general_works"),
//   name: "Prace ogólne",
// };
// export const EXTRA_WORKS_HOBBY: NavElement = {
//   actionFn: () => router.push("/app/field_crops/extra_works_hobby"),
//   name: "Prace Hobby",
// };
// export const CUT_GRU: NavElement = {
//   actionFn: () => router.push("/app/field_crops/field_crops_works/cut"),
//   name: "Cięcie GRU",
// };
// export const WATERING_PLANTS: NavElement = {
//   actionFn: () => router.push("/app/general_works/watering_plants"),
//   name: "Podlewanie roślin",
// };
// export const GREENHOUSE_CROPS: NavElement = {
//   actionFn: () => router.push("/app/greenhouse_crops"),
//   name: "Uprawy szklarniowe",
// };
// export const GREENHOUSE_CROPS_WORKS: NavElement = {
//   actionFn: () => router.push("/app/greenhouse_crops/greenhouse_crops_works"),
//   name: "Uprawy szklarniowe - prace",
// };
// export const NITROGEN_IRRIGATION: NavElement = {
//   actionFn: () =>
//     router.push("/app/field_crops/field_crops_works/nitrogen_irrigation"),
//   name: "Podlewanie azotem",
// };

export const SCANNER: NavElement = {
  actionFn: () => {},
  name: "skaner",
} as const;
export const QUANTITY_FORM: NavElement = {
  actionFn: () => {},
  name: "Podaj Ilość",
} as const;

export type SubNavigationElement = {
  title: string;
  actionFn: () => void;
};
