import { NumberArray } from "react-native-svg";
import { ExtraWork } from "./interfaces-extra_works";

export type ProtectiveTreatmentInput = {
  treatment: ProtectiveTreatment | null;
  quantity: number;
  who: WhoDidProtectiveTreatment | null;
  treatment_type: ExtraWork | null;
};

export type ProtectiveTreatmentDTO = {
  id____: string;
  dscrpt: string;
  typ: string;
  params: string | null;
};
export type ProtectiveTreatment = {
  id____: number;
  dscrpt: string;
  typ: string;
  params: null | NitrogenParam;
};
export type NitrogenParam = { nitrogen: boolean };

export const WhoDidProtectiveTreatmentValues = {
  ROBOT: "ROBOT",
  ZESPOL: "ZESPOL",
} as const;
export type WhoDidProtectiveTreatment =
  keyof typeof WhoDidProtectiveTreatmentValues;
// export type WhoDidProtectiveTreatment = "ROBOT" | "ZESPOL";
// export type TreatmentType = "214_technologia" | "300_klient" | "303_prewencja";

export type ProtectiveTreatmentSendDataDTO = {
  scanned_raw_value: string;

  //zp
  sordid: number | null;
  ordnmb: string;
  stkcnt: number;

  //treatment
  tretid: number;
  lvalue: number;
  is_aut: boolean;

  //localization
  planam: string;

  //extra work
  activityid: number;
  prev_percentage: number;
  stkcnt_loc: number;
  stkcnt_ordnmb: number;
  act_percentage: number;
};

export type ProtectiveTreatmentsResponse = string[];
