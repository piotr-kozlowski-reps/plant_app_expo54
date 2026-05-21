import path from "path";

export const appDocsMainConfig = {
  outputDir: "docs",
  appDir: path.join(process.cwd(), "app", "app"),
  appName: "TraceON APP",
};

// import { DocsConfig } from "./generateDocsTypes";

// export const generateDocsConfig: DocsConfig = {
//   inputDirs: [
//     {
//       dir: "features/auth",
//       outputFileName: "autoryzacja_autentykacja",
//       label: "Autoryzacja / Autentykacja",
//     },
//     {
//       dir: "features/app/information/scan_zp",
//       outputFileName: "informacja___skanuj_ZP",
//       label: "Informacja -> skanuj ZP",
//     },
//     {
//       dir: "features/app/information/search_zp",
//       outputFileName: "informacja___wyszukaj_ZP",
//       label: "Informacja -> wyszukaj ZP",
//     },
//     {
//       dir: "features/app/information/search_by_client",
//       outputFileName: "informacja___wyszukaj_klienta_z_listy",
//       label: "Informacja -> wyszukaj klienta z listy",
//     },
//     {
//       dir: "features/app/information/technological_information",
//       outputFileName: "informacja___informacja_technologiczna",
//       label: "Informacja -> Informacja technologiczna",
//     },
//     {
//       dir: "features/app/field_crops/field_crops_works/plants_coming_ups_counter",
//       outputFileName: "rozsady_gruntowe___przeliczanie_wschodow",
//       label: "Rozsady gruntowe -> Przeliczanie wschodów",
//     },
//     {
//       dir: "features/app/field_crops/field_crops_works/protective_treatment",
//       outputFileName: "rozsady_gruntowe___zabieg_ochronny",
//       label: "Rozsady gruntowe -> Zabieg ochronny",
//     },
//   ],
//   outputDir: "docs",
// };
